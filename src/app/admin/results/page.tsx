"use client";
import { useState, useEffect } from "react";
import BandTable from "@/components/BandTable";
import BandForm from "@/components/BandForm";
import VoteHistoryTable from "@/components/VoteHistoryTable";
import { Band, Vote } from "@/types/types";

export default function ResultsPage() {
    const [isVotingOpen, setIsVotingOpen] = useState(true);
    const [bands, setBands] = useState<Band[]>([]);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showBandForm, setShowBandForm] = useState(false);

    useEffect(() => {
        fetchBands();
        fetchVotes();
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

    const fetchVotes = async () => {
        try {
            const response = await fetch("/admin/api/votes");
            const data = await response.json();
            if (data.votes) {
                setVotes(data.votes);
            }
        } catch (error) {
            console.error("投票履歴の取得に失敗しました:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-[#fefefe] rounded-lg shadow-lg p-6">
                    {/* ヘッダー部分 */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">採点結果管理画面</h1>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setIsVotingOpen(!isVotingOpen)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    isVotingOpen
                                        ? "bg-red-600 text-[#fefefe] hover:bg-red-700"
                                        : "bg-green-600 text-[#fefefe] hover:bg-green-700"
                                }`}
                            >
                                {isVotingOpen ? "投票を締め切る" : "投票を再開する"}
                            </button>
                            <button className="w-[120px] text-[14px] bg-gray-700 text-[#fefefe] py-2 rounded-md transition-all duration-300 ease-in-out transform hover:bg-gray-600 hover:shadow-lg">
                                結果をリセット
                            </button>
                        </div>
                    </div>

                    {/* 集計結果テーブル */}
                    <BandTable
                        bands={bands}
                        votes={votes}
                        isEditing={isEditing}
                        setBands={setBands}
                    />

                    {/* 操作パネル */}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between space-x-4">
                            <div className="flex justify-end">
                                <div className="flex justify-center items-center space-x-4">
                                    {/* バンド登録フォーム */}
                                    <div className="flex justify-center items-center space-x-4">
                                        {showBandForm && (
                                            <BandForm
                                                addBand={(newBand) =>
                                                    setBands((prevBands) => [...prevBands, newBand])
                                                }
                                            />
                                        )}
                                        <button
                                            onClick={() => setShowBandForm(!showBandForm)}
                                            className="w-[120px] sm:w-[180px] bg-gray-700 text-[#fefefe] py-2 rounded-md transition-all duration-300 ease-in-out transform hover:bg-gray-600 hover:shadow-lg"
                                        >
                                            {showBandForm ? "フォームを閉じる" : "バンドを追加"}
                                        </button>
                                    </div>
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleBandUpdate}
                                                className="mr-2 px-4 py-2 bg-green-600 text-[#fefefe] rounded-md text-sm font-medium hover:bg-green-700"
                                            >
                                                保存
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="mr-2 px-4 py-2 bg-gray-600 text-[#fefefe] rounded-md text-sm font-medium hover:bg-gray-700"
                                            >
                                                キャンセル
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-[120px] sm:w-[180px] h-[40px] bg-gray-700 text-[#fefefe] rounded-md transition-all duration-300 ease-in-out transform hover:bg-gray-600 hover:shadow-lg"
                                        >
                                            バンド情報編集
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 投票履歴テーブル */}
                    <VoteHistoryTable votes={votes} />
                </div>
            </div>
        </div>
    );
}
