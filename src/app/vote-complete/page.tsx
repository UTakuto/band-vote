"use client";
import Link from "next/link";

export default function VoteCompletePage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-[#fefefe] p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4">投票完了</h1>
                <div className="flex justify-center">
                    <Link
                        href="/"
                        className="bg-gray-700 text-[#fefefe] px-6 py-2 rounded-md 
                            transition-all duration-300 ease-in-out transform 
                            hover:bg-gray-600 hover:shadow-lg"
                    >
                        トップページに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
