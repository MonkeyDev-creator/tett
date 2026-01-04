import dotenv from "dotenv";
import dns from "dns";

const result = dotenv.config();
if (result.error) {
  // No .env file found locally — that's fine in production where envs come from the environment.
}

// Prefer IPv4 results first to avoid environments without IPv6 connectivity
try {
  // Node 17.7+ supports setDefaultResultOrder
  // This helps platforms that can't reach IPv6 addresses (ENETUNREACH) resolve an IPv4 address first.
  (dns as any).setDefaultResultOrder?.("ipv4first");
} catch (e) {
  // ignore if not supported
}

// Ensure a default NODE_ENV for local development when not provided by the shell
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

export {};
