import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { companies, InsertCompany } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { clientsRouter } from "./routers/clients";
import { remindersRouter } from "./routers/reminders";
import { pixRouter } from "./routers/pix";
import { webhooksRouter } from "./routers/webhooks";
import { chargesRouter } from "./routers/charges-trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  clients: clientsRouter,
  reminders: remindersRouter,
  charges: chargesRouter,
  pix: pixRouter,
  webhooks: webhooksRouter,

  company: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome da empresa é obrigatório"),
          cnpj: z.string().min(14, "CNPJ inválido"),
          whatsapp: z.string().min(10, "WhatsApp inválido"),
          pixKey: z.string().min(1, "Chave Pix é obrigatória"),
          pixKeyType: z.enum(["cpf", "cnpj", "email", "phone", "random"]),
          logo: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const companyData: InsertCompany = {
          userId: ctx.user!.id,
          name: input.name,
          cnpj: input.cnpj,
          whatsapp: input.whatsapp,
          pixKey: input.pixKey,
          pixKeyType: input.pixKeyType,
          logo: input.logo,
        };

        // FIX: usar insertId real em vez de "pegar o primeiro registro do usuário"
        // (bug original sem orderBy desc, retornava a empresa mais antiga).
        const [result] = await db.insert(companies).values(companyData);
        const insertId = (result as { insertId: number }).insertId;

        return { success: true, companyId: insertId };
      }),

    getByUserId: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(companies)
        .where(eq(companies.userId, ctx.user!.id))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          whatsapp: z.string().optional(),
          pixKey: z.string().optional(),
          pixKeyType: z.enum(["cpf", "cnpj", "email", "phone", "random"]).optional(),
          logo: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Verify ownership
        const company = await db
          .select()
          .from(companies)
          .where(eq(companies.id, input.id))
          .limit(1);

        if (!company.length || company[0].userId !== ctx.user!.id) {
          throw new Error("Unauthorized");
        }

        const updateData: Partial<InsertCompany> = {};
        if (input.name) updateData.name = input.name;
        if (input.whatsapp) updateData.whatsapp = input.whatsapp;
        if (input.pixKey) updateData.pixKey = input.pixKey;
        if (input.pixKeyType) updateData.pixKeyType = input.pixKeyType;
        if (input.logo) updateData.logo = input.logo;

        await db.update(companies).set(updateData).where(eq(companies.id, input.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
