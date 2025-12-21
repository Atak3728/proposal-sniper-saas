import Sidebar from "../components/Sidebar";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-full overflow-hidden flex bg-[#0f111a] text-gray-300">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                {children}
            </main>
        </div>
    );
}
