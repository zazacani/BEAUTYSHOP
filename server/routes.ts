import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import Stripe from "stripe";
import { AuthService } from "./services/auth.service";
import { ProductService } from "./services/product.service";
import { DiscountService } from "./services/discount.service";
import { OrderService } from "./services/order.service";
import { SettingsService } from "./services/settings.service";
import { UserRepository } from "./repositories/user.repository";
import { ProductRepository } from "./repositories/product.repository";
import { DiscountRepository } from "./repositories/discount.repository";
import { OrderRepository } from "./repositories/order.repository";
import { SettingsRepository } from "./repositories/settings.repository";
import { authenticate, requireAdmin, type AuthRequest } from "./middleware/auth.middleware";
import { insertUserSchema, insertProductSchema, insertDiscountCodeSchema, insertSiteSettingsSchema } from "@shared/schema";
import { AdminService } from "./services/admin.service";
import { UserService, updateProfileSchema, changePasswordSchema } from "./services/user.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const userRepo = new UserRepository();
const productRepo = new ProductRepository();
const discountRepo = new DiscountRepository();
const orderRepo = new OrderRepository();
const settingsRepo = new SettingsRepository();

const authService = new AuthService(userRepo);
const productService = new ProductService(productRepo);
const discountService = new DiscountService(discountRepo);
const orderService = new OrderService(orderRepo, productRepo, discountService);
const adminService = new AdminService();
const userService = new UserService(userRepo);
const settingsService = new SettingsService(settingsRepo);

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

  app.post("/api/upload", authenticate, requireAdmin, upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/brands", async (_req, res) => {
    try {
      const { db } = await import("./db");
      const { brands } = await import("@shared/schema");
      const allBrands = await db.select().from(brands);
      res.json(allBrands);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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

  app.post("/api/discount", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const data = insertDiscountCodeSchema.parse(req.body);
      const code = await discountService.createCode(data);
      res.status(201).json(code);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/discount/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const updated = await discountService.updateCode(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      if (error.message === "Discount code not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/discount/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      await discountService.deleteCode(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === "Discount code not found") {
        return res.status(404).json({ error: error.message });
      }
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
      if (req.user!.role === "ADMIN") {
        const orders = await orderService.getAllOrders();
        res.json(orders);
      } else {
        const orders = await orderService.getUserOrders(req.user!.userId);
        res.json(orders);
      }
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

  app.patch("/api/orders/:id/status", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { status, trackingNumber } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, status, trackingNumber);
      res.json(order);
    } catch (error: any) {
      if (error.message === "Order not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/stats", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const stats = await adminService.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/user/profile", authenticate, async (req: AuthRequest, res) => {
    try {
      const profile = await userService.getProfile(req.user!.userId);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  app.put("/api/user/profile", authenticate, async (req: AuthRequest, res) => {
    try {
      const data = updateProfileSchema.parse(req.body);
      const updated = await userService.updateProfile(req.user!.userId, data);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/user/password", authenticate, async (req: AuthRequest, res) => {
    try {
      const data = changePasswordSchema.parse(req.body);
      await userService.changePassword(req.user!.userId, data);
      res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await settingsService.getSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/settings", authenticate, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const data = insertSiteSettingsSchema.parse(req.body);
      const updated = await settingsService.updateSettings(data);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/create-checkout-session", authenticate, async (req: AuthRequest, res) => {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Cart items are required" });
      }

      const user = await userRepo.findById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const lineItems = await Promise.all(
        items.map(async (item: { id: string; quantity: number }) => {
          const product = await productRepo.findById(item.id);
          if (!product) {
            throw new Error(`Product not found: ${item.id}`);
          }
          if (item.quantity < 1) {
            throw new Error(`Invalid quantity for product: ${item.id}`);
          }

          return {
            price_data: {
              currency: "chf",
              product_data: {
                name: product.titleEn || product.titleFr || product.titleDe || "Product",
                images: product.imageUrl1 ? [`${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}${product.imageUrl1}`] : [],
              },
              unit_amount: Math.round(parseFloat(product.price) * 100),
            },
            quantity: item.quantity,
          };
        })
      );

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/payment-cancel`,
        customer_email: user.email,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
