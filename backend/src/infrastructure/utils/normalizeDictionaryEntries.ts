import { NormalizedWordDefinition, RawWordEntry } from "../types/word.js";


export function normalizeDictionaryEntries(entries: RawWordEntry[]): NormalizedWordDefinition[] {
  const map = new Map<string, NormalizedWordDefinition>();

  for (const entry of entries) {
    const word = entry.word;
    const base = map.get(word) ?? {
      word,
      phonetic: entry.phonetic ?? null,
      phonetics: [] as NormalizedWordDefinition['phonetics'],
      meanings: [] as NormalizedWordDefinition['meanings'],
      license: entry.license ?? undefined,
      sourceUrls: entry.sourceUrls ?? [],
    };

    // Phonetics
    const rawPhonetics = Array.isArray(entry.phonetics) ? entry.phonetics : [];
    for (const p of rawPhonetics) {
      const text = p.text ?? null;
      const audio = p.audio ?? null;
      if (!text && !audio) continue;

      const key = `${text || ""}__${audio || ""}`;
      if (!base.phonetics.find(f => `${f.text || ""}__${f.audio || ""}` === key)) {
        base.phonetics.push({
          text,
          audio,
          sourceUrl: p.sourceUrl,
          license: p.license,
        });
      }
    }

    // Meanings
    const rawMeanings = Array.isArray(entry.meanings) ? entry.meanings : [];
    for (const meaning of rawMeanings) {
      const existing = base.meanings.find(m => m.partOfSpeech === meaning.partOfSpeech);
      const defList = (meaning.definitions ?? []).map((d) => ({
        definition: d.definition,
        example: d.example,
        synonyms: d.synonyms ?? [],
        antonyms: d.antonyms ?? [],
      }));

      if (existing) {
        existing.definitions.push(...defList);
        existing.synonyms.push(...(meaning.synonyms ?? []));
        existing.antonyms.push(...(meaning.antonyms ?? []));
      } else {
        base.meanings.push({
          partOfSpeech: meaning.partOfSpeech,
          definitions: defList,
          synonyms: meaning.synonyms ?? [],
          antonyms: meaning.antonyms ?? [],
        });
      }
    }

    // Source URLs
    for (const url of entry.sourceUrls ?? []) {
      if (!base.sourceUrls.includes(url)) {
        base.sourceUrls.push(url);
      }
    }

    if (!base.phonetic && entry.phonetic) {
      base.phonetic = entry.phonetic;
    }

    map.set(word, base);
  }

  return Array.from(map.values());
}
