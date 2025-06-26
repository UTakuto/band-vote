"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/header";
import Loading from "@/components/Loading";
import type { Vote, Band } from "@/types/types";
import { calculateAdjustedScores, calculateBandTotalAdjustedScores } from "@/lib/scoring";

export default function TeamsPage() {
    const { isAdmin, loading } = useAdmin();
    const [votes, setVotes] = useState<Vote[]>([]);
    const [bands, setBands] = useState<Band[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bandResults, setBandResults] = useState<
        { bandId: string; bandName: string; total: number; average: number; variables: number[] }[]
    >([]);

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin]);

    useEffect(() => {
        if (votes.length > 0 && bands.length > 0) {
            console.log("========== バンドごとの補正後スコア集計 ==========");
            const adjusted = calculateAdjustedScores(votes, bands);
            const bandStats = calculateBandTotalAdjustedScores(adjusted, votes, bands);

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

    const fetchData = async () => {
        try {
            const [votesRes, bandsRes] = await Promise.all([
                fetch("/admin/api/votes"),
                fetch("/admin/api/bands"),
            ]);

            const votesData = await votesRes.json();
            const bandsData = await bandsRes.json();

            // バンドを作成順（createdAt）でソート
            if (bandsData.bands) {
                const sortedBands = [...bandsData.bands].sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateA.getTime() - dateB.getTime(); // 昇順（古い順）
                });
                setBands(sortedBands);
            }
            if (votesData.votes) setVotes(votesData.votes);
        } catch (error) {
            console.error("データの取得に失敗しました:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">チーム補正値</h1>
                    {isLoading ? (
                        <Loading />
                    ) : (
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
                    )}
                </div>
            </main>
        </div>
    );
}
