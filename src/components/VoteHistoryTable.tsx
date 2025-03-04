import { Vote } from "@/types/types";

export default function VoteHistoryTable({ votes }: { votes: Vote[] }) {
    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">投票履歴</h2>
            <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                投票者
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                バンド
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                点数
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                投票日時
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#fefefe] divide-y divide-gray-200">
                        {votes.map((vote) => (
                            <tr key={vote.id}>
                                <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                    {vote.userName}
                                </td>
                                <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                    {vote.bandName}
                                </td>
                                <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                    {vote.score}
                                </td>
                                <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                    {new Date(vote.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
