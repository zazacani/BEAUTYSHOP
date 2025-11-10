import { db } from "../db";
import { orders, orderItems, users, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

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

  async findByPaymentIntentId(paymentIntentId: string): Promise<Order | undefined> {
    return await db.query.orders.findFirst({
      where: eq(orders.paymentIntentId, paymentIntentId),
      with: {
        items: true,
      },
    });
  }

  async createOrderItem(data: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(data).returning();
    return item;
  }

  async updateStatus(id: string, status: string, trackingNumber?: string): Promise<Order | undefined> {
    const updateData: any = { 
      status,
      updatedAt: new Date()
    };
    
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }

    const [updated] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async findAllWithUserInfo(): Promise<(Order & { userName: string; userEmail: string })[]> {
    const result = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        totalAmount: orders.totalAmount,
        discountAmount: orders.discountAmount,
        discountCodeId: orders.discountCodeId,
        status: orders.status,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));
    
    return result as (Order & { userName: string; userEmail: string })[];
  }
}
