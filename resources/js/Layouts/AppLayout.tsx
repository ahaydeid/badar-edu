import { useState, type ReactNode } from "react";
import Sidebar from "@/Components/Sidebar";
import Topbar from "@/Components/Topbar";
import { Head, usePage } from "@inertiajs/react";

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const [isOpen, setIsOpen] = useState(true);
    const sidebarWidth = isOpen ? "ml-65" : "ml-16";

    const { props } = usePage();

    const user = props?.auth?.user ?? {};
    const appName = (props?.appName as string | undefined) ?? "BADU Suites | Badar Education";

    return (
        <>
            <Head title={title ? `${title} | ${appName}` : appName} />

            <div className="relative min-h-screen">
                <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

                <div
                    className={`transition-all duration-300 ${sidebarWidth} sticky top-0 z-20`}
                >
                    <Topbar role={user.role} name={user.name} />
                </div>

                <main
                    className={`transition-all duration-300 ${sidebarWidth} py-6 px-2`}
                >
                    {children}
                </main>
            </div>
        </>
    );
}
