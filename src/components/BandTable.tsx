import React, { useEffect, useRef } from "react";
import { Band, Vote } from "@/types/types";
import { calculateVariable, adjustScores, calculateBandScores, calculateRank } from "@/lib/scoring";

interface BandTableProps {
    bands: Band[];
    votes: Vote[];
    isEditing: boolean;
    setBands: React.Dispatch<React.SetStateAction<Band[]>>;
}

const BandTable: React.FC<BandTableProps> = ({ bands, votes, isEditing, setBands }) => {
    // 計算が実行済みかどうかを追跡するref
    const hasCalculated = useRef(false);

    useEffect(() => {
        // 計算が未実行で、必要なデータが揃っている場合のみ実行
        if (!hasCalculated.current && !isEditing && votes.length > 0 && bands.length > 0) {
            // 1. 全投票者のスコアを2次元配列に変換
            const allScores = votes.map((vote) =>
                bands.map((band) => {
                    const score = vote.scores.find((s) => s.bandId === band.id);
                    return score ? score.score : 0;
                })
            );

            // 2. 各投票者の点数を調整
            const adjustedScores = allScores.map((scores, voterIndex) => {
                const voterBandIndex = bands.findIndex(
                    (band) => band.id === votes[voterIndex].voterBandId
                );
                const variable = calculateVariable(scores, voterBandIndex);
                return adjustScores(scores, variable);
            });

            // 3. バンドごとの平均点を計算
            const averageScores = calculateBandScores(adjustedScores);
            const ranks = calculateRank(averageScores);

            // 4. バンドの情報を更新
            const calculatedBands = bands
                .map((band, index) => ({
                    ...band,
                    score: averageScores[index],
                    averageScore: averageScores[index],
                    rank: ranks[index] + 1,
                }))
                .sort((a, b) => b.averageScore - a.averageScore);

            setBands(calculatedBands);
            hasCalculated.current = true;
        }
    }, [bands, votes, isEditing, setBands]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            順位
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            バンド名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            平均点
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bands.map((band) => (
                        <tr key={band.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {band.rank}位
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={band.name}
                                        onChange={(e) => {
                                            const updatedBands = bands.map((b) =>
                                                b.id === band.id
                                                    ? { ...b, name: e.target.value }
                                                    : b
                                            );
                                            setBands(updatedBands);
                                        }}
                                        className="w-full px-2 py-1 border rounded"
                                    />
                                ) : (
                                    band.name
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {band.averageScore ? band.averageScore.toFixed(2) : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BandTable;
