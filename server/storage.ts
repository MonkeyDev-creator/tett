import { db } from "./db";
import {
  orders,
  admins,
  settings,
  type InsertOrder,
  type Order,
  type UpdateOrderStatus,
  type Admin,
  type InsertAdmin,
  type Settings,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;

  // Commission
  updateOrderCommission(id: number, commission?: string, paid?: boolean): Promise<Order | undefined>;

  // Admins
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAdmins(): Promise<Admin[]>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  updateMaintenanceMode(enabled: boolean): Promise<Settings | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.email, email));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id)).returning();
    return result.length > 0;
  }

  async updateOrderCommission(id: number, commission?: string, paid?: boolean): Promise<Order | undefined> {
    const setObj: any = {};
    if (commission !== undefined) setObj.commission = commission;
    if (paid !== undefined) setObj.commissionPaid = paid;
    const [order] = await db
      .update(orders)
      .set(setObj)
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }

  async getAdmins(): Promise<Admin[]> {
    return await db.select().from(admins);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  async getSettings(): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings);
    return setting;
  }

  async updateMaintenanceMode(enabled: boolean): Promise<Settings | undefined> {
    const [setting] = await db
      .update(settings)
      .set({ maintenanceMode: enabled })
      .returning();
    return setting;
  }
}

export const storage = new DatabaseStorage();
