/**
 * Pix BR Code (EMV) Generation
 * Implementação de geração de BR Code conforme padrão EMV para Pix
 * Baseado em: https://www.bcb.gov.br/content/estabilidade/pix/Regulamentacao_Pix/4P_ManualdePadroes_Pix.pdf
 */

interface BRCodeData {
  pixKey: string; // Chave Pix (CPF, CNPJ, email, telefone ou UUID)
  amount?: number; // Valor em centavos
  description?: string; // Descrição da transação
  recipientName?: string; // Nome do recebedor
  recipientCity?: string; // Cidade do recebedor
  transactionId?: string; // ID único da transação
}

interface BRCodeField {
  id: string;
  value: string;
}

/**
 * Calcula o módulo 10 para validação
 */
function calculateMod10(value: string): string {
  let sum = 0;
  let multiplier = 2;

  for (let i = value.length - 1; i >= 0; i--) {
    let result = parseInt(value[i]) * multiplier;
    if (result > 9) {
      result = Math.floor(result / 10) + (result % 10);
    }
    sum += result;
    multiplier = multiplier === 2 ? 1 : 2;
  }

  const remainder = sum % 10;
  return remainder === 0 ? "0" : String(10 - remainder);
}

/**
 * Formata um campo EMV com ID e valor
 */
function formatEMVField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

/**
 * Gera um BR Code (EMV) para Pix
 * Formato: https://www.bcb.gov.br/content/estabilidade/pix/Regulamentacao_Pix/4P_ManualdePadroes_Pix.pdf
 */
export function generateBRCode(data: BRCodeData): string {
  const fields: string[] = [];

  // Payload Format Indicator (00) - Sempre "01"
  fields.push(formatEMVField("00", "01"));

  // Point of Initiation Method (01) - "12" para pagamento único
  fields.push(formatEMVField("01", "12"));

  // Merchant Account Information (26)
  const merchantData = generateMerchantData(data);
  fields.push(formatEMVField("26", merchantData));

  // Transaction Currency (53) - "986" para Real
  fields.push(formatEMVField("53", "986"));

  // Transaction Amount (54) - Se houver valor
  if (data.amount && data.amount > 0) {
    const amountStr = (data.amount / 100).toFixed(2);
    fields.push(formatEMVField("54", amountStr));
  }

  // Country Code (58) - "BR" para Brasil
  fields.push(formatEMVField("58", "BR"));

  // Merchant Name (59) - Nome do recebedor
  const recipientName = data.recipientName || "Cobrei";
  fields.push(formatEMVField("59", recipientName.substring(0, 25)));

  // Merchant City (60) - Cidade
  const city = data.recipientCity || "SAO PAULO";
  fields.push(formatEMVField("60", city.substring(0, 15)));

  // Additional Data Field Template (62)
  const additionalData = generateAdditionalData(data);
  if (additionalData) {
    fields.push(formatEMVField("62", additionalData));
  }

  // CRC16 (63)
  const payload = fields.join("");
  const crc = calculateCRC16(payload + "6304");
  fields.push(formatEMVField("63", crc));

  return fields.join("");
}

/**
 * Gera dados do merchant (informações da chave Pix)
 */
function generateMerchantData(data: BRCodeData): string {
  const fields: string[] = [];

  // Globally Unique Identifier (00) - "br.gov.bcb.pix"
  fields.push(formatEMVField("00", "br.gov.bcb.pix"));

  // Chave Pix (01)
  fields.push(formatEMVField("01", data.pixKey));

  return fields.join("");
}

/**
 * Gera dados adicionais (ID da transação, etc)
 */
function generateAdditionalData(data: BRCodeData): string {
  const fields: string[] = [];

  // Reference Label (05) - ID da transação
  if (data.transactionId) {
    const txId = data.transactionId.substring(0, 25);
    fields.push(formatEMVField("05", txId));
  }

  return fields.join("");
}

/**
 * Calcula CRC16 CCITT-FALSE
 * Algoritmo: x^16 + x^12 + x^5 + 1
 */
function calculateCRC16(data: string): string {
  const polynomial = 0x1021;
  let crc = 0xffff;

  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      crc = crc << 1;
      if (crc & 0x10000) {
        crc = (crc ^ polynomial) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Valida um BR Code
 */
export function validateBRCode(brCode: string): boolean {
  if (!brCode || brCode.length < 26) {
    return false;
  }

  try {
    // Extrair CRC do final
    const crcField = brCode.substring(brCode.length - 4);
    const providedCrc = crcField.substring(2);

    // Calcular CRC esperado
    const payload = brCode.substring(0, brCode.length - 4);
    const expectedCrc = calculateCRC16(payload + "6304");

    return providedCrc === expectedCrc;
  } catch {
    return false;
  }
}

/**
 * Extrai informações de um BR Code
 */
export function parseBRCode(brCode: string): Partial<BRCodeData> | null {
  if (!validateBRCode(brCode)) {
    return null;
  }

  const result: Partial<BRCodeData> = {};
  let index = 0;

  try {
    while (index < brCode.length - 4) {
      const id = brCode.substring(index, index + 2);
      const length = parseInt(brCode.substring(index + 2, index + 4));
      const value = brCode.substring(index + 4, index + 4 + length);

      switch (id) {
        case "26": // Merchant Account Information
          const merchantInfo = parseMerchantData(value);
          if (merchantInfo.pixKey) {
            result.pixKey = merchantInfo.pixKey;
          }
          break;
        case "54": // Transaction Amount
          result.amount = Math.round(parseFloat(value) * 100);
          break;
        case "59": // Merchant Name
          result.recipientName = value;
          break;
        case "60": // Merchant City
          result.recipientCity = value;
          break;
        case "62": // Additional Data
          const additionalData = parseAdditionalData(value);
          if (additionalData.transactionId) {
            result.transactionId = additionalData.transactionId;
          }
          break;
      }

      index += 4 + length;
    }

    return result;
  } catch {
    return null;
  }
}

/**
 * Parse dos dados do merchant
 */
function parseMerchantData(data: string): { pixKey?: string } {
  const result: { pixKey?: string } = {};
  let index = 0;

  while (index < data.length) {
    const id = data.substring(index, index + 2);
    const length = parseInt(data.substring(index + 2, index + 4));
    const value = data.substring(index + 4, index + 4 + length);

    if (id === "01") {
      result.pixKey = value;
    }

    index += 4 + length;
  }

  return result;
}

/**
 * Parse dos dados adicionais
 */
function parseAdditionalData(data: string): { transactionId?: string } {
  const result: { transactionId?: string } = {};
  let index = 0;

  while (index < data.length) {
    const id = data.substring(index, index + 2);
    const length = parseInt(data.substring(index + 2, index + 4));
    const value = data.substring(index + 4, index + 4 + length);

    if (id === "05") {
      result.transactionId = value;
    }

    index += 4 + length;
  }

  return result;
}
