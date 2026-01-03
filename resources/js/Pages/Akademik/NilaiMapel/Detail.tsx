import { Head, Link, usePage, router } from "@inertiajs/react";
import { ArrowLeft, Plus, Calculator, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import TambahPenilaianModal from "./components/TambahPenilaianModal";
import NilaiInputModal from "./components/NilaiInputModal";
import { useUiFeedback } from "@/hooks/useUiFeedback";
import Toast from "@/Components/ui/Toast";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

type Siswa = {
    id: number;
    nama: string;
    nilai?: number | null;
};

type SubNilai = {
    id: number;
    nama: string;
    dinilai: number;
    status: 'proses' | 'selesai';
    siswa: Siswa[];
};

type Penilaian = {
    id: number;
    nama: string;
    has_sub: boolean;
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
    
    // Direct Input State
    const [activeSub, setActiveSub] = useState<SubNilai | null>(null);
    const [isInputModalOpen, setIsInputModalOpen] = useState(false);

    // Deletion State
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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

    const handleCardClick = (p: Penilaian) => {
        if (p.has_sub) {
            router.get(`/penilaian/${kelasId}/${p.id}`);
        } else if (p.sub.length > 0) {
            setActiveSub(p.sub[0]);
            setIsInputModalOpen(true);
        }
    };

    const confirmDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setItemToDelete(id);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        router.delete(`/penilaian/${itemToDelete}`, {
            onSuccess: () => {
                setItemToDelete(null);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
            preserveScroll: true
        });
    };

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
                        <button
                            key={p.id}
                            onClick={() => handleCardClick(p)}
                            className="group relative block w-full text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="text-base font-semibold text-gray-800">
                                    {p.nama}
                                </div>
                                <button
                                    onClick={(e) => confirmDelete(e, p.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Hapus Penilaian"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {p.deskripsi && (
                                <p className="mb-3 text-sm text-gray-500">
                                    {p.deskripsi}
                                </p>
                            )}

                            <div className="space-y-2">
                                {p.sub.length > 0 ? (
                                    p.has_sub ? (
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
                                    ) : (() => {
                                        const s = p.sub[0];
                                        const belum = totalSiswa - (s.dinilai || 0);
                                        return (
                                            <div className="mt-2 space-y-2">
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>Monitoring Input</span>
                                                    {s.status === 'selesai' ? (
                                                        <span className="text-green-600 font-medium">Selesai</span>
                                                    ) : (
                                                        <span className="bg-yellow-400 text-white text-xs py-0.5 px-2">Dalam Proses</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <span className="h-2 w-2 bg-green-500" />
                                                        Dinilai: <span className="font-semibold">{s.dinilai || 0}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="h-2 w-2 bg-red-500" />
                                                        Belum Dinilai: <span className="font-semibold">{belum}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="rounded-md border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-400">
                                        Belum ada data input
                                    </div>
                                )}
                            </div>
                        </button>
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

            {activeSub && (
                <NilaiInputModal
                    open={isInputModalOpen}
                    onClose={() => {
                        setIsInputModalOpen(false);
                        setActiveSub(null);
                    }}
                    activeSub={activeSub}
                    kelas={kelas}
                />
            )}

            <ConfirmDialog
                open={!!itemToDelete}
                title="Hapus Penilaian"
                message="Peringatan: Menghapus penilaian ini akan menghapus semua sub-nilai dan data nilai siswa yang terkait secara permanen. Apakah Anda yakin?"
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="danger"
                loading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => setItemToDelete(null)}
            />
        </div>
    );
}
