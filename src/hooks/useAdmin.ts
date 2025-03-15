import { useEffect, useState } from "react";

export const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                // クッキーの存在を確認
                const cookies = document.cookie.split(";");
                const adminAuth = cookies.find((cookie) => cookie.trim().startsWith("admin_auth="));

                if (adminAuth) {
                    const isAuthenticated = adminAuth.split("=")[1] === "true";
                    setIsAdmin(isAuthenticated);
                }
            } catch (error) {
                console.error("認証状態の確認に失敗しました:", error);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, []);

    return { isAdmin, loading };
};
