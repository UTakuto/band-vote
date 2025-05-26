import { Band, Vote } from "@/types/types";

type AdjustedVote = {
    voterId: string;
    voterName: string;
    variable: number;
    adjustedScores: number[];
    originalScores: number[];
};
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
/**
 * ステップ3〜5：補正値と修正後スコアを全員分返す
 */
export const calculateAdjustedScores = (votes: Vote[], bands: Band[]): AdjustedVote[] => {
    return votes.map((vote) => {
        const bandIds = bands.map((b) => b.id);
        const voterBandIdList = vote.voterBandId
            .split("、")
            .flatMap((v) => v.split(","))
            .map((id) => id.trim());

        const scores = bandIds.map((id) => {
            const found = vote.scores.find((s) => s.bandId === id);
            return found ? found.score : 0;
        });

        // ステップ3: 自分のバンド以外の平均点
        const validScores = scores.filter(
            (_, index) => !voterBandIdList.includes(bandIds[index]) && scores[index] !== 0
        );
        const avg =
            validScores.length > 0
                ? validScores.reduce((a, b) => a + b, 0) / validScores.length
                : 1;

        // ステップ4: 変数（補正値）
        const variable = 5 / avg;

        // ステップ5: 修正後スコア
        const adjustedScores = scores.map((s) => s * variable);

        return {
            voterId: vote.id,
            voterName: vote.userName,
            variable: parseFloat(variable.toFixed(4)),
            adjustedScores: adjustedScores.map((v) => parseFloat(v.toFixed(6))),
            originalScores: scores,
        };
    });
};

// /**
//  * ステップ6〜8：バンドごとの修正後スコア平均と順位を返す
//  */
// export const calculateBandAveragesAndRanks = (
//     adjustedData: { adjustedScores: number[] }[],
//     bands: Band[]
// ) => {
//     const numBands = bands.length;
//     const bandTotals = Array(numBands).fill(0);
//     const bandCounts = Array(numBands).fill(0);

//     adjustedData.forEach(({ adjustedScores }) => {
//         adjustedScores.forEach((score, i) => {
//             bandTotals[i] += score;
//             bandCounts[i] += 1;
//         });
//     });

//     const bandAverages = bandTotals.map((sum, i) => (bandCounts[i] > 0 ? sum / bandCounts[i] : 0));

//     const ranked = bandAverages
//         .map((avg, i) => ({
//             bandId: bands[i].id,
//             bandName: bands[i].name,
//             average: parseFloat(avg.toFixed(4)),
//         }))
//         .sort((a, b) => b.average - a.average);

//     const rankedWithOrder = ranked.map((entry, index) => ({
//         ...entry,
//         rank: index + 1,
//     }));

//     return rankedWithOrder;
// };
/**
 * チーム（バンド）ごとの補正後スコア合計と平均点を返す（順位なし）
 */
export const calculateBandTotalAdjustedScores = (
    adjustedData: { adjustedScores: number[] }[],
    votes: Vote[],
    bands: Band[]
) => {
    const numBands = bands.length;
    const bandTotals = Array(numBands).fill(0);
    const bandCounts = Array(numBands).fill(0);

    adjustedData.forEach(({ adjustedScores }, voterIndex) => {
        adjustedScores.forEach((score, i) => {
            const vote = votes[voterIndex];
            const originalScore = vote.scores.find((s) => s.bandId === bands[i].id)?.score;
            if (originalScore !== undefined && originalScore > 0) {
                bandTotals[i] += score;
                bandCounts[i] += 1;
            }
        });
    });

    return bands.map((band, i) => ({
        bandId: band.id,
        bandName: band.name,
        total: parseFloat(bandTotals[i].toFixed(6)),
        average: bandCounts[i] > 0 ? parseFloat((bandTotals[i] / bandCounts[i]).toFixed(4)) : 0,
    }));
};
