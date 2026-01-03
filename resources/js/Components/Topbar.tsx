import { Link, usePage } from "@inertiajs/react";
import { Bell } from "lucide-react";
import { useState } from "react";
import PengumumanModal from "./PengumumanModal";
import PengumumanList from "./PengumumanList";
import Avatar from "./Avatar";

export default function Topbar() {
    const { auth, topAnnouncements = [] } = usePage<any>().props;
    const user = auth?.user;

    const [openList, setOpenList] = useState(false);
    const [active, setActive] = useState<any>(null);

    const activeCount = topAnnouncements.filter((p: any) => p.is_active).length;

    return (
        <>
            <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
                {/* kiri */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg font-semibold text-gray-600">
                            SMKS Al Badar Balaraja
                        </span>
                        <span className="text-xs text-gray-400 -mt-0.5">
                            Jl. Raya Gembong–Cariu, Kp. Dangdeur, Sukamurni,
                            Balaraja, Tangerang
                        </span>
                    </div>
                </div>

                {/* kanan */}
                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={() => setOpenList((v) => !v)}
                        className="relative p-1 cursor-pointer"
                    >
                        <Bell className="w-6 h-6 text-gray-700" />
                        {activeCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {activeCount}
                            </span>
                        )}
                    </button>

                    {openList && (
                        <div className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded shadow-lg z-40">
                            <div className="px-4 py-3 border-b border-gray-200 font-semibold text-sky-600 text-center">
                                Pengumuman
                            </div>
                            <div className="max-h-100 overflow-y-auto">
                                <PengumumanList
                                    items={topAnnouncements}
                                    onSelect={(item) => {
                                        setActive(item);
                                        setOpenList(false);
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <Link
                        href="/profile"
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded"
                    >
                        <span className="text-sm text-gray-700">
                            {user?.nama}
                            {user?.gelar_belakang
                                ? `, ${user.gelar_belakang}`
                                : ""}
                        </span>

                        <Avatar
                            name={user?.nama}
                            photo={user?.foto}
                            size="small"
                        />
                    </Link>
                </div>
            </header>

            <PengumumanModal
                open={!!active}
                data={active}
                onClose={() => setActive(null)}
            />
        </>
    );
}
