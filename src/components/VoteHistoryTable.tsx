import { Vote } from "@/types/types";

export default function VoteHistoryTable({ votes }: { votes: Vote[] }) {
    const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
        return new Date(timestamp.seconds * 1000).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">投票履歴</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                投票者
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                所属バンド
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                投票内容
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                投票日時
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#fefefe] divide-y divide-gray-200">
                        {votes.map((vote) => (
                            <tr key={vote.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {vote.userName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {vote.voterBandName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {vote.scores.map((score, index) => (
                                                <div
                                                    key={index}
                                                    className="px-3 py-1.5 bg-gray-50 rounded-md flex items-center justify-between"
                                                >
                                                    <span className="font-medium truncate mr-2">
                                                        {score.bandName}
                                                    </span>
                                                    <span className="text-[#333]">
                                                        {score.score}点
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {vote.createdAt ? formatDate(vote.createdAt) : "日時不明"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
