import React from "react";
import BandCheckbox from "./BandCheckbox";
import { Band } from "@/types/types";
interface BandListProps {
    bands: Band[];
    selectedBands: { [key: string]: boolean };
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    checkboxName: string;
}

const BandList: React.FC<BandListProps> = ({
    bands,
    selectedBands,
    onCheckboxChange,
    checkboxName,
}) => {
    return (
        <div className="w-[250px] sm:w-[350px] mb-5">
            <label
                htmlFor="band"
                className="block text-sm font-medium text-gray-700 dark:text-[#fefefe]"
            >
                出演バンド
            </label>
            <div className="w-full flex flex-col items-center justify-center">
                {bands.map((band) => (
                    <BandCheckbox
                        key={band.id}
                        id={band.id}
                        label={band.name}
                        name={checkboxName}
                        value={band.id}
                        checked={selectedBands[band.id] || false}
                        onChange={onCheckboxChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default BandList;
