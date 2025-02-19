import { build } from "esbuild";
import * as fs from "fs/promises";

async function main() {
  try {
    // Clean dist folder
    await fs.rm("dist", { recursive: true, force: true });

    // Build the application
    console.log("Building with esbuild...");
    await build({
      entryPoints: ["src/main.ts"],
      bundle: true,
      platform: "node",
      target: "node20",
      outfile: "dist/index.js",
      sourcemap: true,
      format: "cjs",
      logLevel: "info",
      logLimit: 0,
      minify: true,
    });
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Build script failed:", err);
  process.exit(1);
});
