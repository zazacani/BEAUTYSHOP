import { db } from "../db";
import { products, type Product, type InsertProduct } from "@shared/schema";
import { eq, or, ilike, sql } from "drizzle-orm";

export class ProductRepository {
  async create(data: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  }

  async findAll(): Promise<Product[]> {
    return await db.query.products.findMany({
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
  }

  async findById(id: string): Promise<Product | undefined> {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
    });
  }

  async search(query: string): Promise<Product[]> {
    const searchTerm = `%${query}%`;
    return await db.query.products.findMany({
      where: or(
        ilike(products.titleFr, searchTerm),
        ilike(products.titleDe, searchTerm),
        ilike(products.titleEn, searchTerm),
        ilike(products.descriptionFr, searchTerm),
        ilike(products.descriptionDe, searchTerm),
        ilike(products.descriptionEn, searchTerm)
      ),
    });
  }

  async update(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async updateStock(id: string, quantity: number): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({ quantityInStock: sql`${products.quantityInStock} - ${quantity}` })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }
}
