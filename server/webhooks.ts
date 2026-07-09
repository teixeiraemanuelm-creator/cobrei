import { getDb } from "./db";
import { charges, transactions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

/**
 * Webhook Pix Management
 * Funções para processar webhooks de confirmação de pagamento Pix
 */

interface PixWebhookPayload {
  pixId: string;
  chargeId: number;
  amount: number;
  timestamp: string;
  signature?: string;
}

/**
 * Valida a assinatura do webhook
 * Em produção, usar a assinatura fornecida pelo provedor de Pix
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("[Webhook] Signature validation failed:", error);
    return false;
  }
}

/**
 * Processa um webhook de pagamento Pix
 * Atualiza o status da cobrança para "paid"
 */
export async function processPixWebhook(payload: PixWebhookPayload): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return false;
  }

  try {
    // Buscar a cobrança
    const charge = await db
      .select()
      .from(charges)
      .where(eq(charges.id, payload.chargeId))
      .limit(1);

    if (!charge.length) {
      console.error("[Webhook] Charge not found:", payload.chargeId);
      return false;
    }

    // Verificar se já foi processado
    const existingTransaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.pixId, payload.pixId))
      .limit(1);

    if (existingTransaction.length) {
      console.warn("[Webhook] Transaction already processed:", payload.pixId);
      return true;
    }

    // Validar valor
    if (charge[0].amount !== payload.amount) {
      console.error("[Webhook] Amount mismatch:", {
        expected: charge[0].amount,
        received: payload.amount,
      });
      return false;
    }

    // Atualizar status da cobrança
    await db
      .update(charges)
      .set({
        status: "paid",
        paidAt: new Date(),
      })
      .where(eq(charges.id, payload.chargeId));

    // Registrar transação
    await db.insert(transactions).values({
      chargeId: payload.chargeId,
      companyId: charge[0].companyId,
      amount: payload.amount,
      pixId: payload.pixId,
      status: "confirmed",
    });

    console.log("[Webhook] Payment processed successfully:", {
      chargeId: payload.chargeId,
      pixId: payload.pixId,
      amount: payload.amount,
    });

    return true;
  } catch (error) {
    console.error("[Webhook] Failed to process webhook:", error);
    return false;
  }
}

/**
 * Processa um webhook de falha de pagamento
 */
export async function processPixWebhookFailure(payload: PixWebhookPayload): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return false;
  }

  try {
    // Buscar a cobrança
    const charge = await db
      .select()
      .from(charges)
      .where(eq(charges.id, payload.chargeId))
      .limit(1);

    if (!charge.length) {
      console.error("[Webhook] Charge not found:", payload.chargeId);
      return false;
    }

    // Registrar transação com status de falha
    await db.insert(transactions).values({
      chargeId: payload.chargeId,
      companyId: charge[0].companyId,
      amount: payload.amount,
      pixId: payload.pixId,
      status: "failed",
    });

    console.log("[Webhook] Payment failure recorded:", {
      chargeId: payload.chargeId,
      pixId: payload.pixId,
    });

    return true;
  } catch (error) {
    console.error("[Webhook] Failed to process failure webhook:", error);
    return false;
  }
}

/**
 * Gera um webhook secret para uma empresa
 * Usado para validar webhooks recebidos
 */
export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Valida o payload do webhook
 */
export function validateWebhookPayload(payload: unknown): payload is PixWebhookPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const p = payload as Record<string, unknown>;

  return (
    typeof p.pixId === "string" &&
    typeof p.chargeId === "number" &&
    typeof p.amount === "number" &&
    typeof p.timestamp === "string" &&
    p.amount > 0
  );
}
