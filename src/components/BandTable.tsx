import React from "react";
import { Band } from "@/types/types";

interface BandTableProps {
    bands: Band[];
    isEditing: boolean;
    setBands: React.Dispatch<React.SetStateAction<Band[]>>;
}

const BandTable: React.FC<BandTableProps> = ({ bands, isEditing, setBands }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            順位
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            バンド名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            合計点
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            平均点
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[#fefefe] divide-y divide-gray-200">
                    {bands.map((band) => (
                        <tr key={band.id}>
                            <td className="px-6 py-4 [#fefefe]space-nowrap text-sm font-medium text-gray-900">
                                {band.rank}位
                            </td>
                            <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={band.name}
                                        onChange={(e) => {
                                            const newBands = bands.map((b) =>
                                                b.id === band.id
                                                    ? {
                                                          ...b,
                                                          name: e.target.value,
                                                      }
                                                    : b
                                            );
                                            setBands(newBands);
                                        }}
                                        className="border rounded px-2 py-1"
                                    />
                                ) : (
                                    band.name
                                )}
                            </td>
                            <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                {(band.score !== undefined ? band.score : 0).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 [#fefefe]space-nowrap text-sm text-gray-900">
                                {(band.averageScore !== undefined ? band.averageScore : 0).toFixed(
                                    1
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BandTable;
