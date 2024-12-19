import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FormData } from "@/types/types";
import { useRouter } from "next/navigation";

export const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,

    formData: FormData,

    setError: React.Dispatch<React.SetStateAction<string>>,

    router: ReturnType<typeof useRouter>
) => {
    e.preventDefault();

    if (!formData.name || !formData.band || formData.scores.length === 0) {
        setError("すべての項目を入力してください。");
        return;
    }

    // 自分のバンドを採点しないチェック
    if (formData.scores.some((score) => score.band === formData.band)) {
        setError("自分の出演バンドに点数をつけることはできません。");
        return;
    }

    try {
        // Firestoreに投票データを送信
        await addDoc(collection(db, "users"), {
            name: formData.name,
            band: formData.band,
            scores: formData.scores,
        });

        setError("");
        alert("投票が完了しました！");
        router.push("/results"); // 結果ページへリダイレクト
    } catch {
        setError("送信中にエラーが発生しました。");
    }
};
