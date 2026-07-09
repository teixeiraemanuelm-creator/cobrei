import {
  loadWhatsAppConfig,
  formatWhatsAppPhoneNumber,
  replacePlaceholders,
  isWhatsAppConfigured,
  DEFAULT_WHATSAPP_MESSAGES,
} from "./whatsapp-config";

/**
 * WhatsApp Message Service
 * Serviço para enviar mensagens via WhatsApp Business API
 */

interface WhatsAppMessage {
  to: string;
  type: "text" | "template";
  text?: string;
  template?: {
    name: string;
    language: {
      code: string;
    };
    parameters?: {
      body: {
        parameters: string[];
      };
    };
  };
}

interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envia uma mensagem de texto via WhatsApp
 */
export async function sendWhatsAppTextMessage(
  phoneNumber: string,
  message: string
): Promise<SendMessageResponse> {
  if (!isWhatsAppConfigured()) {
    console.warn("[WhatsApp] WhatsApp not configured. Message not sent.");
    return {
      success: false,
      error: "WhatsApp not configured",
    };
  }

  try {
    const config = loadWhatsAppConfig();
    const formattedPhone = formatWhatsAppPhoneNumber(phoneNumber);

    const payload: WhatsAppMessage = {
      to: formattedPhone,
      type: "text",
      text: message,
    };

    const url = `${config.apiBaseUrl}/${config.apiVersion}/${config.phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[WhatsApp] Failed to send message:", error);
      return {
        success: false,
        error: error.message || "Failed to send message",
      };
    }

    const data = await response.json();

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error("[WhatsApp] Error sending message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Envia uma mensagem de notificação de cobrança
 */
export async function sendChargeNotification(
  phoneNumber: string,
  data: {
    clientName: string;
    amount: number;
    dueDate: string;
    pixKey: string;
  }
): Promise<SendMessageResponse> {
  const message = replacePlaceholders(DEFAULT_WHATSAPP_MESSAGES.CHARGE_NOTIFICATION, {
    clientName: data.clientName,
    amount: (data.amount / 100).toFixed(2),
    dueDate: data.dueDate,
    pixKey: data.pixKey,
  });

  return sendWhatsAppTextMessage(phoneNumber, message);
}

/**
 * Envia uma mensagem de lembrete de atraso
 */
export async function sendOverdueReminder(
  phoneNumber: string,
  data: {
    clientName: string;
    amount: number;
    daysOverdue: number;
    pixKey: string;
  }
): Promise<SendMessageResponse> {
  const message = replacePlaceholders(DEFAULT_WHATSAPP_MESSAGES.OVERDUE_REMINDER, {
    clientName: data.clientName,
    amount: (data.amount / 100).toFixed(2),
    daysOverdue: data.daysOverdue,
    pixKey: data.pixKey,
  });

  return sendWhatsAppTextMessage(phoneNumber, message);
}

/**
 * Envia uma mensagem de confirmação de pagamento
 */
export async function sendPaymentConfirmation(
  phoneNumber: string,
  data: {
    clientName: string;
    amount: number;
    transactionId: string;
  }
): Promise<SendMessageResponse> {
  const message = replacePlaceholders(DEFAULT_WHATSAPP_MESSAGES.PAYMENT_CONFIRMATION, {
    clientName: data.clientName,
    amount: (data.amount / 100).toFixed(2),
    transactionId: data.transactionId,
  });

  return sendWhatsAppTextMessage(phoneNumber, message);
}

/**
 * Envia uma mensagem com QR Code Pix
 */
export async function sendPixQRCode(
  phoneNumber: string,
  data: {
    clientName: string;
    amount: number;
    qrCodeUrl?: string;
    pixCopyPaste: string;
  }
): Promise<SendMessageResponse> {
  const message = `Olá ${data.clientName}! 👋

Aqui está seu QR Code Pix para pagamento de R$ ${(data.amount / 100).toFixed(2)}:

Ou copie e cole este código:
${data.pixCopyPaste}

Obrigado! 💚`;

  return sendWhatsAppTextMessage(phoneNumber, message);
}

/**
 * Valida se um número de telefone é válido para WhatsApp
 */
export function isValidWhatsAppPhone(phoneNumber: string): boolean {
  try {
    const formatted = formatWhatsAppPhoneNumber(phoneNumber);
    return formatted.length >= 12 && formatted.length <= 13;
  } catch {
    return false;
  }
}

/**
 * Simula envio de mensagem (para testes)
 */
export async function simulateWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<SendMessageResponse> {
  console.log(`[WhatsApp Simulation] Sending to ${phoneNumber}:`, message);

  return {
    success: true,
    messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
}
