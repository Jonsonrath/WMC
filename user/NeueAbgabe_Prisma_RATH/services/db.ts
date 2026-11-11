import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.ts";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing (see .env.example)");
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const db = new PrismaClient({ adapter });

export default db;
