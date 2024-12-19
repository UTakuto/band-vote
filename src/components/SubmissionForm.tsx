const SubmissionForm = () => {
    // const router = useRouter();
    //max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md h-full m-auto
    return (
        <div className="w-[300px] h-auto m-auto border border-solid border-1 rounded-md bg-[#fefefe] drop-shadow-[0_0_8px_rgba(226,226,226,0.9)] py-10 flex flex-col items-center justify-center dark:drop-shadow-[0_0_8px_rgba(198,198,198,0.2)] dark:bg-[#212121] dark:border-[#212121] dark:text-[#fefefe]">
            <h1 className="text-bold  ">バンド投票フォーム</h1>
            <form className="w-[250px] max-w-lg flex flex-col justify-center items-center py-4">
                <div className="w-[250px] mb-5">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-[#fefefe] "
                    >
                        名前
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="OMU たろう"
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>

                <div className="w-[250px] mb-5">
                    <label
                        htmlFor="band"
                        className="block text-sm font-medium text-gray-700 dark:text-[#fefefe] "
                    >
                        出演バンド
                    </label>
                    <select
                        id="band"
                        name="band"
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full dark:bg-[#fefefe] dark:text-[#212121] "
                        required
                    >
                        <option value="">選択してください</option>
                        <option value="">バンドA</option>
                        <option value="">バンドB</option>
                        <option value="">バンドC</option>
                        <option value="">バンドD</option>
                    </select>
                </div>

                <div className="w-[250px] mb-4">
                    <label
                        id="style"
                        className="block text-sm font-medium text-gray-700 dark:text-[#fefefe]"
                    >
                        バンド点数
                    </label>

                    {/* <ul className="flex flex-row justify-between items-center w-full h-full mb-3 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg sm:flex rounded-md dark:bg-[#fefefe] dark:text-[#212121]">
                        <li className="w-3/12 flex justify-center items-center h-full text-center border-gray-300 px-10px sm:border-r">
                            <div className=" text-center">
                                <label
                                    id="style"
                                    className=" py-3 text-sm font-medium text-gray-900 text-center"
                                >
                                    TOMORROW X TOGETHER
                                </label>
                            </div>
                        </li>
                        <li className=" border-gray-200">
                            <div className="">
                                <input
                                    type="number"
                                    id="number"
                                    name="number"
                                    min="0"
                                    max="10"
                                    placeholder="0~10で点数を入力"
                                    className=" h-max p-3 rounded-md hover:border-none click:border-none"
                                />
                            </div>
                        </li>
                    </ul> */}
                </div>

                <button
                    type="submit"
                    className="w-[120px] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mt-4"
                >
                    投票
                </button>
            </form>
        </div>
    );
};

export default SubmissionForm;
