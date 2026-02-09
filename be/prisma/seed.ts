import "dotenv/config";
import prisma from "../src/lib/prisma.js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Seeding database via SQL file...");

  const sqlPath = path.join(__dirname, "data.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  try {
    await prisma.$executeRawUnsafe(sql);
    console.log("SQL Seed completed successfully.");
  } catch (error) {
    console.error("Error executing SQL seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
