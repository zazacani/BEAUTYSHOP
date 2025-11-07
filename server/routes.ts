import type { Express } from "express";
import { createServer, type Server } from "http";
import { AuthService } from "./services/auth.service";
import { ProductService } from "./services/product.service";
import { DiscountService } from "./services/discount.service";
import { OrderService } from "./services/order.service";
import { UserRepository } from "./repositories/user.repository";
import { ProductRepository } from "./repositories/product.repository";
import { DiscountRepository } from "./repositories/discount.repository";
import { OrderRepository } from "./repositories/order.repository";
import { authenticate, requireAdmin, type AuthRequest } from "./middleware/auth.middleware";
import { insertUserSchema, insertProductSchema, insertDiscountCodeSchema } from "@shared/schema";

const userRepo = new UserRepository();
const productRepo = new ProductRepository();
const discountRepo = new DiscountRepository();
const orderRepo = new OrderRepository();

const authService = new AuthService(userRepo);
const productService = new ProductService(productRepo);
const discountService = new DiscountService(discountRepo);
const orderService = new OrderService(orderRepo, productRepo, discountService);

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const result = await authService.register(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const { search } = req.query;
      const products = search
        ? await productService.searchProducts(search as string)
        : await productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  app.post("/api/products", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await productService.createProduct(data);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/products/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  app.post("/api/discount/validate", authenticate, async (req: AuthRequest, res) => {
    try {
      const { code } = req.body;
      const discount = await discountService.validateCode(code, req.user!.userId);
      res.json(discount);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/discount", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const codes = await discountService.getAllCodes();
      res.json(codes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/orders", authenticate, async (req: AuthRequest, res) => {
    try {
      const { items, discountCode } = req.body;
      const order = await orderService.createOrder({
        userId: req.user!.userId,
        items,
        discountCode,
      });
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/orders", authenticate, async (req: AuthRequest, res) => {
    try {
      const orders = await orderService.getUserOrders(req.user!.userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/orders/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (order.userId !== req.user!.userId && req.user!.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
