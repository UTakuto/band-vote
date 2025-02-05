import React from "react";

interface BandCheckboxProps {
    id: string;
    label: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BandCheckbox: React.FC<BandCheckboxProps> = ({
    id,
    label,
    name,
    value,
    checked,
    onChange,
}) => {
    return (
        <div className="w-full flex items-center ps-4 mt-2 border border-gray-300 rounded-md dark:border-[#fefefe] dark:bg-[#fefefe]">
            <input
                id={id}
                type="checkbox"
                value={value}
                name={name}
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
                htmlFor={id}
                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-[#212121]"
            >
                {label}
            </label>
        </div>
    );
};

export default BandCheckbox;
