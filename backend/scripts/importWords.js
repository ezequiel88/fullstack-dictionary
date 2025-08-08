import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// Word validation function (copied from wordValidator.ts)
function isValidWord(word) {
  if (!word || typeof word !== 'string') {
    return false;
  }

  const trimmedWord = word.trim();

  // Check minimum length (at least 2 characters)
  if (trimmedWord.length < 2) {
    return false;
  }

  // Check maximum reasonable length (avoid extremely long entries)
  if (trimmedWord.length > 50) {
    return false;
  }

  // Check for problematic characters
  const problematicChars = /[—''""…\u2013\u2014\u2018\u2019\u201C\u201D\u2026]/;
  if (problematicChars.test(trimmedWord)) {
    return false;
  }

  // Check for non-ASCII characters (accents, special symbols)
  // Allow only basic Latin letters, hyphens, apostrophes, and periods
  const validCharsPattern = /^[a-zA-Z\-'.]+$/;
  if (!validCharsPattern.test(trimmedWord)) {
    return false;
  }

  // Reject words that are mostly punctuation
  const letterCount = (trimmedWord.match(/[a-zA-Z]/g) || []).length;
  const punctuationCount = (trimmedWord.match(/[\-'.]/g) || []).length;
  
  // At least 70% of the word should be letters
  if (letterCount / trimmedWord.length < 0.7) {
    return false;
  }

  // Reject words with too many consecutive punctuation marks
  if (/[\-'.]{3,}/.test(trimmedWord)) {
    return false;
  }

  // Reject words starting or ending with punctuation (except apostrophes for contractions)
  if (/^[\-.]|[\-.]$/.test(trimmedWord)) {
    return false;
  }

  // Reject words with multiple consecutive hyphens or periods
  if (/--+|\.\.+/.test(trimmedWord)) {
    return false;
  }

  // Reject words that look like abbreviations with multiple periods
  if (/\.[a-zA-Z]\.|[a-zA-Z]\.[a-zA-Z]\./.test(trimmedWord)) {
    return false;
  }

  return true;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const filePath = path.join(__dirname, "english.txt");

    const content = fs.readFileSync(filePath, "utf-8");
    const allWords = content
      .split(/\r?\n/)
      .map((w) => w.trim())
      .filter(Boolean);
    
    console.log(`Found ${allWords.length} total words.`);
    
    // Filter valid words
    const validWords = [...new Set(allWords.filter(isValidWord))];
    const invalidWords = allWords.filter(w => !isValidWord(w));
    
    console.log(`Valid words: ${validWords.length}`);
    console.log(`Invalid words filtered out: ${invalidWords.length}`);
    
    if (invalidWords.length > 0) {
      console.log(`Examples of filtered words: ${invalidWords.slice(0, 10).join(', ')}`);
    }
    
    console.log(`Importing valid words...`);

    await prisma.word.createMany({
      data: validWords.map((w) => ({ value: w.toLowerCase() })),
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
