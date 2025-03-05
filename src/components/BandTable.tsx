import React, { useEffect } from "react";
import { Band, Vote } from "@/types/types";
import { calculateVariable, adjustScores, calculateBandScores, calculateRank } from "@/lib/scoring";

interface BandTableProps {
    bands: Band[];
    votes: Vote[]; // 投票データを受け取るように追加
    isEditing: boolean;
    setBands: React.Dispatch<React.SetStateAction<Band[]>>;
}

const BandTable: React.FC<BandTableProps> = ({ bands, votes, isEditing, setBands }) => {
    useEffect(() => {
        if (votes.length === 0 || bands.length === 0) return;

        // 1. 全投票者のスコアを2次元配列に変換
        const allScores = votes.map((vote) => {
            return bands.map((band) => {
                const score = vote.scores.find((s) => s.bandId === band.id);
                return score ? score.score : 0;
            });
        });

        // 2. 各投票者の点数を調整
        const adjustedScores = allScores.map((voterScores, index) => {
            const voterBandIndex = bands.findIndex((band) => band.id === votes[index].voterBandId);
            const variable = calculateVariable(voterScores, voterBandIndex);
            return adjustScores(voterScores, variable);
        });

        // 3. バンドごとの平均点を計算
        const averageScores = calculateBandScores(adjustedScores);

        // 4. 順位を計算
        const ranks = calculateRank(averageScores);

        // 5. バンドの情報を更新
        const updatedBands = bands.map((band, index) => ({
            ...band,
            score: averageScores[index],
            averageScore: averageScores[index],
            rank: ranks[index],
        }));

        // 6. 平均点でソート
        const sortedBands = [...updatedBands].sort((a, b) => b.averageScore - a.averageScore);
        setBands(sortedBands);
    }, [votes, bands, setBands]);

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
                            合計点
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            平均点
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[#fefefe] divide-y divide-gray-200">
                    {bands.map((band) => (
                        <tr key={band.id}>
                            <td className="px-6 py-4 [#fefefe]space-nowrap text-sm font-medium text-gray-900">
                                {band.rank}位
                            </td>
                            <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={band.name}
                                        onChange={(e) => {
                                            const newBands = bands.map((b) =>
                                                b.id === band.id
                                                    ? {
                                                          ...b,
                                                          name: e.target.value,
                                                      }
                                                    : b
                                            );
                                            setBands(newBands);
                                        }}
                                        className="border rounded px-2 py-1"
                                    />
                                ) : (
                                    band.name
                                )}
                            </td>
                            <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                {(band.score !== undefined ? band.score : 0).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                {(band.averageScore !== undefined ? band.averageScore : 0).toFixed(
                                    1
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BandTable;
