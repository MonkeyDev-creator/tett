import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    // Create settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        maintenance_mode BOOLEAN DEFAULT false NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Settings table created.");

    // Initialize with default settings if empty
    const result = await pool.query(`SELECT COUNT(*) FROM settings;`);
    if (result.rows[0].count === "0") {
      await pool.query(`
        INSERT INTO settings (maintenance_mode) VALUES (false);
      `);
      console.log("Default settings initialized.");
    }
  } catch (err) {
    console.error("Failed to create settings table:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
