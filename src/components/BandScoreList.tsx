"use client";
import { useState } from "react";

export default function BandScoreList() {
    const [value, setValue] = useState(0);

    const handleIncrement = () => {
        setValue((prevValue) => prevValue + 1);
    };

    const handleDecrement = () => {
        setValue((prevValue) => (prevValue > 0 ? prevValue - 1 : 0));
    };

    return (
        <div className="w-[250px] sm:w-[350px] mb-5">
            <label
                htmlFor="band"
                className="block text-sm font-medium text-gray-700 dark:text-[#fefefe]"
            >
                バンドの点数を記入してください
            </label>
            <div
                className="py-2 px-3 mt-1 p-2 border border-gray-300 rounded-md dark:text-[#212121] dark:bg-[#fefefe]"
                data-hs-input-number=""
            >
                <div className="w-full flex justify-between items-center gap-x-3">
                    <div>
                        <span className="block font-medium text-sm text-gray-800 dark:text-[#212121]">
                            SEKAI NO OWARI
                        </span>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                        <button
                            type="button"
                            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-[#fefefe] text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none  dark:border-gray-300"
                            tabIndex={-1}
                            aria-label="Decrease"
                            data-hs-input-number-decrement=""
                            onClick={handleDecrement}
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
                            aria-roledescription="Number field"
                            value={value}
                            readOnly
                            data-hs-input-number-input=""
                        />
                        <button
                            type="button"
                            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-[#fefefe] text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none  dark:border-gray-300"
                            tabIndex={-1}
                            aria-label="Increase"
                            data-hs-input-number-increment=""
                            onClick={handleIncrement}
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
            </div>
        </div>
    );
}
