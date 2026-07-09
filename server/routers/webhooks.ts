import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { transactions, charges } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const webhooksRouter = router({
  // Obter histórico de transações de uma cobrança
  getTransactionsByCharge: protectedProcedure
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

      // Verificar propriedade (através da empresa)
      const { companies } = await import("../../drizzle/schema");
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, charge[0].companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      // Buscar transações
      const chargeTransactions = await db
        .select()
        .from(transactions)
        .where(eq(transactions.chargeId, input.chargeId));

      return chargeTransactions;
    }),

  // Obter transações por empresa
  getTransactionsByCompany: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar propriedade
      const { companies } = await import("../../drizzle/schema");
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, input.companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      // Buscar transações
      const companyTransactions = await db
        .select()
        .from(transactions)
        .where(eq(transactions.companyId, input.companyId));

      return companyTransactions;
    }),

  // Obter estatísticas de pagamentos
  getPaymentStats: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar propriedade
      const { companies } = await import("../../drizzle/schema");
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, input.companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      // Buscar todas as transações confirmadas
      const confirmedTransactions = await db
        .select()
        .from(transactions)
        .where(eq(transactions.companyId, input.companyId));

      const totalAmount = confirmedTransactions
        .filter((t) => t.status === "confirmed")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalTransactions = confirmedTransactions.length;
      const confirmedCount = confirmedTransactions.filter((t) => t.status === "confirmed").length;
      const failedCount = confirmedTransactions.filter((t) => t.status === "failed").length;
      const pendingCount = confirmedTransactions.filter((t) => t.status === "pending").length;

      return {
        totalAmount,
        totalTransactions,
        confirmedCount,
        failedCount,
        pendingCount,
        successRate:
          totalTransactions > 0
            ? ((confirmedCount / totalTransactions) * 100).toFixed(2)
            : "0.00",
      };
    }),

  // Obter detalhes de uma transação
  getTransaction: protectedProcedure
    .input(
      z.object({
        transactionId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Buscar transação
      const transaction = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, input.transactionId))
        .limit(1);

      if (!transaction.length) {
        throw new Error("Transaction not found");
      }

      // Verificar propriedade
      const { companies } = await import("../../drizzle/schema");
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, transaction[0].companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      return transaction[0];
    }),

  // Simular webhook de pagamento (APENAS para testes/dev — bloqueado em produção)
  simulatePaymentWebhook: protectedProcedure
    .input(
      z.object({
        chargeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Simulação de pagamento desabilitada em produção");
      }

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

      // Verificar propriedade
      const { companies } = await import("../../drizzle/schema");
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, charge[0].companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      // Simular webhook
      const pixId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Atualizar status da cobrança
      await db
        .update(charges)
        .set({
          status: "paid",
          paidAt: new Date(),
        })
        .where(eq(charges.id, input.chargeId));

      // Registrar transação
      await db.insert(transactions).values({
        chargeId: input.chargeId,
        companyId: charge[0].companyId,
        amount: charge[0].amount,
        pixId: pixId,
        status: "confirmed",
      });

      return {
        success: true,
        message: "Payment simulated successfully",
        pixId,
      };
    }),
});
