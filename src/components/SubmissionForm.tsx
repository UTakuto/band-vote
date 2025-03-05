"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserNameBox from "./UserNameBox";
import BandList from "./BandList";
import BandScoreList from "./BandScoreList";
import { Band } from "@/types/types";
import { handleSubmit as submitHandler } from "@/utils/handleSubmits";

export default function SubmissionForm() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [bands, setBands] = useState<Band[]>([]);
    const [selectedBands, setSelectedBands] = useState<{ [key: string]: boolean }>({});
    const [scores, setScores] = useState<{ [key: string]: number }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBands = async () => {
            const response = await fetch("/admin/api/bands");
            const data = await response.json();
            if (data.bands) {
                setBands(data.bands);
                const initialSelectedBands = data.bands.reduce(
                    (acc: { [key: string]: boolean }, band: Band) => {
                        acc[band.id] = false;
                        return acc;
                    },
                    {}
                );
                setSelectedBands(initialSelectedBands);
            }
        };
        fetchBands();
    }, []);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = event.target;
        setSelectedBands((prevSelectedBands) => ({
            ...prevSelectedBands,
            [id]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = {
                name: userName,
                band: Object.entries(selectedBands).find(([isSelected]) => isSelected)?.[0] || "",
                scores: Object.entries(scores)
                    .filter(([, score]) => score > 0)
                    .map(([bandId, score]) => ({
                        band: bandId,
                        score: score,
                    })),
            };

            await submitHandler(e, formData, setError, router, bands);
        } catch (err) {
            console.error("投票エラー:", err);
            setError("投票に失敗しました。時間をおいて再度お試しください。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-[300px] sm:w-[500px] h-auto m-auto mt-8 border border-solid border-1 rounded-md bg-[#fefefe] drop-shadow-[0_0_8px_rgba(226,226,226,0.9)] py-10 flex flex-col items-center justify-center dark:drop-shadow-[0_0_8px_rgba(198,198,198,0.2)] dark:bg-[#212121] dark:border-[#212121] dark:text-[#fefefe]">
            <h1 className="text-bold">バンド投票フォーム</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form
                onSubmit={handleSubmit}
                className="w-[250px] sm:w-[450px] max-w-lg flex flex-col justify-center items-center py-4"
            >
                <UserNameBox value={userName} onChange={setUserName} />
                <div className="w-full h-[1px] mb-5 border border-gray-200 rounded-md dark:border-zinc-700" />

                <BandList
                    bands={bands}
                    selectedBands={selectedBands}
                    onCheckboxChange={handleCheckboxChange}
                    checkboxName="bandSelection"
                />

                <div className="w-full h-[1px] mb-5 border border-gray-200 rounded-md dark:border-zinc-700" />

                <BandScoreList
                    bands={bands}
                    selectedBands={selectedBands}
                    onScoresChange={setScores}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-[120px] sm:w-[180px] bg-gray-700 text-[#fefefe] py-2 rounded-md 
                        transition-all duration-300 ease-in-out transform hover:bg-gray-600 hover:shadow-lg mt-4
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "投票中..." : "投票"}
                </button>
            </form>
        </div>
    );
}
