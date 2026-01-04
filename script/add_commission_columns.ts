import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query(`ALTER TABLE IF EXISTS orders ADD COLUMN IF NOT EXISTS commission text;`);
    await pool.query(`ALTER TABLE IF EXISTS orders ADD COLUMN IF NOT EXISTS commission_paid boolean DEFAULT false;`);
    console.log("Columns ensured: commission, commission_paid");
  } catch (err) {
    console.error("Failed to alter table:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
