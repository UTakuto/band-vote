// 個人の平均点計算

export const calculateVariable = (
    scores: number[],
    voterBandId: string,
    bandIds: string[]
): number => {
    const modifiedScores = scores.map((score, index) =>
        bandIds[index] === voterBandId ? 0 : score
    );

    const nonZeroScores = modifiedScores.filter((score) => score !== 0);
    if (nonZeroScores.length === 0) return 1;

    const average = nonZeroScores.reduce((sum, score) => sum + score, 0) / nonZeroScores.length;
    return 5 / average;
};
// export const calculateVariable = (scores: number[], excludeIndex: number): number => {
//     console.log("===== 個人の点数計算 =====");
//     console.log("元のスコア:", scores);

//     // 自分の出演バンドのスコアを0点にする
//     const modifiedScores = scores.map((score, index) => (index === excludeIndex ? 0 : score));
//     console.log("自分のバンドを0点に修正:", modifiedScores);

//     // 0点を除外して平均を計算
//     const nonZeroScores = modifiedScores.filter((score) => score !== 0);
//     console.log("0点を除外したスコア:", nonZeroScores);

//     const average = nonZeroScores.reduce((sum, score) => sum + score, 0) / nonZeroScores.length;
//     console.log("個人の平均点:", average);

//     const variable = 5 / average;
//     console.log("個人の補正値:", variable);
//     console.log("========================");

//     return variable;
// };

// // バンドごとの平均点を計算する関数
// export const calculateBandScores = (allScores: number[][]): number[] => {
//     console.log("===== バンドの平均点計算 =====");
//     console.log("入力された全スコア:", allScores);

//     const bandScores = allScores[0].map((_, bandIndex) => {
//         // そのバンドの全スコアを取得
//         const bandScores = allScores.map((scores) => scores[bandIndex]);
//         console.log(`バンド${bandIndex + 1}の集計:`);
//         console.log(`- 全スコア:`, bandScores);

//         // 平均を計算
//         const total = bandScores.reduce((sum, score) => sum + score, 0);
//         const average = total / bandScores.length;
//         console.log(`- 平均点: ${average.toFixed(2)}`);

//         return average;
//     });

//     console.log(
//         "全バンドの最終スコア:",
//         bandScores.map((score) => score.toFixed(2))
//     );
//     console.log("============================");
//     return bandScores;
// };

// // 順位を計算する関数
// export const calculateRank = (bandScores: number[]): number[] => {
//     console.log("===== 順位計算 =====");
//     const ranks = bandScores.map((score) => {
//         const rank = bandScores.filter((s) => s > score).length + 1;
//         return rank;
//     });
//     console.log("順位結果:", ranks);
//     console.log("===================");
//     return ranks;
// };
