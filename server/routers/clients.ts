import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { clients, companies, InsertClient } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * FIX DE SEGURANÇA (IDOR): a versão original do Manus não verificava se a
 * empresa/cliente pertencia ao usuário autenticado antes de ler, atualizar ou
 * deletar. Qualquer usuário logado podia acessar dados de outra empresa só
 * chutando o ID. Toda rota abaixo agora confirma a posse via `companies.userId`
 * antes de tocar em qualquer registro, seguindo o mesmo padrão já usado em
 * charges-trpc.ts, reminders.ts e pix.ts.
 */

async function assertCompanyOwnership(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  companyId: number,
  userId: number
) {
  const company = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  if (!company.length || company[0].userId !== userId) {
    throw new Error("Unauthorized");
  }
}

async function getClientOrThrow(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  clientId: number
) {
  const client = await db.select().from(clients).where(eq(clients.id, clientId)).limit(1);
  if (!client.length) {
    throw new Error("Client not found");
  }
  return client[0];
}

export const clientsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        name: z.string().min(1, "Nome é obrigatório"),
        cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
        whatsapp: z.string().min(10, "WhatsApp inválido"),
        email: z.string().email("Email inválido"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await assertCompanyOwnership(db, input.companyId, ctx.user!.id);

      const clientData: InsertClient = {
        companyId: input.companyId,
        name: input.name,
        cpfCnpj: input.cpfCnpj,
        whatsapp: input.whatsapp,
        email: input.email,
      };

      const [result] = await db.insert(clients).values(clientData);
      const insertId = (result as { insertId: number }).insertId;

      return { success: true, clientId: insertId };
    }),

  listByCompany: protectedProcedure
    .input(z.object({ companyId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await assertCompanyOwnership(db, input.companyId, ctx.user!.id);

      return await db.select().from(clients).where(eq(clients.companyId, input.companyId));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const client = await getClientOrThrow(db, input.id);
      await assertCompanyOwnership(db, client.companyId, ctx.user!.id);

      await db.delete(clients).where(eq(clients.id, input.id));
      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        whatsapp: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const client = await getClientOrThrow(db, input.id);
      await assertCompanyOwnership(db, client.companyId, ctx.user!.id);

      const updateData: Partial<InsertClient> = {};
      if (input.name) updateData.name = input.name;
      if (input.whatsapp) updateData.whatsapp = input.whatsapp;
      if (input.email) updateData.email = input.email;

      await db.update(clients).set(updateData).where(eq(clients.id, input.id));
      return { success: true };
    }),
});
