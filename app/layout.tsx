import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/layouts/Header";
import { LoadingProvider } from "@/context/LoadingContext";
import { AuthProvider } from "@/context/AuthContext";
import { AuthMessageProvider } from "@/context/AuthMessageContext";
import { Footer } from "@/components/layouts/Footer";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "TravelMap - Khám phá khu du lịch, khách sạn, tour du lịch",
        template: "%s | TravelMap",
    },
    description:
        "Khám phá khu du lịch, địa điểm du lịch, khách sạn và tour du lịch trên bản đồ. Tìm đường đi và đánh dấu vị trí du lịch yêu thích.",
    keywords: [
        "du lịch",
        "khách sạn",
        "tour du lịch",
        "khu du lịch",
        "địa điểm du lịch",
        "travel map",
    ],
    authors: [{ name: "TravelMap Team" }],
    openGraph: {
        title: "TravelMap - Khám phá du lịch",
        description: "Tìm khu du lịch, khách sạn và tour du lịch trên bản đồ.",
        type: "website",
        locale: "vi_VN",
        url: `${baseUrl}`,
        siteName: "",
        images: {
            url: "",
            width: 1200,
            height: 630,
            alt: "",
        },
    },
    alternates: {
        canonical: `${baseUrl}`,
    },
    metadataBase: new URL(`${baseUrl}`),
};

export const viewport: Viewport = {
    width: "device-with",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white`}
            >
                <AuthProvider>
                    <LoadingProvider>
                        <AuthMessageProvider>
                            <Header />
                            <Suspense>{children}</Suspense>
                            <Footer />
                        </AuthMessageProvider>
                    </LoadingProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
