import React, { useEffect, useState } from "react";
import { BandTableProps } from "@/types/types";
import { calculateAdjustedScores, calculateBandTotalAdjustedScores } from "@/lib/scoring";

const BandTable: React.FC<BandTableProps> = ({ bands, votes }) => {
    const [bandResults, setBandResults] = useState<
        { bandId: string; bandName: string; total: number; average: number; variables: number[] }[]
    >([]);

    useEffect(() => {
        if (votes.length > 0 && bands.length > 0) {
            console.log("========== バンドごとの補正後スコア集計 ==========");
            const adjusted = calculateAdjustedScores(votes, bands);
            const bandStats = calculateBandTotalAdjustedScores(adjusted, votes, bands);

            // Add individual variables per band
            const bandResultsWithVariables = bandStats.map((bandStat, bandIndex) => {
                const variables = adjusted
                    .map((adj, voterIndex) => {
                        const vote = votes[voterIndex];
                        const originalScore = vote.scores.find(
                            (s) => s.bandId === bands[bandIndex].id
                        )?.score;
                        return originalScore !== undefined && originalScore > 0
                            ? adj.variable
                            : null;
                    })
                    .filter((v): v is number => v !== null);
                return {
                    ...bandStat,
                    variables,
                };
            });

            console.table(bandResultsWithVariables);
            bandResultsWithVariables.forEach((band) => {
                console.log(`--- ${band.bandName} ---`);
                console.log(`合計点: ${band.total}`);
                console.log(`補正値数: ${band.variables.length}`);
                console.log(`平均点: ${(band.total / band.variables.length).toFixed(4)}`);
            });
            setBandResults(bandResultsWithVariables);
        }
    }, [votes, bands]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            バンド名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            補正後合計点
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            平均点
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            個別補正値（変数）
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bandResults.map((band) => (
                        <tr key={band.bandId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {band.bandName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {band.total.toFixed(6)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {band.average.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {band.variables.join(", ")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BandTable;
