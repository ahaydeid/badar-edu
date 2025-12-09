import { Link } from "@inertiajs/react";
import { UserCircle } from "lucide-react";

interface TopbarProps {
    role?: string;
    name?: string;
}

export default function Topbar({ role = "Admin", name = "Ahadi" }: TopbarProps) {
    const roleLabel =
        typeof role === "string" && role.length
            ? role.charAt(0).toUpperCase() + role.slice(1)
            : "User";

    return (
        <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Kiri */}
            <div className="flex items-center gap-3">
                <img
                    src="/img/logo-albadar.png"
                    alt="Logo Al Badar"
                    className="w-9 h-9 object-contain"
                />
                <div className="flex flex-col leading-tight">
                    <span className="text-lg font-semibold text-gray-800">
                        SMKS Al Badar Balaraja
                    </span>
                    <span className="text-xs text-gray-600 -mt-0.5">
                        Jl. Raya Gembong–Cariu, Kp. Dangdeur, Desa Sukamurni,
                        Kec. Balaraja, Kab. Tangerang, Banten
                    </span>
                </div>
            </div>

            {/* Kanan */}
            <Link
                href="/profile"
                className="flex items-center gap-3 hover:bg-gray-100 py-2 rounded transition"
                title="Lihat Profil"
            >
                <span className="text-sm font-medium text-gray-700">
                    <span className="bg-blue-500 py-0.5 px-1 text-xs text-white">
                        {roleLabel}
                    </span>{" "}
                    - {name}
                </span>
                <UserCircle className="w-6 h-6 text-gray-700" />
            </Link>
        </header>
    );
}
