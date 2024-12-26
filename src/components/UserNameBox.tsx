export default function UserNameBox() {
    return (
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
    );
}
