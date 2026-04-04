import { db } from "../db.js";
import { users } from "../schema/users.js";
import { hashPassword } from "../utils/auth.js";

async function seedAdmin() {
  const hashed = await hashPassword("admin123");

  await db.insert(users).values({
    name: "Super Admin",
    email: "admin@test.com",
    password: hashed,
    role: "admin",
    phone: "0000000000",
  });

  console.log("Admin user created successfully");
  process.exit(0);
}

seedAdmin();
