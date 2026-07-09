/**
 * WhatsApp Webhook Handler
 * Recebe e processa eventos de mensagens do WhatsApp Business API
 */

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: {
            body: string;
          };
          interactive?: {
            type: string;
            button_reply?: {
              id: string;
              title: string;
            };
          };
        }>;
        statuses?: Array<{
          id: string;
          status: "delivered" | "read" | "failed" | "sent";
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

/**
 * Processar webhook do WhatsApp
 * Tipos de eventos: messages, message_status, message_template_status_update
 */
export async function processWhatsAppWebhook(payload: WhatsAppWebhookPayload) {
  try {
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        // Processar mensagens recebidas
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            await handleIncomingMessage(message, value.metadata.display_phone_number);
          }
        }

        // Processar status de mensagens enviadas
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            await handleMessageStatus(status, value.metadata.display_phone_number);
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error("[WhatsApp Webhook] Erro ao processar webhook:", error);
    return false;
  }
}

/**
 * Processar mensagem recebida do WhatsApp
 */
async function handleIncomingMessage(
  message: any,
  displayPhoneNumber: string
) {
  console.log(`[WhatsApp] Mensagem recebida de ${message.from}:`, message.text?.body);

  // TODO: Integrar com banco de dados
  // - Buscar empresa pelo número de telefone
  // - Buscar cliente pelo número de WhatsApp
  // - Armazenar mensagem em notifications table
  // - Processar comando se for uma resposta (ex: "confirmar pagamento")

  try {
    // Exemplo: Se a mensagem contém "pago" ou "confirmado", marcar cobrança como paga
    if (message.text?.body) {
      const text = message.text.body.toLowerCase();

      if (text.includes("pago") || text.includes("confirmado") || text.includes("ok")) {
        console.log("[WhatsApp] Possível confirmação de pagamento detectada");
        // TODO: Atualizar status da cobrança para "paid"
      }
    }
  } catch (error) {
    console.error("[WhatsApp] Erro ao processar mensagem:", error);
  }
}

/**
 * Processar status de mensagem enviada
 */
async function handleMessageStatus(
  status: any,
  displayPhoneNumber: string
) {
  console.log(`[WhatsApp] Status da mensagem ${status.id}: ${status.status}`);

  // TODO: Integrar com banco de dados
  // - Atualizar notifications table com status
  // - Se status === "failed", registrar erro e tentar reenviar
  // - Se status === "read", atualizar readAt timestamp

  try {
    if (status.status === "failed") {
      console.warn(`[WhatsApp] Falha ao enviar mensagem ${status.id}`);
      // TODO: Implementar retry logic
    }

    if (status.status === "read") {
      console.log(`[WhatsApp] Mensagem ${status.id} lida pelo cliente`);
      // TODO: Atualizar readAt timestamp
    }
  } catch (error) {
    console.error("[WhatsApp] Erro ao processar status:", error);
  }
}

/**
 * Validar webhook do WhatsApp
 * Retorna token de verificação se válido
 */
export function validateWhatsAppWebhook(
  mode: string,
  token: string,
  challenge: string,
  verifyToken: string
): string | null {
  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WhatsApp] Webhook verificado com sucesso");
    return challenge;
  }

  console.warn("[WhatsApp] Falha na verificação do webhook");
  return null;
}

/**
 * Enviar mensagem via WhatsApp Business API
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
  apiToken: string,
  phoneNumberId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[WhatsApp] Erro ao enviar mensagem:", error);
      return {
        success: false,
        error: error.error?.message || "Failed to send message",
      };
    }

    const data = await response.json();
    console.log("[WhatsApp] Mensagem enviada com sucesso:", data.messages[0].id);

    return {
      success: true,
      messageId: data.messages[0].id,
    };
  } catch (error) {
    console.error("[WhatsApp] Erro ao enviar mensagem:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Enviar template de mensagem via WhatsApp
 */
export async function sendWhatsAppTemplate(
  phoneNumber: string,
  templateName: string,
  templateLanguage: string,
  parameters: Record<string, string>,
  apiToken: string,
  phoneNumberId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: templateLanguage,
            },
            components: [
              {
                type: "body",
                parameters: Object.values(parameters).map((value) => ({
                  type: "text",
                  text: value,
                })),
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[WhatsApp] Erro ao enviar template:", error);
      return {
        success: false,
        error: error.error?.message || "Failed to send template",
      };
    }

    const data = await response.json();
    console.log("[WhatsApp] Template enviado com sucesso:", data.messages[0].id);

    return {
      success: true,
      messageId: data.messages[0].id,
    };
  } catch (error) {
    console.error("[WhatsApp] Erro ao enviar template:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}
