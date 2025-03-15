import React, { useEffect, useRef } from "react";
import { BandTableProps } from "@/types/types";

const BandTable: React.FC<BandTableProps> = ({ bands, votes, isEditing, setBands }) => {
    const hasCalculated = useRef(false);

    useEffect(() => {
        if (!hasCalculated.current && !isEditing && votes.length > 0 && bands.length > 0) {
            // バンドごとの平均点を計算
            const averageScores = bands.map((band) => {
                const bandVotes = votes.flatMap((vote) =>
                    vote.scores.filter((score) => score.bandId === band.id)
                );
                if (bandVotes.length === 0) return 0;
                const total = bandVotes.reduce((sum, score) => sum + score.score, 0);
                return Number((total / bandVotes.length).toFixed(2));
            });

            // 順位を計算
            const sortedScores = [...averageScores].sort((a, b) => b - a);
            const ranks = averageScores.map((score) => sortedScores.indexOf(score) + 1);

            // バンドの情報を更新
            const calculatedBands = bands
                .map((band, index) => ({
                    ...band,
                    averageScore: averageScores[index],
                    rank: ranks[index],
                }))
                .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));

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
