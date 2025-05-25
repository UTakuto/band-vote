"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/header";
import Loading from "@/components/Loading";
import PersonalVoteTable from "@/components/PersonalVoteTable";
import type { Vote, Band } from "@/types/types";

export default function PersonalVotesPage() {
    const { isAdmin, loading } = useAdmin();
    const [votes, setVotes] = useState<Vote[]>([]);
    const [bands, setBands] = useState<Band[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin]);

    const fetchData = async () => {
        try {
            // バンドと投票データを並列で取得
            const [votesRes, bandsRes] = await Promise.all([
                fetch("/admin/api/votes"),
                fetch("/admin/api/bands"),
            ]);

            const votesData = await votesRes.json();
            const bandsData = await bandsRes.json();

            if (votesData.votes) setVotes(votesData.votes);
            if (bandsData.bands) setBands(bandsData.bands);
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">個人補正値</h1>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <PersonalVoteTable
                            bands={bands}
                            votes={votes}
                            isEditing={false}
                            setBands={() => {}}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
