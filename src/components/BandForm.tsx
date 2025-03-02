import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Band {
    id: string;
    name: string;
    score: number;
    averageScore: number;
    rank: number;
}

interface BandFormProps {
    addBand: (band: Band) => void;
}

const BandForm: React.FC<BandFormProps> = ({ addBand }) => {
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("バンド名を入力してください");
            return;
        }

        try {
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
            console.log(error);
            alert("バンドの追加に失敗しました。");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="バンド名"
                className="border rounded px-2 py-1"
                required
            />
            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
                登録
            </button>
        </form>
    );
};

export default BandForm;
