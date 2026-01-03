import { Head, useForm, router, usePage } from "@inertiajs/react";
import { ArrowLeft, Plus, X, Save, CheckCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import TambahPenilaianModal from "./components/TambahPenilaianModal";
import NilaiInputModal from "./components/NilaiInputModal";
import Toast from "@/Components/ui/Toast";
import { useUiFeedback } from "@/hooks/useUiFeedback";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

type Siswa = {
    id: number;
    nama: string;
    nilai?: number | null;
};

type SubPenilaian = {
    id: number;
    nama: string;
    status: 'proses' | 'selesai';
    siswa: Siswa[];
};

type Props = {
    kelas: string;
    penilaian: string;
    penilaianId: number;
    subPenilaians: SubPenilaian[];
}

export default function SubPenilaian({ kelas, penilaian, penilaianId, subPenilaians }: Props) {
    
    // State for Modals
    const [openTambahSub, setOpenTambahSub] = useState(false);
    
    // State for "Input Nilai"
    const [activeSub, setActiveSub] = useState<SubPenilaian | null>(null);
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

    const openInputModal = (sub: SubPenilaian) => {
        setActiveSub(sub);
        setIsInputModalOpen(true);
    };

    const confirmDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setItemToDelete(id);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        router.delete(`/penilaian/sub/${itemToDelete}`, {
            onSuccess: () => {
                setItemToDelete(null);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title={`Sub Penilaian - ${penilaian}`} />
            <Toast open={toast.open} message={toast.message} type={toast.type} />

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
                    {subPenilaians.map((s) => {
                        const total = s.siswa.length;
                        const dinilai = s.siswa.filter(
                            (x) => x.nilai !== null && x.nilai !== undefined
                        ).length;
                        const belum = total - dinilai;
                        const selesai = s.status === 'selesai';

                        return (
                            <button
                                key={s.id}
                                onClick={() => openInputModal(s)}
                                className="group relative text-left block w-full rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    {/* JUDUL */}
                                    <div className="text-base font-semibold text-gray-800">
                                        {s.nama}
                                    </div>
                                    <button
                                        onClick={(e) => confirmDelete(e, s.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Hapus Sub Nilai"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
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
                                        <span className="inline-flex items-center bg-green-400 px-2 py-0.5 text-xs font-medium text-white">
                                            Selesai
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center bg-yellow-400 px-2 py-0.5 text-xs font-medium text-white">
                                            Dalam Proses
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                     {subPenilaians.length === 0 && (
                        <div className="col-span-full py-10 text-center text-sm text-gray-500">
                            Belum ada sub penilaian.
                        </div>
                    )}
                </div>
            </div>

            <TambahPenilaianModal
                open={openTambahSub}
                mode="sub"
                penilaianId={penilaianId}
                onClose={() => setOpenTambahSub(false)}
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
                title="Hapus Sub Nilai"
                message="Apakah Anda yakin ingin menghapus sub penilaian ini beserta semua data nilainya?"
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="danger"
                loading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => setItemToDelete(null)}
            />
        </>
    );
}
