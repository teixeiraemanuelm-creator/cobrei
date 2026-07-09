import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { processPixWebhook, validateWebhookPayload } from "../webhooks";
import { webhookValidationMiddleware } from "./webhook-validation";
import { processWhatsAppWebhook, validateWhatsAppWebhook } from "../whatsapp-webhook";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // Webhook endpoint for Pix payment confirmations
  app.post(
    "/api/webhooks/pix",
    webhookValidationMiddleware(process.env.PIX_WEBHOOK_SECRET || "test-secret"),
    async (req, res) => {
      try {
        const payload = req.body;

        if (!validateWebhookPayload(payload)) {
          console.error("[Webhook] Invalid payload:", payload);
          res.status(400).json({ error: "Invalid payload" });
          return;
        }

        const success = await processPixWebhook(payload);

        if (success) {
          res.status(200).json({ success: true, message: "Webhook processed" });
        } else {
          res.status(500).json({ error: "Failed to process webhook" });
        }
      } catch (error) {
        console.error("[Webhook] Error processing webhook:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Webhook endpoint for WhatsApp messages (verificação do Meta)
  app.get("/api/webhooks/whatsapp", (req, res) => {
    const mode = req.query.hub_mode as string;
    const token = req.query.hub_verify_token as string;
    const challenge = req.query.hub_challenge as string;
    const verifyToken = process.env.WHATSAPP_WEBHOOK_TOKEN || "test-token";

    const result = validateWhatsAppWebhook(mode, token, challenge, verifyToken);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  });

  app.post("/api/webhooks/whatsapp", async (req, res) => {
    try {
      const payload = req.body;
      const success = await processWhatsAppWebhook(payload);

      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to process webhook" });
      }
    } catch (error) {
      console.error("[WhatsApp Webhook] Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
