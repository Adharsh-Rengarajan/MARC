import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import { UserModel } from "./models/user.js";

dotenv.config();

const defaultUsers = [
  { email: "owner@marc.com", password: "Owner@123", name: "Marc Owner", role: "owner" },
  { email: "manager1@marc.com", password: "Manager@123", name: "Manager One", role: "manager" },
  { email: "manager2@marc.com", password: "Manager@123", name: "Manager Two", role: "manager" },
  { email: "engineer1@marc.com", password: "Engineer@123", name: "Engineer One", role: "engineer" },
  { email: "engineer2@marc.com", password: "Engineer@123", name: "Engineer Two", role: "engineer" },
  { email: "accountant1@marc.com", password: "Accountant@123", name: "Accountant One", role: "accountant" },
  { email: "accountant2@marc.com", password: "Accountant@123", name: "Accountant Two", role: "accountant" },
];

export const seedUsers = async () => {
  let created = 0;
  let existing = 0;
  for (const u of defaultUsers) {
    const found = await UserModel.findOne({ email: u.email });
    if (found) {
      existing += 1;
      continue;
    }
    await UserModel.create(u);
    created += 1;
  }
  console.log(`Seed complete: ${created} created, ${existing} already existed`);
  return { created, existing };
};

const runStandalone = async () => {
  try {
    await connectDB();
    await seedUsers();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runStandalone();
}
