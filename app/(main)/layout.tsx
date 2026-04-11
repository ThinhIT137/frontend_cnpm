import { Footer } from "@/components/layouts/Footer";
import { Suspense } from "react";
import Header from "@/components/layouts/Header";
import SearchComponent from "@/components/layouts/SearchComponent";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white">
            {/* Sidebar gắn bên trái */}
            <Header />
            <SearchComponent />
            <Suspense>{children}</Suspense>
            <Footer />
            {/* Nội dung bên phải (Margin left 64 tương đương w-64 của sidebar trên PC) */}
        </div>
    );
}
