export type User = {
    id: string;
    name: string;
    band: string;
    scores: { band: string; score: number }[];
    variable: number;
};

export type Band = {
    id: string;
    name: string;
    totalAdjustedScore: number;
    averageScore: number;
};
