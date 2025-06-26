import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/style/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BandVote",
    description: "軽音部員向けのバンド投票管理サイト",
    keywords: "バンド,投票,軽音部,管理,サイト,OMU",
    openGraph: {
        title: "BandVote",
        description: "軽音部員向けのバンド投票管理サイト",
        url: "https://band-vote-iota.vercel.app/",
        siteName: "BandVote",
    },
    icons: {
        icon: [{ url: "/favicon.ico" }],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
