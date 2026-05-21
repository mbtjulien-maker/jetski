import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const publicDir = path.resolve("public");
const inputs = ["hero.png", "hero-alt.png"];

for (const name of inputs) {
  const inputPath = path.join(publicDir, name);
  const outputName = name.replace(/\.png$/, ".webp");
  const outputPath = path.join(publicDir, outputName);
  try {
    const meta = await sharp(inputPath).metadata();
    await sharp(inputPath)
      .webp({ quality: 92, effort: 6 })
      .toFile(outputPath);
    const stat = await fs.stat(outputPath);
    console.log(
      `${name} (${meta.width}x${meta.height}) -> ${outputName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`
    );
  } catch (e) {
    console.error(`Failed for ${name}:`, e.message);
  }
}
