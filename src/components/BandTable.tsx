import React, { useEffect, useState } from "react";
import { BandTableProps } from "@/types/types";
import { calculateAdjustedScores, calculateBandTotalAdjustedScores } from "@/lib/scoring";

const BandTable: React.FC<BandTableProps> = ({ bands, votes }) => {
    const [bandResults, setBandResults] = useState<
        {
            bandId: string;
            bandName: string;
            total: number;
            average: number;
            variables: number[];
            rank: number;
            createdAt: string;
        }[]
    >([]);

    useEffect(() => {
        if (bands.length > 0) {
            if (votes.length > 0) {
                // 投票データがある場合は平均点で並び替え
                console.log("========== バンドごとの補正後スコア集計 ==========");
                const adjusted = calculateAdjustedScores(votes, bands);
                const bandStats = calculateBandTotalAdjustedScores(adjusted, votes, bands);

                const bandResultsWithVariables = bandStats
                    .map((bandStat) => {
                        const band = bands.find((b) => b.id === bandStat.bandId);
                        if (!band) return null;

                        const variables = votes
                            .map((vote) => {
                                const scoreObj = vote.scores.find((s) => s.bandId === band.id);
                                return scoreObj && scoreObj.score > 0 ? scoreObj.score : null;
                            })
                            .filter((v): v is number => v !== null);

                        return {
                            bandId: band.id,
                            bandName: band.name,
                            total: bandStat.total,
                            average: bandStat.average,
                            variables,
                            rank: 0,
                            createdAt: band.createdAt.toString(),
                        };
                    })
                    .filter((result): result is NonNullable<typeof result> => result !== null);

                // 平均点で並び替え
                const sortedResults = [...bandResultsWithVariables]
                    .sort((a, b) => b.average - a.average)
                    .map((result, index) => ({
                        ...result,
                        rank: index + 1,
                    }));

                setBandResults(sortedResults);
            } else {
                // 投票データがない場合は作成順で並び替え
                const initialResults = bands
                    .sort((a, b) => {
                        const dateA = new Date(a.createdAt);
                        const dateB = new Date(b.createdAt);
                        return dateA.getTime() - dateB.getTime();
                    })
                    .map((band, index) => ({
                        bandId: band.id,
                        bandName: band.name,
                        total: 0,
                        average: 0,
                        variables: [],
                        rank: index + 1,
                        createdAt: band.createdAt.toString(),
                    }));
                setBandResults(initialResults);
            }
        }
    }, [votes, bands]);

    // 表示用のデータを作成
    const displayResults =
        votes.length > 0
            ? [...bandResults].sort((a, b) => b.average - a.average)
            : [...bandResults].sort((a, b) => {
                  const dateA = new Date(a.createdAt);
                  const dateB = new Date(b.createdAt);
                  return dateA.getTime() - dateB.getTime();
              });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {votes.length > 0 ? "順位" : "No."}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            バンド名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {votes.length > 0 ? "平均点" : "仮順位"}
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {displayResults.map((band, index) => (
                        <tr key={band.bandId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {votes.length > 0 ? band.rank : index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {band.bandName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {votes.length > 0 ? band.average.toFixed(3) : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BandTable;
