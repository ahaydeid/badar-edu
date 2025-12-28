import { Head } from "@inertiajs/react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useState } from "react";
import TambahPenilaianModal from "./components/TambahPenilaianModal";

type Siswa = {
    id: number;
    nama: string;
    nilai?: number;
};

type SubPenilaian = {
    id: number;
    nama: string;
    siswa: Siswa[];
};

export default function SubPenilaian() {
    const kelas = "12 MPLB 1";
    const penilaian = "Tugas Projek";

    const [openModal, setOpenModal] = useState(false);
    const [activeSub, setActiveSub] = useState<SubPenilaian | null>(null);
    const [openTambahSub, setOpenTambahSub] = useState(false);

    const subPenilaian: SubPenilaian[] = [
        {
            id: 1,
            nama: "Membuat Halaman Responsif",
            siswa: [
                { id: 1, nama: "Siswa 1" },
                { id: 2, nama: "Siswa 2" },
                { id: 3, nama: "Siswa 3" },
            ],
        },
        {
            id: 2,
            nama: "Buat Game Flappy Bird dengan Javascript",
            siswa: [
                { id: 1, nama: "Siswa 1" },
                { id: 2, nama: "Siswa 2" },
                { id: 3, nama: "Siswa 3" },
            ],
        },
    ];

    return (
        <>
            <Head title={`Sub Penilaian - ${penilaian}`} />

            <div className="max-w-7xl px-4 space-y-6">
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
                    <div>
                        <h1 className="text-xl font-semibold">{penilaian}</h1>
                        <p className="text-sm text-gray-500">{kelas}</p>
                    </div>

                    <button
                        onClick={() => setOpenTambahSub(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Sub Penilaian
                    </button>
                </div>

                {/* LIST SUB PENILAIAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {subPenilaian.map((s) => {
                        const total = s.siswa.length;
                        const dinilai = s.siswa.filter(
                            (x) => x.nilai !== undefined
                        ).length;
                        const belum = total - dinilai;
                        const selesai = belum === 0;

                        return (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setActiveSub(s);
                                    setOpenModal(true);
                                }}
                                className="text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition"
                            >
                                {/* JUDUL */}
                                <div className="text-base font-semibold text-gray-800">
                                    {s.nama}
                                </div>

                                {/* META */}
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                    <span>{total} siswa</span>

                                    <span className="flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                        Dinilai {dinilai}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                        Belum {belum}
                                    </span>
                                </div>

                                {/* STATUS */}
                                <div className="mt-3">
                                    {selesai ? (
                                        <span className="inline-flex items-center rounded-md bg-green-200 px-2 py-0.5 text-xs font-medium text-green-600">
                                            Selesai
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-md bg-yellow-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                                            Dalam Proses
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* MODAL INPUT NILAI */}
            {openModal && activeSub && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-3xl rounded-lg bg-white border border-gray-200">
                        {/* HEADER MODAL */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                            <div>
                                <div className="text-sm font-semibold">
                                    {activeSub.nama}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {kelas}
                                </div>
                            </div>
                            <button
                                onClick={() => setOpenModal(false)}
                                className="rounded-md p-1 hover:bg-gray-100"
                            >
                                <X className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-4">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border border-gray-300">
                                        <th className="px-3 py-2 w-12">No</th>
                                        <th className="px-3 py-2 text-left">
                                            Nama
                                        </th>
                                        <th className="px-3 py-2 w-28">
                                            Nilai
                                        </th>
                                        <th className="px-3 py-2 w-24">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeSub.siswa.map((s, i) => (
                                        <tr
                                            key={s.id}
                                            className="border border-gray-300"
                                        >
                                            <td className="px-3 py-2 text-center">
                                                {i + 1}
                                            </td>
                                            <td className="px-3 py-2">
                                                {s.nama}
                                            </td>
                                            <td className="px-3 py-2">
                                                <input className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm" />
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <button className="rounded-md bg-gray-200 px-3 py-1 text-xs">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
                            <button className="rounded-md bg-blue-500 px-5 py-2 text-sm text-white">
                                Perbarui
                            </button>
                            <button className="rounded-md bg-blue-600 px-5 py-2 text-sm text-white">
                                Selesaikan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TambahPenilaianModal
                open={openTambahSub}
                mode="sub"
                // penilaianId={penilaianId}
                onClose={() => setOpenTambahSub(false)}
            />
        </>
    );
}
