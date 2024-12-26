import BandScore from "@/hooks/BandScore";

export default function BandScoreList() {
    return (
        <div className="w-[250px] mb-5">
            <label
                htmlFor="band"
                className="block text-sm font-medium text-gray-700 dark:text-[#fefefe]"
            >
                バンドの点数を記入してください
            </label>
            <BandScore />
        </div>
    );
}
