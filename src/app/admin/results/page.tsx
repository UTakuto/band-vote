"use client";
import { useState, useEffect } from "react";
import BandTable from "@/components/BandTable";
import BandForm from "@/components/BandForm";
import { Band, Vote } from "@/types/types";
import Header from "@/components/header";
import { useAdmin } from "@/hooks/useAdmin";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function ResultsPage() {
    const { isAdmin, loading } = useAdmin();
    const [isVotingOpen, setIsVotingOpen] = useState(true);
    const [bands, setBands] = useState<Band[]>([]);
    const [votes, setVotes] = useState<Vote[]>([]);
    // const [isEditing, setIsEditing] = useState(false);
    const [showBandForm, setShowBandForm] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            fetchBands();
            fetchVotes();
            fetchVotingStatus();
        }
    }, [isAdmin]);

    if (loading) {
        return <Loading />;
    }

    if (!isAdmin) {
        return null;
    }

    const fetchBands = async () => {
        const response = await fetch("/admin/api/bands");
        const data = await response.json();
        if (data.bands) {
            setBands(data.bands);
        }
    };

    // const handleBandUpdate = async () => {
    //     const response = await fetch("/admin/api/bands", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ bands }),
    //     });

    //     if (response.ok) {
    //         setIsEditing(false);
    //         await fetchBands();
    //     }
    // };

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

    const handleReset = async () => {
        // 確認ダイアログを表示
        const isConfirmed = window.confirm(
            "本当に全ての投票結果をリセットしますか？\nこの操作は取り消せません。"
        );

        if (isConfirmed) {
            try {
                // バンドと投票データを削除
                const response = await fetch("/admin/api/reset", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    // 成功したら画面を更新
                    setBands([]);
                    setVotes([]);
                    alert("投票結果をリセットしました。");
                } else {
                    throw new Error("リセットに失敗しました");
                }
            } catch (error) {
                console.error("リセット中にエラーが発生しました:", error);
                alert("リセットに失敗しました。");
            }
        }
    };

    // 投票状態を取得する関数を追加
    const fetchVotingStatus = async () => {
        try {
            const response = await fetch("/admin/api/votingStatus");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched voting status:", data); // デバッグ用
            setIsVotingOpen(data.isVotingOpen);
        } catch (error) {
            console.error("投票状態の取得に失敗しました:", error);
        }
    };

    const handleVotingStatusChange = async () => {
        try {
            const newStatus = !isVotingOpen;
            const response = await fetch("/admin/api/votingStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isVotingOpen: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setIsVotingOpen(newStatus);
                alert(newStatus ? "投票を再開しました" : "投票を締め切りました");
            }
        } catch (error) {
            console.error("投票状態の更新に失敗しました:", error);
            alert("投票状態の更新に失敗しました");
        }
    };

    const handleAddBand = async (newBand: Band) => {
        // バンドを追加
        setBands((prevBands) => [...prevBands, newBand]);
        // バンド一覧を再取得
        await fetchBands();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-7xl mx-auto">
                <div className="bg-[#fefefe] rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">採点結果管理画面</h1>
                        <div className="flex justify-center items-center space-x-4">
                            <Link
                                href="/admin/bandedit"
                                className="px-4 py-2 bg-gray-600 text-[#fefefe] rounded-md hover:bg-gray-700"
                            >
                                バンド情報編集
                            </Link>
                            <button
                                onClick={handleVotingStatusChange}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    isVotingOpen
                                        ? "bg-red-600 text-[#fefefe] hover:bg-red-700"
                                        : "bg-green-600 text-[#fefefe] hover:bg-green-700"
                                }`}
                            >
                                {isVotingOpen ? "投票を締め切る" : "投票を再開する"}
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-[120px] text-[14px] bg-gray-700 text-[#fefefe] py-2 rounded-md transition-all duration-300 ease-in-out transform hover:bg-gray-600 hover:shadow-lg"
                            >
                                結果をリセット
                            </button>
                        </div>
                    </div>

                    {/* 集計結果テーブル */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            {isVotingOpen ? "バンド一覧" : "最終結果"}
                        </h2>
                        <BandTable
                            bands={bands}
                            votes={votes}
                            isEditing={false} // 編集モードは無効化
                            setBands={setBands}
                            isVotingOpen={isVotingOpen}
                        />
                    </div>

                    {/* 操作パネル */}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between space-x-4">
                            <div className="flex justify-end">
                                <div className="flex justify-center items-center space-x-4">
                                    {/* バンド登録フォーム */}
                                    <div className="flex justify-center items-center space-x-4">
                                        {showBandForm && <BandForm addBand={handleAddBand} />}
                                        <button
                                            onClick={() => setShowBandForm(!showBandForm)}
                                            className="w-[120px] sm:w-[180px] bg-gray-700 text-[#fefefe] py-2 rounded-md transition-all duration-300 ease-in-out transform hover:bg-gray-600 hover:shadow-lg"
                                        >
                                            {showBandForm ? "フォームを閉じる" : "バンドを追加"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 投票履歴テーブル */}
                    {/* <VoteHistoryTable votes={votes} /> */}
                </div>
            </div>
        </div>
    );
}
