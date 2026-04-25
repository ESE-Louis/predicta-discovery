const fs = require("fs");
const path = require("path");

// Load .env.local manually — needed because Next.js 14 has issues loading
// .env.local when the project path contains spaces (macOS common issue)
try {
  const envPath = path.join(__dirname, ".env.local");
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  });
} catch (e) {
  // .env.local not present (e.g. production — env vars set in Vercel dashboard)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
