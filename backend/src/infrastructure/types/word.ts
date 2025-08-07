export type Word = {
    id: number;
    word: string;
};

export type WordResponse = {
    results: Word[];
    totalDocs: number;
    prevous: string;
    next: string;
    hasNext: boolean;
    hasPrev: boolean;
};