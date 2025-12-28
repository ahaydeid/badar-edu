// resources/js/Layouts/GuestLayout.tsx
import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";

export default function GuestLayout({
    children,
    title,
}: {
    children: ReactNode;
    title?: string;
}) {
    return (
        <>
            <Head title={title ?? "Login"} />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                {children}
            </div>
        </>
    );
}
