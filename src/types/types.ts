export type User = {
    id: string;
    name: string;
    band: string;
    scores: { band: string; score: number }[];
    variable: number;
};

export interface Band {
    id: string;
    name: string;
    score: number;
    averageScore: number;
    rank: number;
    totalAdjustedScore?: number; // オプショナルとして追加
}
export interface Score {
    band: string;
    score: number;
}

export interface FormData {
    name: string;
    band: string;
    scores: Score[];
}

export interface Vote {
    id: string;
    userName: string;
    bandId: string;
    bandName: string;
    score: number;
    createdAt: string;
}
