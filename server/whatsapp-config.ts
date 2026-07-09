/**
 * WhatsApp Business API Configuration
 * Configuração e constantes para integração com WhatsApp Business API
 */

export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  apiVersion: string;
  apiBaseUrl: string;
}

/**
 * Carrega configuração do WhatsApp a partir de variáveis de ambiente
 */
export function loadWhatsAppConfig(): WhatsAppConfig {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !phoneNumberId || !businessAccountId) {
    console.warn("[WhatsApp] Missing configuration. WhatsApp features will be disabled.");
  }

  return {
    accessToken: accessToken || "",
    phoneNumberId: phoneNumberId || "",
    businessAccountId: businessAccountId || "",
    apiVersion: "v18.0",
    apiBaseUrl: "https://graph.facebook.com",
  };
}

/**
 * Tipos de mensagens WhatsApp suportadas
 */
export enum WhatsAppMessageType {
  TEXT = "text",
  IMAGE = "image",
  DOCUMENT = "document",
  TEMPLATE = "template",
  INTERACTIVE = "interactive",
}

/**
 * Templates de mensagens WhatsApp para Cobrei
 */
export const WHATSAPP_TEMPLATES = {
  CHARGE_NOTIFICATION: {
    name: "charge_notification",
    language: "pt_BR",
    description: "Notificação de cobrança",
    parameters: ["clientName", "amount", "dueDate", "pixKey"],
  },
  OVERDUE_REMINDER: {
    name: "overdue_reminder",
    language: "pt_BR",
    description: "Lembrete de atraso",
    parameters: ["clientName", "amount", "daysOverdue", "pixKey"],
  },
  PAYMENT_CONFIRMATION: {
    name: "payment_confirmation",
    language: "pt_BR",
    description: "Confirmação de pagamento",
    parameters: ["clientName", "amount", "transactionId"],
  },
};

/**
 * Mensagens padrão para WhatsApp
 */
export const DEFAULT_WHATSAPP_MESSAGES = {
  CHARGE_NOTIFICATION: `Olá {clientName}! 👋

Você tem uma cobrança no valor de R$ {amount} com vencimento em {dueDate}.

Pague via Pix e receba desconto! 💚

Seu Pix: {pixKey}`,

  OVERDUE_REMINDER: `Atenção {clientName}! ⚠️

Sua cobrança de R$ {amount} venceu há {daysOverdue} dias.

Pague agora via Pix: {pixKey}

Evite juros e multa!`,

  PAYMENT_CONFIRMATION: `Obrigado {clientName}! ✅

Recebemos seu pagamento de R$ {amount}.

Sua cobrança foi quitada com sucesso!
ID da transação: {transactionId}`,
};

/**
 * Validação de número de telefone WhatsApp
 */
export function validateWhatsAppPhoneNumber(phone: string): boolean {
  // Remover caracteres especiais
  const cleaned = phone.replace(/\D/g, "");

  // Verificar se tem 10 ou 11 dígitos (Brasil) ou 12-13 com código do Brasil
  if (cleaned.length === 10 || cleaned.length === 11) {
    // Sem código do Brasil
    return true;
  }

  if (cleaned.length === 12 || cleaned.length === 13) {
    // Com código do Brasil
    return cleaned.startsWith("55");
  }

  return false;
}

/**
 * Formata número de telefone para WhatsApp
 */
export function formatWhatsAppPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  // Adicionar código do Brasil se não tiver
  if (!cleaned.startsWith("55")) {
    cleaned = "55" + cleaned;
  }

  return cleaned;
}

/**
 * Substitui placeholders em mensagem
 */
export function replacePlaceholders(
  message: string,
  data: Record<string, string | number>
): string {
  let result = message;

  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, "g"), String(value));
  });

  return result;
}

/**
 * Valida se a configuração do WhatsApp está completa
 */
export function isWhatsAppConfigured(): boolean {
  const config = loadWhatsAppConfig();
  return !!(config.accessToken && config.phoneNumberId && config.businessAccountId);
}
