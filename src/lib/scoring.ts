export const calculateVariable = (scores: number[]): number => {
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return 5 / average;
};

export const adjustScores = (scores: number[], variable: number): number[] => {
    return scores.map((score) => score * variable);
};

export const calculateBandScores = (allScores: number[][]): number[] => {
    return allScores.map((scores) => scores.reduce((sum, score) => sum + score, 0) / scores.length);
};
