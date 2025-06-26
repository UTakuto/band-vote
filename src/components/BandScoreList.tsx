"use client";
import { useState, useEffect } from "react";
import { BandScoreListProps } from "@/types/types";

const BandScoreList: React.FC<BandScoreListProps> = ({ bands, selectedBands, onScoresChange }) => {
    const [scores, setScores] = useState<{ [key: string]: number }>({});
    const maxScore = 10;

    // バンドを作成順でソート
    const sortedBands = [...bands].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA.getTime() - dateB.getTime();
    });

    // バンドリストが変更されたときにスコアを初期化
    useEffect(() => {
        const initialScores = bands.reduce(
            (acc, band) => ({
                ...acc,
                [band.id]: selectedBands[band.id] ? 0 : scores[band.id] || 0,
            }),
            {}
        );
        setScores(initialScores);
    }, [bands, selectedBands, scores]);

    // selectedBandsが変更されたときにスコアをリセット
    useEffect(() => {
        setScores((prev) => {
            const newScores = { ...prev };
            // 選択されたバンドのスコアを0にリセット
            Object.entries(selectedBands).forEach(([bandId, isSelected]) => {
                if (isSelected) {
                    newScores[bandId] = 0;
                }
            });
            return newScores;
        });
    }, [selectedBands]);

    useEffect(() => {
        if (Object.keys(scores).length > 0) {
            onScoresChange(scores);
        }
    }, [scores, onScoresChange]);

    const handleIncrement = (bandId: string) => {
        if (selectedBands[bandId]) return;
        setScores((prev) => {
            const currentScore = prev[bandId] || 0;
            // 最大値のチェック
            if (currentScore >= maxScore) {
                return prev;
            }
            return {
                ...prev,
                [bandId]: currentScore + 1,
            };
        });
    };

    const handleDecrement = (bandId: string) => {
        if (selectedBands[bandId]) return;
        setScores((prev) => ({
            ...prev,
            [bandId]: Math.max((prev[bandId] || 0) - 1, 0),
        }));
    };

    return (
        <div className="w-[250px] sm:w-[350px] mb-5">
            <label
                htmlFor="band"
                className="block text-sm font-medium text-gray-700 dark:text-[#fefefe]"
            >
                バンドの点数を記入してください
            </label>
            <div className="pb-2 px-3 mt-1 p-2 border border-gray-300 rounded-md dark:text-[#212121] dark:bg-[#fefefe]">
                {sortedBands.map((band) => (
                    <div
                        key={band.id}
                        className={`w-full flex justify-between items-center gap-x-3 py-3 border-b border-gray-200 dark:border-gray-300 
                        ${selectedBands[band.id] ? "opacity-50" : ""}`}
                    >
                        <div>
                            <span className="block font-medium text-sm text-gray-800 dark:text-[#212121]">
                                {band.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1.5">
                            <button
                                type="button"
                                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-[#fefefe] text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:border-gray-300"
                                onClick={() => handleDecrement(band.id)}
                                disabled={selectedBands[band.id]}
                                aria-label="Decrease"
                            >
                                <svg
                                    className="shrink-0 size-3.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14"></path>
                                </svg>
                            </button>
                            <input
                                className="p-0 w-[30px] bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-[#212121]"
                                style={{ MozAppearance: "textfield" }}
                                type="number"
                                value={scores[band.id] || 0}
                                readOnly
                            />
                            <button
                                type="button"
                                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-[#fefefe] text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:border-gray-300"
                                onClick={() => handleIncrement(band.id)}
                                disabled={selectedBands[band.id]}
                                aria-label="Increase"
                            >
                                <svg
                                    className="shrink-0 size-3.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5v14"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BandScoreList;
