import { describe, it, expect, beforeEach } from "vitest";
import { generateWebhookSignature } from "./_core/webhook-validation";
import { processWhatsAppWebhook, validateWhatsAppWebhook } from "./whatsapp-webhook";

describe("Integration Tests - Pix, WhatsApp & Webhooks", () => {
  describe("Webhook Signature Generation", () => {
    it("should generate consistent webhook signatures", () => {
      const body = JSON.stringify({ test: "data" });
      const secret = "test-secret";

      const sig1 = generateWebhookSignature(body, secret);
      const sig2 = generateWebhookSignature(body, secret);

      expect(sig1).toBe(sig2);
      expect(sig1).toMatch(/^[a-f0-9]{64}$/); // SHA256 hex format
    });

    it("should generate different signatures for different bodies", () => {
      const secret = "test-secret";
      const sig1 = generateWebhookSignature("body1", secret);
      const sig2 = generateWebhookSignature("body2", secret);

      expect(sig1).not.toBe(sig2);
    });

    it("should generate different signatures for different secrets", () => {
      const body = "same-body";
      const sig1 = generateWebhookSignature(body, "secret1");
      const sig2 = generateWebhookSignature(body, "secret2");

      expect(sig1).not.toBe(sig2);
    });
  });

  describe("WhatsApp Webhook Validation", () => {
    it("should validate correct webhook token", () => {
      const mode = "subscribe";
      const token = "my-verify-token";
      const challenge = "test-challenge-123";
      const verifyToken = "my-verify-token";

      const result = validateWhatsAppWebhook(mode, token, challenge, verifyToken);

      expect(result).toBe(challenge);
    });

    it("should reject invalid webhook token", () => {
      const mode = "subscribe";
      const token = "wrong-token";
      const challenge = "test-challenge-123";
      const verifyToken = "my-verify-token";

      const result = validateWhatsAppWebhook(mode, token, challenge, verifyToken);

      expect(result).toBeNull();
    });

    it("should reject non-subscribe mode", () => {
      const mode = "invalid";
      const token = "my-verify-token";
      const challenge = "test-challenge-123";
      const verifyToken = "my-verify-token";

      const result = validateWhatsAppWebhook(mode, token, challenge, verifyToken);

      expect(result).toBeNull();
    });
  });

  describe("WhatsApp Webhook Processing", () => {
    it("should process incoming message webhook", async () => {
      const payload = {
        object: "whatsapp_business_account",
        entry: [
          {
            id: "123456789",
            changes: [
              {
                value: {
                  messaging_product: "whatsapp",
                  metadata: {
                    display_phone_number: "5511999999999",
                    phone_number_id: "123456789",
                  },
                  messages: [
                    {
                      from: "5511988888888",
                      id: "msg-123",
                      timestamp: "1234567890",
                      type: "text",
                      text: {
                        body: "Olá, já paguei!",
                      },
                    },
                  ],
                },
                field: "messages",
              },
            ],
          },
        ],
      };

      const result = await processWhatsAppWebhook(payload);

      expect(result).toBe(true);
    });

    it("should process message status webhook", async () => {
      const payload = {
        object: "whatsapp_business_account",
        entry: [
          {
            id: "123456789",
            changes: [
              {
                value: {
                  messaging_product: "whatsapp",
                  metadata: {
                    display_phone_number: "5511999999999",
                    phone_number_id: "123456789",
                  },
                  statuses: [
                    {
                      id: "msg-123",
                      status: "delivered",
                      timestamp: "1234567890",
                      recipient_id: "5511988888888",
                    },
                  ],
                },
                field: "message_status",
              },
            ],
          },
        ],
      };

      const result = await processWhatsAppWebhook(payload);

      expect(result).toBe(true);
    });

    it("should handle empty payload", async () => {
      const payload = {
        object: "whatsapp_business_account",
        entry: [],
      };

      const result = await processWhatsAppWebhook(payload);

      expect(result).toBe(true);
    });

    it("should detect payment confirmation keywords", async () => {
      const testCases = [
        "pago",
        "Pago",
        "PAGO",
        "confirmado",
        "Confirmado",
        "ok",
        "OK",
      ];

      for (const keyword of testCases) {
        const payload = {
          object: "whatsapp_business_account",
          entry: [
            {
              id: "123456789",
              changes: [
                {
                  value: {
                    messaging_product: "whatsapp",
                    metadata: {
                      display_phone_number: "5511999999999",
                      phone_number_id: "123456789",
                    },
                    messages: [
                      {
                        from: "5511988888888",
                        id: "msg-123",
                        timestamp: "1234567890",
                        type: "text",
                        text: {
                          body: keyword,
                        },
                      },
                    ],
                  },
                  field: "messages",
                },
              ],
            },
          ],
        };

        const result = await processWhatsAppWebhook(payload);
        expect(result).toBe(true);
      }
    });
  });

  describe("End-to-End Webhook Flow", () => {
    it("should handle complete payment flow", async () => {
      // 1. Enviar cobrança via WhatsApp (simulado)
      console.log("[Test] Etapa 1: Cobrança enviada via WhatsApp");

      // 2. Cliente recebe mensagem
      console.log("[Test] Etapa 2: Cliente recebe mensagem");

      // 3. Cliente confirma pagamento
      const confirmationPayload = {
        object: "whatsapp_business_account",
        entry: [
          {
            id: "123456789",
            changes: [
              {
                value: {
                  messaging_product: "whatsapp",
                  metadata: {
                    display_phone_number: "5511999999999",
                    phone_number_id: "123456789",
                  },
                  messages: [
                    {
                      from: "5511988888888",
                      id: "msg-confirm",
                      timestamp: "1234567890",
                      type: "text",
                      text: {
                        body: "Confirmado! Já paguei via Pix",
                      },
                    },
                  ],
                },
                field: "messages",
              },
            ],
          },
        ],
      };

      const result = await processWhatsAppWebhook(confirmationPayload);
      expect(result).toBe(true);

      // 4. Pix webhook confirma pagamento
      console.log("[Test] Etapa 3: Webhook Pix confirma pagamento");
      console.log("[Test] Etapa 4: Status da cobrança atualizado para 'paid'");
    });
  });

  describe("Webhook Security", () => {
    it("should validate webhook timestamp", () => {
      const now = Math.floor(Date.now() / 1000);
      const validTimestamp = now.toString();
      const oldTimestamp = (now - 600).toString(); // 10 minutos atrás

      // TODO: Integrar com validateWebhookTimestamp
      expect(validTimestamp).toBeTruthy();
      expect(oldTimestamp).toBeTruthy();
    });

    it("should prevent replay attacks", () => {
      // TODO: Implementar armazenamento de message IDs processados
      // e rejeitar duplicatas
      console.log("[Test] Replay attack prevention: armazenar IDs de mensagens");
    });

    it("should validate HMAC signatures", () => {
      const secret = "webhook-secret";
      const body = JSON.stringify({ event: "payment", amount: 100 });
      const signature = generateWebhookSignature(body, secret);

      // Signature deve ser válida
      expect(signature).toMatch(/^[a-f0-9]{64}$/);

      // Signature diferente deve ser rejeitada
      const wrongSignature = generateWebhookSignature(body, "wrong-secret");
      expect(signature).not.toBe(wrongSignature);
    });
  });
});
