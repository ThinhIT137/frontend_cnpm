import SideMenuAdmin from "@/components/layouts/SideMenuAdmin";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar gắn bên trái */}
            <SideMenuAdmin />

            {/* Nội dung bên phải (Margin left 64 tương đương w-64 của sidebar trên PC) */}
            <main className="flex-1 md:ml-64 w-full">{children}</main>
        </div>
    );
}
