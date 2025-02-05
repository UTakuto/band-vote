"use client";

import { useState, useEffect } from "react";

interface Band {
    id: string;
    name: string;
    score: number;
    averageScore: number;
    rank: number;
}

export default function ResultsPage() {
    const [isVotingOpen, setIsVotingOpen] = useState(true);
    const [bands, setBands] = useState<Band[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchBands();
    }, []);

    const fetchBands = async () => {
        const response = await fetch("/admin/api/bands");
        const data = await response.json();
        if (data.bands) {
            setBands(data.bands);
        }
    };

    const handleBandUpdate = async () => {
        const response = await fetch("/admin/api/bands", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bands }),
        });

        if (response.ok) {
            setIsEditing(false);
            await fetchBands();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* ヘッダー部分 */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            採点結果管理画面
                        </h1>
                        <div className="space-x-4">
                            <button
                                onClick={() => setIsVotingOpen(!isVotingOpen)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    isVotingOpen
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                            >
                                {isVotingOpen
                                    ? "投票を締め切る"
                                    : "投票を再開する"}
                            </button>
                            <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700">
                                結果をリセット
                            </button>
                        </div>
                    </div>

                    {/* 集計結果テーブル */}
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
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bands.map((band) => (
                                    <tr key={band.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {band.rank}位
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={band.name}
                                                    onChange={(e) => {
                                                        const newBands =
                                                            bands.map((b) =>
                                                                b.id === band.id
                                                                    ? {
                                                                          ...b,
                                                                          name: e
                                                                              .target
                                                                              .value,
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {band.score.toFixed(1)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {band.averageScore.toFixed(1)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 操作パネル */}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-end space-x-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleBandUpdate}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                                    >
                                        保存
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                                    >
                                        キャンセル
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    バンド情報編集
                                </button>
                            )}
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
                                CSVエクスポート
                            </button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
                                バンド登録
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
