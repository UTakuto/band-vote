"use client";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import VoteHistoryTable from "@/components/VoteHistoryTable";
import { Vote } from "@/types/types";

export default function VotesPage() {
    const [votes, setVotes] = useState<Vote[]>([]);

    useEffect(() => {
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

        fetchVotes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fefefe] rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">投票履歴一覧</h1>
                    <VoteHistoryTable votes={votes} />
                </div>
            </div>
        </div>
    );
}
