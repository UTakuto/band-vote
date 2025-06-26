"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/header";
import Loading from "@/components/Loading";
import VoteHistoryTable from "@/components/VoteHistoryTable";
import type { Vote } from "@/types/types";
import { Timestamp } from "firebase/firestore";

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
                // Firestoreのタイムスタンプを適切に処理
                const sortedVotes = [...data.votes].sort((a, b) => {
                    let timeA: number;
                    let timeB: number;

                    // タイムスタンプの処理
                    if (
                        a.createdAt &&
                        typeof a.createdAt === "object" &&
                        "seconds" in a.createdAt
                    ) {
                        timeA = (a.createdAt as Timestamp).seconds * 1000;
                    } else {
                        timeA = new Date(a.createdAt).getTime();
                    }

                    if (
                        b.createdAt &&
                        typeof b.createdAt === "object" &&
                        "seconds" in b.createdAt
                    ) {
                        timeB = (b.createdAt as Timestamp).seconds * 1000;
                    } else {
                        timeB = new Date(b.createdAt).getTime();
                    }

                    // 新しい順（降順）にソート
                    return timeB - timeA;
                });

                console.log(
                    "Sorted votes:",
                    sortedVotes.map((v) => ({
                        userName: v.userName,
                        createdAt: v.createdAt,
                    }))
                );

                setVotes(sortedVotes);
            }
        } catch (error) {
            console.error("投票履歴の取得に失敗しました:", error);
            console.error("詳細なエラー:", {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
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
                    <h1 className="text-2xl font-bold mb-6">投票履歴</h1>
                    {isLoading ? <Loading /> : <VoteHistoryTable votes={votes} />}
                </div>
            </main>
        </div>
    );
}
