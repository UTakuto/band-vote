"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/header";
import Loading from "@/components/Loading";
import VoteHistoryTable from "@/components/VoteHistoryTable";
import type { Vote } from "@/types/types";

export default function VotesPage() {
    const { isAdmin, loading } = useAdmin();
    const [votes, setVotes] = useState<Vote[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAdmin) {
            fetchVotes();
        }
    }, [isAdmin]);

    const fetchVotes = async () => {
        try {
            const response = await fetch("/admin/api/votes");
            const data = await response.json();
            if (data.votes) {
                // 投票時刻でソート（新しい順）
                const sortedVotes = [...data.votes].sort((a, b) => {
                    // createdAtがstring型の場合はDate型に変換
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime(); // 降順（新しい順）
                });
                setVotes(sortedVotes);
            }
        } catch (error) {
            console.error("投票履歴の取得に失敗しました:", error);
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
                    {isLoading ? <Loading /> : <VoteHistoryTable votes={votes} />}
                </div>
            </main>
        </div>
    );
}
