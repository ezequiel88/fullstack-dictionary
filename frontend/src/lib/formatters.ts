import { RawWordEntry, WordDefinition, Phonetic, Meaning, Definition } from '@/types';

/**
 * Normaliza dados da API externa (Free Dictionary API) para o formato interno
 */
export const normalizeWordDefinition = (
  rawData: RawWordEntry[], 
  wordId: string, 
  isFavorite: boolean = false
): WordDefinition | null => {
  if (!rawData || rawData.length === 0) return null;
  
  const firstEntry = rawData[0];
  
  // Normaliza fonéticas
  const phonetics: Phonetic[] = (firstEntry.phonetics || []).map(p => ({
    text: p.text || null,
    audio: p.audio || null,
    sourceUrl: p.sourceUrl,
    license: p.license,
  }));
  
  // Normaliza significados
  const meanings: Meaning[] = (firstEntry.meanings || []).map(m => ({
    partOfSpeech: m.partOfSpeech,
    definitions: (m.definitions || []).map(d => ({
      definition: d.definition,
      example: d.example,
      synonyms: d.synonyms || [],
      antonyms: d.antonyms || [],
    })),
    synonyms: m.synonyms || [],
    antonyms: m.antonyms || [],
  }));
  
  return {
    id: wordId,
    isFavorite,
    word: firstEntry.word,
    phonetic: firstEntry.phonetic || null,
    phonetics,
    meanings,
    license: firstEntry.license,
    sourceUrls: firstEntry.sourceUrls || [],
  };
};

/**
 * Formata data para exibição
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  if (diffInDays < 7) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  
  return formatDate(dateString);
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Remove caracteres especiais para busca
 */
export const sanitizeSearchTerm = (term: string): string => {
  return term
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z\s\-']/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * Valida se uma URL de áudio é válida
 */
export const isValidAudioUrl = (url: string | null): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg');
  } catch {
    return false;
  }
};

/**
 * Extrai o primeiro áudio válido das fonéticas
 */
export const getFirstValidAudio = (phonetics: Phonetic[]): string | null => {
  for (const phonetic of phonetics) {
    if (isValidAudioUrl(phonetic.audio)) {
      return phonetic.audio;
    }
  }
  return null;
};

/**
 * Extrai todas as definições de todos os significados
 */
export const getAllDefinitions = (meanings: Meaning[]): Definition[] => {
  return meanings.flatMap(meaning => meaning.definitions);
};

/**
 * Extrai todos os sinônimos únicos
 */
export const getAllSynonyms = (meanings: Meaning[]): string[] => {
  const synonyms = new Set<string>();
  
  meanings.forEach(meaning => {
    meaning.synonyms.forEach(synonym => synonyms.add(synonym));
    meaning.definitions.forEach(def => {
      def.synonyms.forEach(synonym => synonyms.add(synonym));
    });
  });
  
  return Array.from(synonyms);
};

/**
 * Extrai todos os antônimos únicos
 */
export const getAllAntonyms = (meanings: Meaning[]): string[] => {
  const antonyms = new Set<string>();
  
  meanings.forEach(meaning => {
    meaning.antonyms.forEach(antonym => antonyms.add(antonym));
    meaning.definitions.forEach(def => {
      def.antonyms.forEach(antonym => antonyms.add(antonym));
    });
  });
  
  return Array.from(antonyms);
};

/**
 * Formata lista de palavras para exibição
 */
export const formatWordList = (words: string[]): string => {
  if (words.length === 0) return '';
  if (words.length === 1) return words[0];
  if (words.length === 2) return words.join(' e ');
  
  const lastWord = words[words.length - 1];
  const otherWords = words.slice(0, -1);
  return `${otherWords.join(', ')} e ${lastWord}`;
};