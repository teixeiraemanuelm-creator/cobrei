import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  getRemindersByCompany,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
} from "../db";
import { companies } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq } from "drizzle-orm";

const reminderTypeEnum = z.enum(["charge_notification", "overdue_reminder", "payment_confirmation"]);
const booleanEnum = z.enum(["yes", "no"]);

export const remindersRouter = router({
  // Get all reminders for a company
  getByCompany: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get user's company
    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.userId, ctx.user!.id))
      .limit(1);

    if (!company.length) {
      throw new Error("Company not found");
    }

    const reminders = await getRemindersByCompany(company[0].id);
    return reminders;
  }),

  // Get a single reminder by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const reminder = await getReminderById(input.id);
      if (!reminder) {
        throw new Error("Reminder not found");
      }

      // Verify company ownership
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, reminder.companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      return reminder;
    }),

  // Create a new reminder
  create: protectedProcedure
    .input(
      z.object({
        type: reminderTypeEnum,
        daysBeforeDue: z.number().int().min(-30).max(30),
        messageTemplate: z.string().min(10, "Mensagem muito curta"),
        includePixQrCode: booleanEnum,
        includePixCopyPaste: booleanEnum,
        isActive: booleanEnum.optional().default("yes"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get user's company
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.userId, ctx.user!.id))
        .limit(1);

      if (!company.length) {
        throw new Error("Company not found");
      }

      const reminder = await createReminder({
        companyId: company[0].id,
        type: input.type,
        daysBeforeDue: input.daysBeforeDue,
        messageTemplate: input.messageTemplate,
        includePixQrCode: input.includePixQrCode,
        includePixCopyPaste: input.includePixCopyPaste,
        isActive: input.isActive,
      });

      if (!reminder) {
        throw new Error("Failed to create reminder");
      }

      return reminder;
    }),

  // Update a reminder
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        type: reminderTypeEnum.optional(),
        daysBeforeDue: z.number().int().min(-30).max(30).optional(),
        messageTemplate: z.string().min(10).optional(),
        includePixQrCode: booleanEnum.optional(),
        includePixCopyPaste: booleanEnum.optional(),
        isActive: booleanEnum.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const reminder = await getReminderById(input.id);
      if (!reminder) {
        throw new Error("Reminder not found");
      }

      // Verify company ownership
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, reminder.companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      const updateData: Record<string, unknown> = {};
      if (input.type) updateData.type = input.type;
      if (input.daysBeforeDue !== undefined) updateData.daysBeforeDue = input.daysBeforeDue;
      if (input.messageTemplate) updateData.messageTemplate = input.messageTemplate;
      if (input.includePixQrCode) updateData.includePixQrCode = input.includePixQrCode;
      if (input.includePixCopyPaste) updateData.includePixCopyPaste = input.includePixCopyPaste;
      if (input.isActive) updateData.isActive = input.isActive;

      const updated = await updateReminder(input.id, updateData);
      if (!updated) {
        throw new Error("Failed to update reminder");
      }

      return updated;
    }),

  // Delete a reminder
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const reminder = await getReminderById(input.id);
      if (!reminder) {
        throw new Error("Reminder not found");
      }

      // Verify company ownership
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, reminder.companyId))
        .limit(1);

      if (!company.length || company[0].userId !== ctx.user!.id) {
        throw new Error("Unauthorized");
      }

      const deleted = await deleteReminder(input.id);
      if (!deleted) {
        throw new Error("Failed to delete reminder");
      }

      return { success: true };
    }),

  // Get default templates for a reminder type
  getDefaultTemplates: protectedProcedure.query(() => {
    return {
      charge_notification: `Olá {clientName}! 👋\n\nVocê tem uma cobrança no valor de R$ {amount} com vencimento em {dueDate}.\n\nPague via Pix e receba desconto! 💚\n\nSeu Pix: {pixKey}`,
      overdue_reminder: `Atenção {clientName}! ⚠️\n\nSua cobrança de R$ {amount} venceu em {dueDate}.\n\nJuros: {interest}% | Multa: {fine}%\n\nPague agora via Pix: {pixKey}`,
      payment_confirmation: `Obrigado {clientName}! ✅\n\nRecebemos seu pagamento de R$ {amount}.\n\nSua cobrança foi quitada com sucesso!`,
    };
  }),
});
