import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
            const bandsRef = collection(db, "bands");
            const newBand = {
                name: name.trim(),
                score: 0,
                averageScore: 0,
                rank: 0,
                createdAt: new Date().toISOString(),
            };

            console.log("Adding new band:", newBand);
            const docRef = await addDoc(bandsRef, newBand);
            console.log("Document written with ID:", docRef.id);

            addBand({ ...newBand, id: docRef.id });
            setName("");
        } catch (error) {
            console.error("Error adding band:", error);
            alert(`バンドの追加に失敗しました。エラー: ${error}`);
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
