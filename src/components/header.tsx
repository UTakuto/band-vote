"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-gray-800 text-[#fefefe] mb-[30px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold">投票管理</h1>
                        </div>
                        <nav className="ml-6 flex items-center space-x-4">
                            <Link
                                href="/admin/results"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive("/admin/results")
                                        ? "bg-gray-900 text-[#fefefe]"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-[#fefefe]"
                                }`}
                            >
                                集計結果
                            </Link>
                            <Link
                                href="/admin/votes"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive("/admin/votes")
                                        ? "bg-gray-900 text-[#fefefe]"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-[#fefefe]"
                                }`}
                            >
                                投票履歴
                            </Link>
                            <Link
                                href="/admin/personal"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive("/admin/personal")
                                        ? "bg-gray-900 text-[#fefefe]"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-[#fefefe]"
                                }`}
                            >
                                個人補正値
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
