import { db } from "../db";
import { orders, orderItems, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import { eq } from "drizzle-orm";

export class OrderRepository {
  async create(data: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(data).returning();
    return order;
  }

  async findById(id: string): Promise<Order | undefined> {
    return await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        items: true,
      },
    });
  }

  async createOrderItem(data: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(data).returning();
    return item;
  }

  async updateStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }
}
