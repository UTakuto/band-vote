import { useState, useEffect } from "react";
import { Vote } from "@/types/types";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useVotes = () => {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const votesRef = collection(db, "votes");
                const q = query(votesRef, orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const votesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Vote[];
                setVotes(votesData);
            } catch (error) {
                console.error("投票データの取得に失敗:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVotes();
    }, []);

    return { votes, loading };
};
