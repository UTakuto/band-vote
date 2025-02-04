// ③と④: 個人ごとの平均点を計算し、変数を求める
export const calculateVariable = (scores: number[], excludeIndex: number): number => {
    // 自分の出演バンドのスコアを除外
    const filteredScores = scores.filter((_, index) => index !== excludeIndex);
    const average = filteredScores.reduce((sum, score) => sum + score, 0) / filteredScores.length;
    return 5 / average;
};

// ⑤: 個人がつけたそれぞれのバンド点数に変数をかける
export const adjustScores = (scores: number[], variable: number): number[] => {
    return scores.map((score) => score * variable);
};

// ⑥と⑦: バンドごとに修正後平均点を合計し、平均点を計算する
export const calculateBandScores = (allScores: number[][]): number[] => {
    const bandScores = allScores[0].map((_, bandIndex) => {
        const total = allScores.reduce((sum, scores) => sum + scores[bandIndex], 0);
        return total / allScores.length;
    });
    return bandScores;
};

// ⑧: 順位を計算する
export const calculateRank = (bandScores: number[]): number[] => {
    const sortedScores = [...bandScores].sort((a, b) => b - a);
    return bandScores.map((score) => sortedScores.indexOf(score) + 1);
};

// const scores = [4, 5, 3, 4]; // 個人がつけたスコア
// const excludeIndex = 1; // 自分の出演バンドのインデックス
// const variable = calculateVariable(scores, excludeIndex);

// const adjustedScores = adjustScores(scores, variable);

// const allScores = [
//     [4, 5, 3, 4], // 個人1のスコア
//     [3, 4, 5, 2], // 個人2のスコア
//     [5, 3, 4, 5], // 個人3のスコア
// ];
// const bandScores = calculateBandScores(allScores);
