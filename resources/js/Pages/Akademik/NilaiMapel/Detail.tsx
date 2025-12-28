import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import TambahPenilaianModal from "./components/TambahPenilaianModal";

type SubNilai = {
    id: number;
    nama: string;
    dinilai: number;
    belum: number;
};

type Penilaian = {
    id: number;
    nama: string;
    deskripsi?: string;
    sub: SubNilai[];
};

export default function Detail() {
    const [openTambah, setOpenTambah] = useState(false);

    const kelasId = 1;
    const kelas = "12 MPLB 1";

    const penilaian: Penilaian[] = [
        {
            id: 1,
            nama: "Tugas Projek",
            deskripsi: "Penilaian tugas berbasis projek.",
            sub: [
                {
                    id: 1,
                    nama: "Membuat Halaman Responsif",
                    dinilai: 20,
                    belum: 16,
                },
            ],
        },
        {
            id: 2,
            nama: "Tugas Akhir",
            deskripsi: "Penilaian akhir semester.",
            sub: [],
        },
    ];

    return (
        <>
            <Head title={`Penilaian ${kelas}`} />

            <div className="max-w-7xl space-y-6 px-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{kelas}</h1>

                    <button
                        onClick={() => setOpenTambah(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Penilaian
                    </button>
                </div>

                {/* LIST PENILAIAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {penilaian.map((p) => (
                        <Link
                            key={p.id}
                            href={`/penilaian/${kelasId}/${p.id}`}
                            className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition"
                        >
                            <div className="mb-2 text-base font-semibold text-gray-800">
                                {p.nama}
                            </div>

                            {p.deskripsi && (
                                <p className="mb-3 text-sm text-gray-500">
                                    {p.deskripsi}
                                </p>
                            )}

                            <div className="space-y-2">
                                {p.sub.length > 0 ? (
                                    p.sub.map((s) => (
                                        <div
                                            key={s.id}
                                            className="rounded-md border border-gray-200 px-3 py-2"
                                        >
                                            <div className="text-sm font-medium text-gray-700">
                                                {s.nama}
                                            </div>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                                    Dinilai {s.dinilai}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                                    Blm Dinilai {s.belum}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-md border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-400">
                                        Belum ada sub penilaian
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <TambahPenilaianModal
                open={openTambah}
                mode="baru"
                onClose={() => setOpenTambah(false)}
            />
        </>
    );
}
