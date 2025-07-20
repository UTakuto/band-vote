"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/header";
import Loading from "@/components/Loading";
import { Band } from "@/types/types";

export default function Page() {
    const { isAdmin, loading } = useAdmin();
    const [bands, setBands] = useState<Band[]>([]);

    useEffect(() => {
        if (isAdmin) {
            fetchBands();
        }
    }, [isAdmin]);

    // バンド一覧取得のfetchパスも修正
    const fetchBands = async () => {
        const response = await fetch("/admin/api/bands"); // パスを修正
        const data = await response.json();
        if (data.bands) {
            setBands(data.bands);
        }
    };

    const handleNameChange = (bandId: string, newName: string) => {
        setBands((prevBands) =>
            prevBands.map((band) => (band.id === bandId ? { ...band, name: newName } : band))
        );
    };

    const handleDelete = async (bandId: string) => {
        // 確認ダイアログを表示
        const isConfirmed = window.confirm(
            "このバンドを削除してもよろしいですか？\nこの操作は取り消せません。"
        );

        if (isConfirmed) {
            try {
                const response = await fetch(`/admin/api/bands/${bandId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "バンドの削除に失敗しました");
                }

                // 成功したら画面を更新
                setBands((prevBands) => prevBands.filter((band) => band.id !== bandId));
                alert("バンドを削除しました");
            } catch (error) {
                console.error("削除処理でエラー:", error);
                alert(error instanceof Error ? error.message : "バンドの削除に失敗しました");
            }
        }
    };

    const handleSave = async () => {
        const response = await fetch("/admin/api/bands", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bands }),
        });

        if (response.ok) {
            alert("バンド情報を保存しました");
            await fetchBands();
        } else {
            alert("保存に失敗しました");
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">バンド情報編集</h1>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            保存
                        </button>
                    </div>
                    <div className="space-y-4">
                        {bands.map((band) => (
                            <div
                                key={band.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <input
                                    type="text"
                                    value={band.name}
                                    onChange={(e) => handleNameChange(band.id, e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 mr-4"
                                />
                                <button
                                    onClick={() => handleDelete(band.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                >
                                    削除
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
