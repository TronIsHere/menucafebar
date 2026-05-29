import fs from "fs";
import path from "path";

const ICONS_DIR = path.join(process.cwd(), "node_modules", "react-icons");

const packs = fs.readdirSync(ICONS_DIR).filter((dir) => !dir.startsWith("."));

const registry = {};

for (const pack of packs) {
  const indexPath = path.join(ICONS_DIR, pack, "index.d.ts");

  if (!fs.existsSync(indexPath)) continue;

  const content = fs.readFileSync(indexPath, "utf-8");

  const matches = [...content.matchAll(/export declare const (\w+)/g)];

  registry[pack] = matches.map((m) => m[1]);
}

fs.writeFileSync("icon-registry.json", JSON.stringify(registry, null, 2));

console.log("✅ Icon registry generated successfully");
