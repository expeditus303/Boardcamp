import dotenv from "dotenv";
import pkg from "pg";   

dotenv.config();

const { Pool } = pkg;

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.MODE === "prod") connection.ssl = true;