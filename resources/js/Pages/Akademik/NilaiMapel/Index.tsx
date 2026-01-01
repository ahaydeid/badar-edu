import { Users } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

type PenilaianRingkas = {
    nama: string;
};

type KelasItem = {
    id: number;
    mapel_id: number;
    nama_kelas: string;
    nama_mapel: string;
    siswa_count: number;
    penilaian: PenilaianRingkas[];
};

type Props = {
    listKelas: KelasItem[];
}

export default function Index({ listKelas = [] }: Props) {
    const [search, setSearch] = useState("");

    const filtered = listKelas.filter((k) =>
        k.nama_kelas.toLowerCase().includes(search.toLowerCase()) || 
        k.nama_mapel.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Penilaian" />

            <div className="max-w-7xl space-y-6 px-4">
                {/* HEADER + SEARCH */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Penilaian</h1>
                        <p className="text-sm text-gray-500">
                            Kelas yang kamu ampu
                        </p>
                    </div>

                    <div className="w-56">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kelas..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* GRID KELAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((k) => (
                        <Link
                            key={`${k.id}-${k.mapel_id}`}
                            href={`/penilaian/${k.id}?mapel=${k.mapel_id}`}
                            className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition"
                        >
                            {/* HEADER CARD */}
                            <div className="flex items-center justify-between">
                                <div className="text-base font-semibold text-gray-800">
                                    {k.nama_kelas}
                                    <span className="block text-xs font-normal text-gray-500 mt-0.5">
                                        {k.nama_mapel}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Users className="h-4 w-4" />
                                    {k.siswa_count} siswa
                                </div>
                            </div>

                            <div className="my-3 border-t border-gray-100" />

                            {/* JENIS PENILAIAN */}
                            <div className="grid grid-cols-2 gap-3">
                                {k.penilaian.map((p, i) => (
                                    <div
                                        key={i}
                                        className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
                                    >
                                        {p.nama}
                                    </div>
                                ))}
                                {k.penilaian.length === 0 && (
                                     <div className="col-span-2 text-xs text-gray-400 italic">
                                        Belum ada penilaian
                                     </div>
                                )}
                            </div>
                        </Link>
                    ))}

                    {filtered.length === 0 && (
                        <div className="col-span-full text-center text-sm text-gray-500 py-10">
                            Kelas tidak ditemukan
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
