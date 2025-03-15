import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // クライアントサイドの設定
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                dns: false,
                child_process: false,
                process: require.resolve("process/browser"),
            };
        }

        if (isServer) {
            // サーバーサイドの設定
            config.resolve = {
                ...config.resolve,
                fallback: {
                    ...config.resolve?.fallback,
                    "node:process": false,
                },
            };
        }
        return config;
    },
    serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
