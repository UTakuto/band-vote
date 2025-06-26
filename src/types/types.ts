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
    order?: number;
    createdAt: string | Date; // ISO 8601形式の文字列またはDate型
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
    createdAt: string | Date;
}

export interface BandTableProps {
    bands: Band[];
    votes: Vote[];
    isEditing: boolean;
    setBands: React.Dispatch<React.SetStateAction<Band[]>>;
    isVotingOpen: boolean;
}

export interface BandScoreListProps {
    bands: Band[];
    selectedBands: { [key: string]: boolean };
    onScoresChange: (scores: { [key: string]: number }) => void;
}
