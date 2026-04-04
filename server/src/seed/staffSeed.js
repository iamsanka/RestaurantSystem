import { db } from "../db.js";
import { users } from "../schema/users.js";
import { hashPassword } from "../utils/auth.js";

async function seedStaff() {
  try {
    const hashed = await hashPassword("staff123");

    await db.insert(users).values({
      name: "Staff User",
      email: "staff@test.com",
      password: hashed,
      role: "staff",
      phone: "0000000000",
    });

    console.log("Staff user created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding staff user:", err);
    process.exit(1);
  }
}

seedStaff();
