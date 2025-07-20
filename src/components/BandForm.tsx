import React, { useState } from "react";
import { Band } from "@/types/types";

interface BandFormProps {
    addBand: (band: Band) => void;
}

const BandForm: React.FC<BandFormProps> = ({ addBand }) => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!name.trim()) {
            alert("バンド名を入力してください");
            return;
        }

        try {
            setIsSubmitting(true);
            console.log("Firebase config:", {
                apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });

            // APIエンドポイント経由でバンドを追加
            const response = await fetch('/admin/api/bands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    order: Date.now(), // 作成順序を保持
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'バンドの追加に失敗しました');
            }

            const result = await response.json();
            console.log("Band added successfully:", result);

            if (result.band) {
                addBand(result.band);
            }
            setName("");
        } catch (error) {
            console.error("Error adding band:", error);
            console.error("Error details:", {
                message: error instanceof Error ? error.message : String(error),
                code:
                    error && typeof error === "object" && "code" in error
                        ? (error as { code: string }).code
                        : undefined,
                stack: error instanceof Error ? error.stack : undefined,
            });
            alert(
                `バンドの追加に失敗しました。エラー: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex justify-center items-center space-x-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="バンド名"
                className="border rounded h-[40px] px-3 w-[200px]"
                required
                disabled={isSubmitting}
            />
            <button
                type="submit"
                className="w-[60px] h-[40px] bg-gray-700 text-[#fefefe] rounded-md transition-all duration-300 ease-in-out transform hover:bg-gray-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
            >
                {isSubmitting ? "..." : "登録"}
            </button>
        </form>
    );
};

export default BandForm;
