export type Word = {
    id: string;
    value: string;
};

export type WordResponse = {
    results: Word[];
    totalDocs: number;
    prevous: string;
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
    previous: string;
    next: string;
    hasNext: boolean;
    hasPrev: boolean;
}