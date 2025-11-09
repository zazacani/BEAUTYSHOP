import { db } from "../db";
import { users } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seedSuperAdmin() {
  try {
    console.log("🌱 Seeding super admin...");

    const adminEmail = "admin@mue.ch";
    const adminPassword = "Admin@MUE2024";

    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));

    if (existingAdmin.length > 0) {
      console.log("✅ Super admin already exists");
      console.log("Email:", adminEmail);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await db.insert(users).values({
      email: adminEmail,
      password: hashedPassword,
      name: "Super Admin",
      role: "ADMIN",
    });

    console.log("✅ Super admin created successfully!");
    console.log("\n=== SUPER ADMIN CREDENTIALS ===");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("================================\n");
    console.log("⚠️  IMPORTANT: Change this password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding super admin:", error);
    process.exit(1);
  }
}

seedSuperAdmin();
