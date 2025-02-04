import BandCheckbox from "./BandCheckbox";

export default function BandList() {
    return (
        <div className="w-[250px] sm:w-[350px] mb-5">
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
    );
}
