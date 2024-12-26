"use client";
import React from "react";
import UserNameBox from "./UserNameBox";
import BandList from "./BandList";
import BandScoreList from "./BandScoreList";

export default function SubmissionForm() {
    return (
        <div className="w-[300px] h-auto m-auto border border-solid border-1 rounded-md bg-[#fefefe] drop-shadow-[0_0_8px_rgba(226,226,226,0.9)] py-10 flex flex-col items-center justify-center dark:drop-shadow-[0_0_8px_rgba(198,198,198,0.2)] dark:bg-[#212121] dark:border-[#212121] dark:text-[#fefefe]">
            <h1 className="text-bold">バンド投票フォーム</h1>
            <form className="w-[250px] max-w-lg flex flex-col justify-center items-center py-4">
                <UserNameBox />
                <div className="w-full h-[1px] mb-5 border border-gray-200 rounded-md dark:border-zinc-700"></div>

                <BandList />
                <div className="w-full h-[1px] mb-5 border border-gray-200 rounded-md dark:border-zinc-700"></div>

                <BandScoreList />
            </form>

            <button
                type="submit"
                className="w-[120px] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mt-4"
            >
                投票
            </button>
        </div>
    );
}
