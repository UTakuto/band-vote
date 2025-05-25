import { useState, useEffect } from "react";
import { Band } from "@/types/types";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useBands = () => {
    const [bands, setBands] = useState<Band[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBands = async () => {
            try {
                const bandsRef = collection(db, "bands");
                const q = query(bandsRef, orderBy("order", "asc"));
                const snapshot = await getDocs(q);
                const bandsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Band[];
                setBands(bandsData);
            } catch (error) {
                console.error("バンドデータの取得に失敗:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBands();
    }, []);

    return { bands, loading };
};
