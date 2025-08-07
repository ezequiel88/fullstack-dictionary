import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const filePath = path.join(__dirname, "english.txt");

    const content = fs.readFileSync(filePath, "utf-8");
    const words = [
      ...new Set(
        content
          .split(/\r?\n/)
          .map((w) => w.trim())
          .filter(Boolean)
      ),
    ];

    console.log(`Found ${words.length} words. Importing...`);

    await prisma.word.createMany({
      data: words.map((w) => ({ value: w })),
      skipDuplicates: true,
    });

    console.log("Done!");
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
