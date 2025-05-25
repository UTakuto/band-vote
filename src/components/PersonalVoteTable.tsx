import React, { useEffect, useRef } from "react";
import { BandTableProps } from "@/types/types";
import { calculateVariable } from "@/lib/scoring";

const PersonalVoteTable: React.FC<BandTableProps> = ({ bands, votes, isEditing, setBands }) => {
    const hasCalculated = useRef(false);

    // 投票者を名前順でソートする
    const sortedVotes = [...votes].sort((a, b) => {
        const nameA = a.userName || `投票者${votes.indexOf(a) + 1}`;
        const nameB = b.userName || `投票者${votes.indexOf(b) + 1}`;

        // 数値を含む文字列のための自然な順序でのソート
        return nameA
            .replace(/(\d+)/g, (n) => n.padStart(10, "0"))
            .localeCompare(
                nameB.replace(/(\d+)/g, (n) => n.padStart(10, "0")),
                "ja"
            );
    });

    useEffect(() => {
        if (!hasCalculated.current && !isEditing && votes.length > 0 && bands.length > 0) {
            console.log("========== 個人ごとの投票データ集計開始 ==========");
            console.log("集計データ:");
            console.log("- バンド数:", bands.length);
            console.log("- 投票数:", votes.length);

            // 個人ごとの補正値を計算
            const variables = votes.map((vote) => {
                const bandIds = bands.map((band) => band.id);
                const scores = bandIds.map((id) => {
                    const score = vote.scores.find((s) => s.bandId === id);
                    return score ? score.score : 0;
                });

                return calculateVariable(scores, vote.voterBandId, bandIds);
            });

            // 個人ごとの投票データを表示用に整形
            const personalResults = votes.map((vote, voteIndex) => {
                const scores = bands.map((band) => {
                    const score = vote.scores.find((s) => s.bandId === band.id);
                    return score ? score.score : 0;
                });

                return {
                    voter: vote.userName || `投票者${voteIndex + 1}`,
                    scores: scores,
                    variable: variables[voteIndex],
                };
            });

            // 結果をログ出力
            console.log("========== 個人ごとの投票データ ==========");
            console.table(personalResults);
            console.log("============================");

            hasCalculated.current = true;
        }
    }, [bands, votes, isEditing, setBands]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            投票者
                        </th>
                        {bands.map((band) => (
                            <th
                                key={band.id}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {band.name}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            補正値
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedVotes.map((vote, voteIndex) => {
                        const scores = bands.map((band) => {
                            const score = vote.scores.find((s) => s.bandId === band.id);
                            return score ? score.score : 0;
                        });
                        const bandIds = bands.map((band) => band.id);
                        const variable = calculateVariable(scores, vote.voterBandId, bandIds);

                        return (
                            <tr key={voteIndex}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {vote.userName || `投票者${voteIndex + 1}`}
                                </td>
                                {scores.map((score, index) => (
                                    <td
                                        key={index}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {score}
                                    </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {variable.toFixed(6)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PersonalVoteTable;
