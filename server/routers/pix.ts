import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { generatePixQRCode, generatePixCopyPaste, validatePixKey, formatPixKey } from "../pix";
import { getDb } from "../db";
import { companies, charges } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const pixRouter = router({
  // Gerar QR Code para uma cobrança
  generateQRCode: protectedProcedure
    .input(
      z.object({
        chargeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Buscar a cobrança
      const charge = await db
        .select()
        .from(charges)
        .where(eq(charges.id, input.chargeId))
        .limit(1);

      if (!charge.length) {
        throw new Error("Charge not found");
      }

      // Verificar propriedade da cobrança
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, charge[0].companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      // Validar chave Pix
      if (!validatePixKey(company[0].pixKey, company[0].pixKeyType)) {
        throw new Error("Invalid Pix key");
      }

      // Gerar QR Code
      const qrCodeDataUrl = await generatePixQRCode({
        pixKey: company[0].pixKey,
        amount: charge[0].amount,
        description: charge[0].description || "Pagamento",
        recipientName: company[0].name,
      });

      // Gerar Pix Copy and Paste
      const pixCopyPaste = generatePixCopyPaste({
        pixKey: company[0].pixKey,
        amount: charge[0].amount,
        description: charge[0].description || "Pagamento",
      });

      // Atualizar cobrança com QR Code e Pix Copy and Paste
      await db
        .update(charges)
        .set({
          pixQrCode: qrCodeDataUrl,
          pixCopyPaste: pixCopyPaste,
        })
        .where(eq(charges.id, input.chargeId));

      return {
        success: true,
        qrCodeDataUrl,
        pixCopyPaste,
        formattedPixKey: formatPixKey(company[0].pixKey, company[0].pixKeyType),
      };
    }),

  // Obter QR Code de uma cobrança
  getQRCode: protectedProcedure
    .input(
      z.object({
        chargeId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Buscar a cobrança
      const charge = await db
        .select()
        .from(charges)
        .where(eq(charges.id, input.chargeId))
        .limit(1);

      if (!charge.length) {
        throw new Error("Charge not found");
      }

      // Verificar propriedade da cobrança
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, charge[0].companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      // Se não tem QR Code, gerar
      if (!charge[0].pixQrCode) {
        const qrCodeDataUrl = await generatePixQRCode({
          pixKey: company[0].pixKey,
          amount: charge[0].amount,
          description: charge[0].description || "Pagamento",
          recipientName: company[0].name,
        });

        const pixCopyPaste = generatePixCopyPaste({
          pixKey: company[0].pixKey,
          amount: charge[0].amount,
          description: charge[0].description || "Pagamento",
        });

        await db
          .update(charges)
          .set({
            pixQrCode: qrCodeDataUrl,
            pixCopyPaste: pixCopyPaste,
          })
          .where(eq(charges.id, input.chargeId));

        return {
          qrCodeDataUrl,
          pixCopyPaste,
          formattedPixKey: formatPixKey(company[0].pixKey, company[0].pixKeyType),
        };
      }

      return {
        qrCodeDataUrl: charge[0].pixQrCode,
        pixCopyPaste: charge[0].pixCopyPaste,
        formattedPixKey: formatPixKey(company[0].pixKey, company[0].pixKeyType),
      };
    }),

  // Validar chave Pix
  validatePixKey: protectedProcedure
    .input(
      z.object({
        pixKey: z.string(),
        pixKeyType: z.enum(["cpf", "cnpj", "email", "phone", "random"]),
      })
    )
    .query(({ input }) => {
      const isValid = validatePixKey(input.pixKey, input.pixKeyType);
      const formatted = isValid ? formatPixKey(input.pixKey, input.pixKeyType) : input.pixKey;

      return {
        isValid,
        formatted,
        message: isValid ? "Chave Pix válida" : "Chave Pix inválida",
      };
    }),

  // Formatar chave Pix
  formatPixKey: protectedProcedure
    .input(
      z.object({
        pixKey: z.string(),
        pixKeyType: z.enum(["cpf", "cnpj", "email", "phone", "random"]),
      })
    )
    .query(({ input }) => {
      return {
        formatted: formatPixKey(input.pixKey, input.pixKeyType),
      };
    }),
});
