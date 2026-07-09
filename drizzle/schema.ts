import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Companies table – Stores company information for each user
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(),
  pixKey: varchar("pixKey", { length: 255 }).notNull(),
  pixKeyType: mysqlEnum("pixKeyType", ["cpf", "cnpj", "email", "phone", "random"]).notNull(),
  logo: text("logo"), // URL to logo image
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Clients table – Stores customer information
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 18 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Charges table – Stores billing information
 */
export const charges = mysqlTable("charges", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  clientId: int("clientId").notNull(),
  amount: int("amount").notNull(), // Amount in cents (e.g., 10050 = R$ 100.50)
  dueDate: timestamp("dueDate").notNull(),
  interest: int("interest").default(0), // Interest in basis points (e.g., 100 = 1%)
  fine: int("fine").default(0), // Fine in basis points
  status: mysqlEnum("status", ["pending", "sent", "paid", "overdue", "cancelled"]).default("pending").notNull(),
  description: text("description"),
  pixQrCode: text("pixQrCode"), // QR Code for Pix payment
  pixCopyPaste: text("pixCopyPaste"), // Copy and paste Pix string
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Charge = typeof charges.$inferSelect;
export type InsertCharge = typeof charges.$inferInsert;

/**
 * Transactions table – Stores Pix payment confirmations
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  chargeId: int("chargeId").notNull(),
  companyId: int("companyId").notNull(),
  amount: int("amount").notNull(), // Amount received in cents
  pixId: varchar("pixId", { length: 255 }).notNull().unique(), // Pix transaction ID from webhook
  status: mysqlEnum("status", ["pending", "confirmed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Reminders table – Stores WhatsApp reminder configurations
 */
export const reminders = mysqlTable("reminders", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  // Reminder type: initial charge notification, overdue reminder, etc.
  type: mysqlEnum("type", ["charge_notification", "overdue_reminder", "payment_confirmation"]).notNull(),
  // Whether this reminder is active
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes").notNull(),
  // Days before due date to send (negative = after due date)
  daysBeforeDue: int("daysBeforeDue").notNull(),
  // Message template with placeholders: {clientName}, {amount}, {dueDate}, {pixKey}, {interest}, {fine}
  messageTemplate: text("messageTemplate").notNull(),
  // Whether to include Pix QR code in the message
  includePixQrCode: mysqlEnum("includePixQrCode", ["yes", "no"]).default("yes").notNull(),
  // Whether to include Pix copy-paste string
  includePixCopyPaste: mysqlEnum("includePixCopyPaste", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = typeof reminders.$inferInsert;

/**
 * Pix Keys table – Stores additional Pix keys for a company
 */
export const pixKeys = mysqlTable("pix_keys", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  keyType: mysqlEnum("keyType", ["cpf", "cnpj", "email", "phone", "random"]).notNull(),
  label: varchar("label", { length: 100 }),
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PixKey = typeof pixKeys.$inferSelect;
export type InsertPixKey = typeof pixKeys.$inferInsert;

/**
 * WhatsApp Templates table – Stores custom WhatsApp message templates
 */
export const whatsappTemplates = mysqlTable("whatsapp_templates", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["charge_notification", "overdue_reminder", "payment_confirmation", "custom"]).notNull(),
  content: text("content").notNull(),
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WhatsAppTemplate = typeof whatsappTemplates.$inferSelect;
export type InsertWhatsAppTemplate = typeof whatsappTemplates.$inferInsert;

/**
 * Notifications table – Stores notification history
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  chargeId: int("chargeId"),
  type: mysqlEnum("type", ["charge_notification", "overdue_reminder", "payment_confirmation", "system"]).notNull(),
  recipient: varchar("recipient", { length: 20 }).notNull(), // Phone number
  status: mysqlEnum("status", ["pending", "sent", "failed", "read"]).default("pending").notNull(),
  message: text("message"),
  sentAt: timestamp("sentAt"),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Subscriptions table – Stores subscription/plan information
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  plan: mysqlEnum("plan", ["free", "starter", "professional", "enterprise"]).default("free").notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled", "expired"]).default("active").notNull(),
  chargesLimit: int("chargesLimit").default(-1), // -1 = unlimited
  clientsLimit: int("clientsLimit").default(-1),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Audit Logs table – Stores all user actions for compliance
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // e.g., "charge_created", "payment_confirmed"
  entityType: varchar("entityType", { length: 50 }).notNull(), // e.g., "charge", "client"
  entityId: int("entityId"),
  changes: text("changes"), // JSON with before/after values
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;