import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { processPixWebhook, validateWebhookPayload } from "../webhooks";
import { webhookValidationMiddleware } from "./webhook-validation";
import { processWhatsAppWebhook, validateWhatsAppWebhook } from "../whatsapp-webhook";

/**
 * Monta a aplicação Express (rotas de API, OAuth, webhooks e tRPC) sem
 * chamar app.listen() e sem servir estáticos — isso permite reusar o mesmo
 * app tanto no servidor tradicional (server/_core/index.ts, dev local) quanto
 * como Vercel Serverless Function (api/[...path].ts em produção), onde os
 * arquivos estáticos do build do Vite já são servidos direto pela CDN da Vercel.
 */
export function createApp() {
  const app = express();
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

  return app;
}
