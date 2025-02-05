"use client";
import React, { useEffect, useState } from "react";
import UserNameBox from "./UserNameBox";
import BandList from "./BandList";
import BandScoreList from "./BandScoreList";

interface Band {
    id: string;
    name: string;
    score: number;
    averageScore: number;
    rank: number;
}

export default function SubmissionForm() {
    const [bands, setBands] = useState<Band[]>([]);
    const [selectedBands, setSelectedBands] = useState<{
        [key: string]: boolean;
    }>({});

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

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { id, checked } = event.target;
        setSelectedBands((prevSelectedBands) => ({
            ...prevSelectedBands,
            [id]: checked,
        }));
    };

    return (
        <div className="w-[300px] sm:w-[500px] h-auto m-auto border border-solid border-1 rounded-md bg-[#fefefe] drop-shadow-[0_0_8px_rgba(226,226,226,0.9)] py-10 flex flex-col items-center justify-center dark:drop-shadow-[0_0_8px_rgba(198,198,198,0.2)] dark:bg-[#212121] dark:border-[#212121] dark:text-[#fefefe]">
            <h1 className="text-bold">バンド投票フォーム</h1>
            <form className="w-[250px] sm:w-[450px] max-w-lg flex flex-col justify-center items-center py-4">
                <UserNameBox />
                <div className="w-full h-[1px] mb-5 border border-gray-200 rounded-md dark:border-zinc-700"></div>

                <BandList
                    bands={bands}
                    selectedBands={selectedBands}
                    onCheckboxChange={handleCheckboxChange}
                    checkboxName="bandSelection"
                />

                <div className="w-full h-[1px] mb-5 border border-gray-200 rounded-md dark:border-zinc-700"></div>

                <BandScoreList bands={bands} />
            </form>

            <button
                type="submit"
                className="w-[120px] sm:w-[180px] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mt-4"
            >
                投票
            </button>
        </div>
    );
}
