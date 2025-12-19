import Sidebar from "../components/Sidebar";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-background-light dark:bg-background-dark">
                {children}
            </main>
        </div>
    );
}
