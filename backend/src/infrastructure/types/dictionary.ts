export interface Phonetic {
    text: string;
    audio?: string;
}

export interface Definition {
    definition: string;
    example?: string;
    synonyms: string[];
    antonyms: string[];
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

export interface WordEntry {
    word: string;
    phonetic?: string;
    phonetics: Phonetic[];
    origin?: string;
    meanings: Meaning[];
}

export type DictionaryResponse = WordEntry[];