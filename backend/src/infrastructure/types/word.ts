export type Word = {
    id: string;
    value: string;
};

export type WordResponse = {
    results: Word[];
    totalDocs: number;
    previous: string;
    next: string;
    hasNext: boolean;
    hasPrev: boolean;
};

export interface CursorQuery {
    search?: string;
    limit?: number;
    next?: string;
    previous?: string;
}

export interface CursorResponse {
    results: Word[];
    totalDocs: number;
    previous: string | null;
    next: string | null;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface RawWordEntry {
  word: string;
  phonetic?: string;
  phonetics?: {
    text?: string;
    audio?: string;
    sourceUrl?: string;
    license?: {
      name: string;
      url: string;
    };
  }[];
  meanings?: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }[];
    synonyms?: string[];
    antonyms?: string[];
  }[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls?: string[];
}

export interface NormalizedWordDefinition {
  word: string;
  phonetic: string | null;
  phonetics: {
    text: string | null;
    audio: string | null;
    sourceUrl?: string;
    license?: {
      name: string;
      url: string;
    };
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}