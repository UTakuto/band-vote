import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FormData, Band } from "@/types/types";
import { useRouter } from "next/navigation";

export const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    formData: FormData,
    setError: React.Dispatch<React.SetStateAction<string>>,
    router: ReturnType<typeof useRouter>,
    bands: Band[]
) => {
    try {
        // バリデーションチェック
        if (!formData.name.trim()) {
            setError("名前を入力してください。");
            return;
        }

        if (formData.scores.length === 0) {
            setError("少なくとも1つのバンドに投票してください。");
            return;
        }

        const votesRef = collection(db, "votes");

        // 投票データの作成
        const voteData = {
            userName: formData.name.trim(),
            voterBandId: formData.band || "", // 空文字列を許容
            voterBandName: formData.band
                ? bands.find((band) => band.id === formData.band)?.name || ""
                : "",
            scores: formData.scores.map((score) => {
                const votedBand = bands.find((band) => band.id === score.band);
                if (!votedBand) {
                    throw new Error(`投票先のバンドが見つかりません: ${score.band}`);
                }
                return {
                    bandId: score.band,
                    bandName: votedBand.name,
                    score: score.score,
                };
            }),
            createdAt: serverTimestamp(),
        };

        await addDoc(votesRef, voteData);

        setError("");
        alert("投票が完了しました！");
        router.push("/vote-complete");
    } catch (error) {
        console.error("投票エラー:", error);
        setError("投票に失敗しました。時間をおいて再度お試しください。");
        throw error;
    }
};
