import crypto from "crypto";

/**
 * Validar assinatura de webhook usando HMAC-SHA256
 * Padrão: X-Signature header contém HMAC-SHA256 do corpo com chave secreta
 */
export function validateWebhookSignature(
  body: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) {
    console.warn("[Webhook] Assinatura ausente");
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    // Comparação timing-safe para evitar timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    return isValid;
  } catch (error) {
    console.error("[Webhook] Erro ao validar assinatura:", error);
    return false;
  }
}

/**
 * Gerar assinatura para webhook (para testes)
 */
export function generateWebhookSignature(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

/**
 * Validar timestamp do webhook (evitar replay attacks)
 * Padrão: X-Timestamp header com timestamp Unix em segundos
 * Aceita webhooks com até 5 minutos de atraso
 */
export function validateWebhookTimestamp(
  timestamp: string | undefined,
  maxAgeSeconds: number = 300
): boolean {
  if (!timestamp) {
    console.warn("[Webhook] Timestamp ausente");
    return false;
  }

  try {
    const webhookTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = Math.abs(currentTime - webhookTime);

    if (timeDiff > maxAgeSeconds) {
      console.warn(`[Webhook] Timestamp expirado: ${timeDiff}s > ${maxAgeSeconds}s`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Webhook] Erro ao validar timestamp:", error);
    return false;
  }
}

/**
 * Middleware Express para validar webhooks
 */
export function webhookValidationMiddleware(secret: string) {
  return (req: any, res: any, next: any) => {
    const signature = req.headers["x-signature"] as string;
    const timestamp = req.headers["x-timestamp"] as string;
    const body = req.rawBody || JSON.stringify(req.body);

    // Validar timestamp
    if (!validateWebhookTimestamp(timestamp)) {
      console.warn("[Webhook] Timestamp inválido ou expirado");
      return res.status(401).json({ error: "Invalid or expired timestamp" });
    }

    // Validar assinatura
    if (!validateWebhookSignature(body, signature, secret)) {
      console.warn("[Webhook] Assinatura inválida");
      return res.status(401).json({ error: "Invalid signature" });
    }

    next();
  };
}
