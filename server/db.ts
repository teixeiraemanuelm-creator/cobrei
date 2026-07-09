import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Reminders helpers
import { reminders, Reminder, InsertReminder } from "../drizzle/schema";

export async function getRemindersByCompany(companyId: number): Promise<Reminder[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get reminders: database not available");
    return [];
  }

  try {
    return await db.select().from(reminders).where(eq(reminders.companyId, companyId));
  } catch (error) {
    console.error("[Database] Failed to get reminders:", error);
    return [];
  }
}

export async function getReminderById(reminderId: number): Promise<Reminder | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get reminder: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(reminders).where(eq(reminders.id, reminderId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get reminder:", error);
    return undefined;
  }
}

export async function createReminder(data: InsertReminder): Promise<Reminder | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create reminder: database not available");
    return null;
  }

  try {
    // FIX: usar o insertId retornado pelo próprio insert, em vez de "pegar o primeiro
    // registro da empresa" (bug original: sem orderBy desc, retornava o registro mais
    // antigo, não o recém-criado).
    const [result] = await db.insert(reminders).values(data);
    const insertId = (result as { insertId: number }).insertId;
    return (await getReminderById(insertId)) ?? null;
  } catch (error) {
    console.error("[Database] Failed to create reminder:", error);
    return null;
  }
}

export async function updateReminder(
  reminderId: number,
  data: Partial<InsertReminder>
): Promise<Reminder | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update reminder: database not available");
    return null;
  }

  try {
    await db.update(reminders).set(data).where(eq(reminders.id, reminderId));
    return (await getReminderById(reminderId)) ?? null;
  } catch (error) {
    console.error("[Database] Failed to update reminder:", error);
    return null;
  }
}

export async function deleteReminder(reminderId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete reminder: database not available");
    return false;
  }

  try {
    await db.delete(reminders).where(eq(reminders.id, reminderId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete reminder:", error);
    return false;
  }
}

// Charges helpers
import { charges, Charge, InsertCharge, clients, companies } from "../drizzle/schema";

export async function getChargesByCompany(companyId: number): Promise<Charge[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get charges: database not available");
    return [];
  }

  try {
    return await db.select().from(charges).where(eq(charges.companyId, companyId));
  } catch (error) {
    console.error("[Database] Failed to get charges:", error);
    return [];
  }
}

export async function getChargeById(chargeId: number): Promise<Charge | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get charge: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(charges).where(eq(charges.id, chargeId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get charge:", error);
    return undefined;
  }
}

export async function createCharge(data: InsertCharge): Promise<Charge | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create charge: database not available");
    return null;
  }

  try {
    const [result] = await db.insert(charges).values(data);
    const insertId = (result as { insertId: number }).insertId;
    return (await getChargeById(insertId)) ?? null;
  } catch (error) {
    console.error("[Database] Failed to create charge:", error);
    return null;
  }
}

export async function updateCharge(
  chargeId: number,
  data: Partial<InsertCharge>
): Promise<Charge | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update charge: database not available");
    return null;
  }

  try {
    await db.update(charges).set(data).where(eq(charges.id, chargeId));
    return (await getChargeById(chargeId)) ?? null;
  } catch (error) {
    console.error("[Database] Failed to update charge:", error);
    return null;
  }
}

// Clients helpers
import { InsertClient, Client } from "../drizzle/schema";

export async function getClientsByCompany(companyId: number): Promise<Client[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get clients: database not available");
    return [];
  }

  try {
    return await db.select().from(clients).where(eq(clients.companyId, companyId));
  } catch (error) {
    console.error("[Database] Failed to get clients:", error);
    return [];
  }
}

export async function getClientById(clientId: number): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get client: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(clients).where(eq(clients.id, clientId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get client:", error);
    return undefined;
  }
}

export async function createClient(data: InsertClient): Promise<Client | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create client: database not available");
    return null;
  }

  try {
    const [result] = await db.insert(clients).values(data);
    const insertId = (result as { insertId: number }).insertId;
    return (await getClientById(insertId)) ?? null;
  } catch (error) {
    console.error("[Database] Failed to create client:", error);
    return null;
  }
}

export async function updateClient(
  clientId: number,
  data: Partial<InsertClient>
): Promise<Client | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update client: database not available");
    return null;
  }

  try {
    await db.update(clients).set(data).where(eq(clients.id, clientId));
    return (await getClientById(clientId)) ?? null;
  } catch (error) {
    console.error("[Database] Failed to update client:", error);
    return null;
  }
}

// Companies helpers
import { InsertCompany, Company } from "../drizzle/schema";

export async function getCompanyById(companyId: number): Promise<Company | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get company: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get company:", error);
    return undefined;
  }
}

export async function getCompanyByUserId(userId: number): Promise<Company | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get company: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(companies).where(eq(companies.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get company:", error);
    return undefined;
  }
}

export async function createCompany(data: InsertCompany): Promise<Company | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create company: database not available");
    return null;
  }

  try {
    const [result] = await db.insert(companies).values(data);
    const insertId = (result as { insertId: number }).insertId;
    return (await getCompanyById(insertId)) ?? null;
  } catch (error) {
    console.error("[Database] Failed to create company:", error);
    return null;
  }
}

export async function updateCompany(
  companyId: number,
  data: Partial<InsertCompany>
): Promise<Company | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update company: database not available");
    return null;
  }

  try {
    await db.update(companies).set(data).where(eq(companies.id, companyId));
    return (await getCompanyById(companyId)) ?? null;
  } catch (error) {
    console.error("[Database] Failed to update company:", error);
    return null;
  }
}

// Dashboard helpers
export async function getDashboardMetrics(companyId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get metrics: database not available");
    return null;
  }

  try {
    const chargesList = await getChargesByCompany(companyId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const totalToReceive = chargesList
      .filter((c) => c.status === "pending" || c.status === "sent")
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    const totalReceived = chargesList
      .filter((c) => c.status === "paid")
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    const overdueCharges = chargesList.filter(
      (c) => c.status === "pending" && c.dueDate < today
    ).length;

    const chargesToday = chargesList.filter(
      (c) => c.dueDate >= today && c.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    ).length;

    const chargesThisWeek = chargesList.filter(
      (c) => c.dueDate >= weekStart && c.dueDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length;

    const clientsList = await getClientsByCompany(companyId);
    const activeClients = clientsList.length; // TODO: Adicionar campo status em clients

    return {
      totalToReceive,
      totalReceived,
      overdueCharges,
      chargesToday,
      chargesThisWeek,
      activeClients,
    };
  } catch (error) {
    console.error("[Database] Failed to get metrics:", error);
    return null;
  }
}

// TODO: add feature queries here as your schema grows.
