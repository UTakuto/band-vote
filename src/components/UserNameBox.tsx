interface UserNameBoxProps {
    value: string;
    onChange: (value: string) => void;
}

export default function UserNameBox({ value, onChange }: UserNameBoxProps) {
    return (
        <div className="w-[250px] sm:w-[350px] mb-5">
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="OMU たろう"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full dark:text-[#212121]"
                required
            />
        </div>
    );
}
