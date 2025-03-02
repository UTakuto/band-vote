"use client";

import { useState, useEffect } from "react";
import BandTable from "@/components/BandTable";
import BandForm from "@/components/BandForm";

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
                    <BandTable
                        bands={bands}
                        isEditing={isEditing}
                        setBands={setBands}
                    />

                    {/* バンド登録フォーム */}
                    <div className="mt-8">
                        <BandForm
                            addBand={(newBand) =>
                                setBands((prevBands) => [...prevBands, newBand])
                            }
                        />
                    </div>

                    {/* 操作パネル */}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between space-x-4">
                            <div className="flex justify-end">
                                <div>
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleBandUpdate}
                                                className="mr-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                                            >
                                                保存
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setIsEditing(false)
                                                }
                                                className="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                                            >
                                                キャンセル
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mr-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                                        >
                                            バンド情報編集
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
