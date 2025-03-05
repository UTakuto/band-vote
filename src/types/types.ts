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
    voterBandId: string;
    voterBandName: string;
    scores: {
        bandId: string;
        bandName: string;
        score: number;
    }[];
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}

export interface BandScoreListProps {
    bands: Band[];
    selectedBands: { [key: string]: boolean };
    onScoresChange: (scores: { [key: string]: number }) => void;
}
