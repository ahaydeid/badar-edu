import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, Plus, Calculator } from "lucide-react";
import { useState, useEffect } from "react";
import TambahPenilaianModal from "./components/TambahPenilaianModal";
import { useUiFeedback } from "@/hooks/useUiFeedback";
import Toast from "@/Components/ui/Toast";

type SubNilai = {
    id: number;
    nama: string;
    dinilai: number;
    // belum calculated in runtime
};

type Penilaian = {
    id: number;
    nama: string;
    deskripsi?: string;
    sub: SubNilai[];
};

type Props = {
    kelas: string;
    kelasId: number;
    mapelId: number;
    totalSiswa: number;
    penilaians: Penilaian[];
};

export default function Detail({ kelas, kelasId, mapelId, totalSiswa, penilaians }: Props) {
    const [openTambah, setOpenTambah] = useState(false);

    // Toast Handling
    const { toast, showToast } = useUiFeedback();
    const { props } = usePage<any>();

    useEffect(() => {
        if (props.flash?.success) {
            showToast(props.flash.success, 'success');
        }
        if (props.flash?.error) {
            showToast(props.flash.error, 'error');
        }
    }, [props.flash]);

    return (
        <div className="max-w-7xl px-4 space-y-6">
            <Head title={`Penilaian ${kelas}`} />
            <Toast open={toast.open} message={toast.message} type={toast.type} />

            <div className="max-w-7xl space-y-6 px-4">
                <Link
                    href="/penilaian"
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </Link>
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{kelas}</h1>
                        <p className="text-sm text-gray-500">{totalSiswa} siswa terdaftar</p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={`/penilaian/${kelasId}/hitung`}
                            className="inline-flex items-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                        >
                            <Calculator className="h-4 w-4" />
                            Hitung Penilaian
                        </Link>
                        <button
                            onClick={() => setOpenTambah(true)}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Penilaian
                        </button>
                    </div>
                </div>

                {/* LIST PENILAIAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {penilaians.map((p) => (
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
                                    p.sub.map((s) => {
                                        const belum  = totalSiswa - s.dinilai;
                                        return (
                                        <div
                                            key={s.id}
                                            className="rounded-md border border-gray-200 px-3 py-2"
                                        >
                                            <div className="text-sm font-medium text-gray-700">
                                                {s.nama}
                                            </div>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <span className="h-2 w-2 bg-green-500" />
                                                    Dinilai: <span className="font-semibold">{s.dinilai}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="h-2 w-2 bg-red-500" />
                                                    Belum Dinilai: <span className="font-semibold">{belum}</span>
                                                </span>
                                            </div>
                                        </div>
                                    )})
                                ) : (
                                    <div className="rounded-md border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-400">
                                        Belum ada sub penilaian
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                    {penilaians.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            Belum ada penilaian dibuat. Silakan tambah penilaian baru.
                        </div>
                    )}
                </div>
            </div>

            <TambahPenilaianModal
                open={openTambah}
                mode="baru"
                kelasId={kelasId}
                mapelId={mapelId}
                onClose={() => setOpenTambah(false)}
            />
        </div>
    );
}
