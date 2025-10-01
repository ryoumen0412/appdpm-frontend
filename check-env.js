/**
 * Test environment variables loading in Expo
 * This simulates how @env imports work
 */

// Check if .env file exists and is readable
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");

console.log("Checking .env file...");
console.log("Path:", envPath);

if (fs.existsSync(envPath)) {
  console.log("✅ .env file exists\n");

  const content = fs.readFileSync(envPath, "utf8");
  console.log("Content:");
  console.log("---");
  console.log(content);
  console.log("---\n");

  // Parse and display
  const lines = content
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"));
  console.log("Parsed variables:");
  lines.forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      console.log(`  ${key.trim()} = ${value.trim()}`);
    }
  });
} else {
  console.log("❌ .env file not found!");
}
