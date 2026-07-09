import QRCode from "qrcode";
import { generateBRCode } from "./pix-brcode";

/**
 * Pix QR Code Generation Utilities
 * Funções para gerar QR Codes para pagamentos Pix
 */

interface PixQRCodeData {
  pixKey: string;
  amount?: number; // Em centavos
  description?: string;
  recipientName?: string;
  recipientCity?: string;
  transactionId?: string;
}

/**
 * Gera uma string de Pix Copy and Paste (BR Code EMV)
 * Formato conforme padrão do Banco Central do Brasil
 */
export function generatePixCopyPaste(data: PixQRCodeData): string {
  // Usar BR Code real em vez de formato simplificado
  return generateBRCode({
    pixKey: data.pixKey,
    amount: data.amount,
    description: data.description,
    recipientName: data.recipientName,
    recipientCity: data.recipientCity,
    transactionId: data.transactionId,
  });
}

/**
 * Gera um QR Code em formato PNG (base64)
 * Pode ser usado para exibir na interface ou enviar via WhatsApp
 */
export async function generatePixQRCode(data: PixQRCodeData): Promise<string> {
  try {
    const copyPaste = generatePixCopyPaste(data);

    // Gerar QR Code como data URL (base64)
    const qrCodeDataUrl = await QRCode.toDataURL(copyPaste, {
      errorCorrectionLevel: "H" as const,
      margin: 1,
      width: 300,
      color: {
        dark: "#0B1736", // Cor escura do Cobrei
        light: "#FFFFFF",
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error("[Pix] Failed to generate QR Code:", error);
    throw new Error("Failed to generate QR Code");
  }
}

/**
 * Gera um QR Code em formato PNG (buffer)
 * Útil para salvar em arquivo ou enviar como anexo
 */
export async function generatePixQRCodeBuffer(data: PixQRCodeData): Promise<Buffer> {
  try {
    const copyPaste = generatePixCopyPaste(data);

    const qrCodeBuffer = await QRCode.toBuffer(copyPaste, {
      errorCorrectionLevel: "H" as const,
      margin: 1,
      width: 300,
      color: {
        dark: "#0B1736",
        light: "#FFFFFF",
      },
    });

    return qrCodeBuffer;
  } catch (error) {
    console.error("[Pix] Failed to generate QR Code buffer:", error);
    throw new Error("Failed to generate QR Code buffer");
  }
}

/**
 * Valida uma chave Pix
 * Verifica se a chave está em um formato válido
 */
export function validatePixKey(key: string, type: string): boolean {
  if (!key || key.trim().length === 0) {
    return false;
  }

  switch (type) {
    case "cpf":
      // CPF: 11 dígitos
      return /^\d{11}$/.test(key.replace(/\D/g, ""));

    case "cnpj":
      // CNPJ: 14 dígitos
      return /^\d{14}$/.test(key.replace(/\D/g, ""));

    case "email":
      // Email válido
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);

    case "phone":
      // Telefone: 10 ou 11 dígitos
      const phoneDigits = key.replace(/\D/g, "");
      return /^\d{10,11}$/.test(phoneDigits);

    case "random":
      // UUID v4
      return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key);

    default:
      return false;
  }
}

/**
 * Formata uma chave Pix para exibição
 */
export function formatPixKey(key: string, type: string): string {
  switch (type) {
    case "cpf":
      return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

    case "cnpj":
      return key.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

    case "phone":
      const phoneDigits = key.replace(/\D/g, "");
      if (phoneDigits.length === 11) {
        return phoneDigits.replace(/(\d{2})(\d{5})(\d{4})/, "+55 $1 $2-$3");
      }
      return phoneDigits.replace(/(\d{2})(\d{4})(\d{4})/, "+55 $1 $2-$3");

    case "email":
    case "random":
    default:
      return key;
  }
}
