import { cpSync } from "fs";
import { join } from "path";

const from = join(__dirname, "../public");
const to = join(__dirname, "../dist/public");

try {
  cpSync(from, to, { recursive: true });
  console.log("✅ Public assets copied to dist/public");
} catch (err) {
  console.error("❌ Failed to copy public assets:", err);
}
