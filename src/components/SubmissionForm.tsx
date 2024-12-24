import React from "react";
import BandCheckbox from "@/components/BandCheckbox";

export default function SubmissionForm() {
    return (
        <div className="w-[300px] h-auto m-auto border border-solid border-1 rounded-md bg-[#fefefe] drop-shadow-[0_0_8px_rgba(226,226,226,0.9)] py-10 flex flex-col items-center justify-center dark:drop-shadow-[0_0_8px_rgba(198,198,198,0.2)] dark:bg-[#212121] dark:border-[#212121] dark:text-[#fefefe]">
            <h1 className="text-bold">バンド投票フォーム</h1>
            <form className="w-[250px] max-w-lg flex flex-col justify-center items-center py-4">
                <div className="w-[250px] mb-5">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-[#fefefe]"
                    >
                        名前
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="OMU たろう"
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full dark:text-[#212121]"
                        required
                    />
                </div>

                <div className="w-[250px] mb-5">
                    <label
                        htmlFor="band"
                        className="block text-sm font-medium text-gray-700 dark:text-[#fefefe]"
                    >
                        出演バンド
                    </label>
                    <div className="w-full flex flex-col items-center justify-center">
                        <BandCheckbox
                            id="bordered-checkbox-1"
                            label="SEKAI NO OWARI"
                            name="bordered-checkbox"
                            value=""
                        />
                        <BandCheckbox
                            id="bordered-checkbox-2"
                            label="New Jeans"
                            name="bordered-checkbox"
                            value=""
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-[120px] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mt-4"
                >
                    投票
                </button>
            </form>
        </div>
    );
}
