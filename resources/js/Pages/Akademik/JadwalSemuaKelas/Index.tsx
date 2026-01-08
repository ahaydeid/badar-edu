"use client";

import { router, usePage } from "@inertiajs/react";
import type { PageProps } from "@inertiajs/core";
import { BookOpen, Users } from "lucide-react";

type KelasItem = {
    id: number;
    nama_rombel: string;
    wali_nama: string | null;
    jumlah_siswa: number;
};

type Props = PageProps & {
    kelasList: KelasItem[];
};

export default function Index() {
    const { kelasList } = usePage<Props>().props;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            Master Jadwal
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Pilih kelas untuk melihat jadwal pelajaran
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Users className="w-5 h-5" />
                        <span className="text-sm">
                            {kelasList.length} Kelas
                        </span>
                    </div>
                </div>

                <div className="space-y-8">
                    {["10", "11", "12", "X", "XI", "XII"].map((prefix) => {
                        const data = kelasList.filter((k) =>
                            k.nama_rombel.toUpperCase().startsWith(prefix.toUpperCase())
                        );

                        if (data.length === 0) return null;

                        return (
                            <div key={prefix} className="space-y-4">
                                <h2 className="text-2xl font-bold text-sky-600">
                                    Kelas {prefix.trim()}
                                </h2>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {data.map((k) => (
                                        <Card k={k} key={k.id} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Fallback for classes that don't match any prefix */}
                    {(() => {
                        const matchedIds = ["10", "11", "12", "X", "XI", "XII"].flatMap(prefix => 
                            kelasList.filter(k => k.nama_rombel.toUpperCase().startsWith(prefix.toUpperCase())).map(k => k.id)
                        );
                        const remaining = kelasList.filter(k => !matchedIds.includes(k.id));
                        
                        if (remaining.length === 0) return null;

                        return (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-400">
                                    Kelas Lainnya
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {remaining.map((k) => (
                                        <Card k={k} key={k.id} />
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}

function Card({ k }: { k: KelasItem }) {
    return (
        <div
            onClick={() => {
                router.get(`/jadwal-semua-kelas/${k.id}`);
            }}
            className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition hover:shadow"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 group-hover:text-sky-600 transition">
                        {k.nama_rombel}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {k.wali_nama
                            ? `Wali: ${k.wali_nama}`
                            : "Belum ada wali kelas"}
                    </p>
                </div>

                <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
                    <BookOpen className="w-5 h-5" />
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{k.jumlah_siswa} siswa</span>
                </div>

                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    Lihat Jadwal →
                </span>
            </div>
        </div>
    );
}
