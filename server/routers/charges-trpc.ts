import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getChargesByCompany,
  getChargeById,
  createCharge,
  updateCharge,
  getCompanyByUserId,
  getDashboardMetrics,
} from "../db";

export const chargesRouter = router({
  // List all charges for current user's company
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      // Get user's company
      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) {
        return [];
      }

      // Get charges for company
      const chargesList = await getChargesByCompany(company.id);
      return chargesList.map((charge) => ({
        ...charge,
        amount: charge.amount / 100, // Convert cents to reais
        interest: (charge.interest || 0) / 100,
        fine: (charge.fine || 0) / 100,
      }));
    } catch (error) {
      console.error("[tRPC] Error listing charges:", error);
      throw error;
    }
  }),

  // Get single charge by ID
  getById: protectedProcedure
    .input(z.object({ chargeId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        if (!ctx.user) {
          throw new Error("User not authenticated");
        }

        const charge = await getChargeById(input.chargeId);
        if (!charge) {
          throw new Error("Charge not found");
        }

        // Verify user owns this charge
        const company = await getCompanyByUserId(ctx.user.id);
        if (!company || charge.companyId !== company.id) {
          throw new Error("Unauthorized");
        }

        return {
          ...charge,
          amount: charge.amount / 100,
          interest: (charge.interest || 0) / 100,
          fine: (charge.fine || 0) / 100,
        };
      } catch (error) {
        console.error("[tRPC] Error getting charge:", error);
        throw error;
      }
    }),

  // Create new charge
  create: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        amount: z.number().positive(),
        dueDate: z.date(),
        interest: z.number().default(0),
        fine: z.number().default(0),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user) {
          throw new Error("User not authenticated");
        }

        const company = await getCompanyByUserId(ctx.user.id);
        if (!company) {
          throw new Error("Company not found");
        }

        const newCharge = await createCharge({
          companyId: company.id,
          clientId: input.clientId,
          amount: Math.round(input.amount * 100), // Convert to cents
          dueDate: input.dueDate,
          interest: Math.round(input.interest * 100),
          fine: Math.round(input.fine * 100),
          description: input.description,
          status: "pending",
        });

        if (!newCharge) {
          throw new Error("Failed to create charge");
        }

        return {
          ...newCharge,
          amount: newCharge.amount / 100,
          interest: (newCharge.interest || 0) / 100,
          fine: (newCharge.fine || 0) / 100,
        };
      } catch (error) {
        console.error("[tRPC] Error creating charge:", error);
        throw error;
      }
    }),

  // Update charge
  update: protectedProcedure
    .input(
      z.object({
        chargeId: z.number(),
        status: z.enum(["pending", "sent", "paid", "overdue", "cancelled"]).optional(),
        amount: z.number().optional(),
        dueDate: z.date().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user) {
          throw new Error("User not authenticated");
        }

        const charge = await getChargeById(input.chargeId);
        if (!charge) {
          throw new Error("Charge not found");
        }

        const company = await getCompanyByUserId(ctx.user.id);
        if (!company || charge.companyId !== company.id) {
          throw new Error("Unauthorized");
        }

        const updateData: any = {};
        if (input.status) updateData.status = input.status;
        if (input.amount !== undefined) updateData.amount = Math.round(input.amount * 100);
        if (input.dueDate) updateData.dueDate = input.dueDate;
        if (input.description !== undefined) updateData.description = input.description;

        if (input.status === "paid") {
          updateData.paidAt = new Date();
        }

        const updated = await updateCharge(input.chargeId, updateData);
        if (!updated) {
          throw new Error("Failed to update charge");
        }

        return {
          ...updated,
          amount: updated.amount / 100,
          interest: (updated.interest || 0) / 100,
          fine: (updated.fine || 0) / 100,
        };
      } catch (error) {
        console.error("[tRPC] Error updating charge:", error);
        throw error;
      }
    }),

  // Get dashboard metrics
  getDashboardMetrics: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) {
        throw new Error("Company not found");
      }

      const metrics = await getDashboardMetrics(company.id);
      if (!metrics) {
        throw new Error("Failed to get metrics");
      }

      return {
        totalToReceive: metrics.totalToReceive / 100,
        totalReceived: metrics.totalReceived / 100,
        overdueCharges: metrics.overdueCharges,
        chargesToday: metrics.chargesToday,
        chargesThisWeek: metrics.chargesThisWeek,
        activeClients: metrics.activeClients,
      };
    } catch (error) {
      console.error("[tRPC] Error getting metrics:", error);
      throw error;
    }
  }),
});
