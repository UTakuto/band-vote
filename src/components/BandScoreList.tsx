"use client";
import { useState, useEffect } from "react";
import { BandScoreListProps } from "@/types/types";

// Window オブジェクトの拡張
declare global {
    interface Window {
        validateBandScores?: () => boolean;
        resetBandScores?: () => void;
        isBandScoresValid?: () => boolean;
    }
}

const BandScoreList: React.FC<BandScoreListProps> = ({ bands, selectedBands, onScoresChange }) => {
    const [scores, setScores] = useState<{ [key: string]: number }>({});
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const maxScore = 10;

    // バンドを作成順でソート
    const sortedBands = [...bands].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA.getTime() - dateB.getTime();
    });
    // selectedBandsの変更を監視し、選択されたバンドのスコアを0にする
    useEffect(() => {
        const updatedScores = { ...scores };
        Object.entries(selectedBands).forEach(([bandId, isSelected]) => {
            if (isSelected) {
                updatedScores[bandId] = 0;
                setInputValues((prev) => ({
                    ...prev,
                    [bandId]: "0",
                }));
            }
        });
        setScores(updatedScores);
        onScoresChange(updatedScores);
    }, [selectedBands]);

    // バリデーション関数
    const validateAllScores = () => {
        // 出演していないバンドのみをチェック対象にし、1点未満のものをエラーとする
        const nonPerformingBands = sortedBands.filter((band) => !selectedBands[band.id]);
        const invalidScoreBands = nonPerformingBands.filter((band) => (scores[band.id] || 0) < 1);
        const valid = invalidScoreBands.length === 0;

        if (invalidScoreBands.length > 0) {
            setErrorMessage(
                `${invalidScoreBands
                    .map((band) => band.name)
                    .join(", ")} の点数を入力してください（1-${maxScore}点）`
            );
        } else {
            setErrorMessage("");
        }

        setIsValid(valid);
        return valid;
    };

    // バンドリストが変更されたときにスコアを初期化（初回のみ）
    useEffect(() => {
        const initialScores = bands.reduce(
            (acc, band) => ({
                ...acc,
                [band.id]: scores[band.id] !== undefined ? scores[band.id] : 0, // 既存の点数を保持
            }),
            {}
        );
        const initialInputValues = bands.reduce(
            (acc, band) => ({
                ...acc,
                [band.id]: inputValues[band.id] !== undefined ? inputValues[band.id] : "",
            }),
            {}
        );
        setScores(initialScores);
        setInputValues(initialInputValues);
    }, [bands]);

    // スコアまたは選択状態が変更されたときにバリデーションを実行
    useEffect(() => {
        if (Object.keys(scores).length > 0 && bands.length > 0) {
            validateAllScores();
            // 親コンポーネントにスコアのみを通知
            onScoresChange(scores);
        }
    }, [scores, selectedBands, bands]);

    // 投票ボタンが押された時に呼び出される関数（親コンポーネントから呼び出される）
    const validateScores = () => {
        return validateAllScores();
    };

    // スコアリセット関数
    const resetScores = () => {
        const resetScores = bands.reduce(
            (acc, band) => ({
                ...acc,
                [band.id]: 0,
            }),
            {}
        );
        const resetInputValues = bands.reduce(
            (acc, band) => ({
                ...acc,
                [band.id]: "",
            }),
            {}
        );

        setScores(resetScores);
        setInputValues(resetInputValues);
        setErrorMessage("");
        setIsValid(false);

        // 親コンポーネントにリセットされたスコアを通知
        onScoresChange(resetScores);
    };

    // validateScores関数を親コンポーネントに公開するための ref
    useEffect(() => {
        // validateScores関数を親コンポーネントからアクセス可能にする
        window.validateBandScores = validateScores;
        window.resetBandScores = resetScores;

        // isValidの状態も公開
        window.isBandScoresValid = () => isValid;

        return () => {
            // クリーンアップ
            delete window.validateBandScores;
            delete window.resetBandScores;
            delete window.isBandScoresValid;
        };
    }, [validateScores, resetScores, isValid]);

    const handleIncrement = (bandId: string) => {
        if (selectedBands[bandId]) return;
        setScores((prev) => {
            const currentScore = prev[bandId] || 0;
            if (currentScore >= maxScore) {
                return prev;
            }
            const newScore = currentScore + 1;
            setInputValues((prevInput) => ({
                ...prevInput,
                [bandId]: newScore.toString(),
            }));
            return {
                ...prev,
                [bandId]: newScore,
            };
        });
    };

    const handleDecrement = (bandId: string) => {
        if (selectedBands[bandId]) return;
        setScores((prev) => {
            const newScore = Math.max((prev[bandId] || 0) - 1, 0);
            setInputValues((prevInput) => ({
                ...prevInput,
                [bandId]: newScore === 0 ? "" : newScore.toString(),
            }));
            return {
                ...prev,
                [bandId]: newScore,
            };
        });
    };

    // 直接入力ハンドラー
    const handleDirectInput = (bandId: string, value: string) => {
        if (selectedBands[bandId]) return;

        // 入力値を保存
        setInputValues((prev) => ({
            ...prev,
            [bandId]: value,
        }));

        // 空文字の場合は0に設定
        if (value === "") {
            setScores((prev) => ({
                ...prev,
                [bandId]: 0,
            }));
            return;
        }

        const numValue = parseInt(value, 10);

        // 数値でない場合は無視
        if (isNaN(numValue)) return;

        // 範囲チェック（0-10）
        const clampedValue = Math.max(0, Math.min(maxScore, numValue));

        setScores((prev) => ({
            ...prev,
            [bandId]: clampedValue,
        }));

        // 範囲外の場合は正しい値に修正
        if (clampedValue !== numValue) {
            setInputValues((prev) => ({
                ...prev,
                [bandId]: clampedValue.toString(),
            }));
        }
    };

    const handleInputFocus = (bandId: string) => {
        // フォーカス時に0の場合は空文字にする
        if (scores[bandId] === 0) {
            setInputValues((prev) => ({
                ...prev,
                [bandId]: "",
            }));
        }
    };

    const handleInputBlur = (bandId: string) => {
        // ブラー時に空文字の場合は0を表示
        if (inputValues[bandId] === "") {
            setInputValues((prev) => ({
                ...prev,
                [bandId]: scores[bandId] === 0 ? "" : scores[bandId].toString(),
            }));
        }
    };

    return (
        <div className="w-[250px] sm:w-[350px] mb-5">
            <label
                htmlFor="band"
                className="block text-sm font-medium text-gray-700 dark:text-[#fefefe]"
            >
                バンドの点数を記入してください（1-{maxScore}点）
            </label>

            {/* エラーメッセージ表示 */}
            {errorMessage && (
                <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p className="text-sm font-medium">{errorMessage}</p>
                </div>
            )}

            <div className="pb-2 px-3 mt-1 p-2 border border-gray-300 rounded-md dark:text-[#212121] dark:bg-[#fefefe]">
                {sortedBands.map((band) => {
                    // 出演バンドとして選択されていない かつ 0点の場合のみエラー表示
                    const hasZeroScore = !selectedBands[band.id] && (scores[band.id] || 0) === 0;

                    return (
                        <div
                            key={band.id}
                            className={`w-full py-3 border-b border-gray-200 dark:border-gray-300 
                            ${selectedBands[band.id] ? "opacity-50" : ""} 
                            ${hasZeroScore ? "bg-red-50 border-red-200" : ""}`}
                        >
                            {/* 上段：バンド名とボタン */}
                            <div className="flex justify-between items-center gap-x-3">
                                <span
                                    className={`block font-medium text-sm text-gray-800 dark:text-[#212121] 
                                    ${hasZeroScore ? "text-red-600" : ""}`}
                                >
                                    {band.name}
                                    {hasZeroScore && <span className="text-red-500 ml-1">*</span>}
                                </span>
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
                                        className={`p-1 w-[30px] border border-gray-300 rounded text-gray-800 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-[#212121] 
                                        ${
                                            hasZeroScore
                                                ? "text-red-600 font-bold border-red-400"
                                                : ""
                                        }`}
                                        style={{ MozAppearance: "textfield" }}
                                        type="number"
                                        min="0"
                                        max={maxScore}
                                        value={inputValues[band.id] || ""}
                                        onChange={(e) => handleDirectInput(band.id, e.target.value)}
                                        onFocus={() => handleInputFocus(band.id)}
                                        onBlur={() => handleInputBlur(band.id)}
                                        disabled={selectedBands[band.id]}
                                        placeholder="0"
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

                            {/* 下段：スライダー */}
                            <div className="mt-2 w-full">
                                <input
                                    type="range"
                                    min="0"
                                    max={maxScore}
                                    value={scores[band.id] || 0}
                                    onChange={(e) => handleDirectInput(band.id, e.target.value)}
                                    disabled={selectedBands[band.id]}
                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    style={{
                                        background: `linear-gradient(to right, #3b82f6 ${
                                            (scores[band.id] || 0) * 10
                                        }%, #d1d5db ${(scores[band.id] || 0) * 10}%)`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BandScoreList;
