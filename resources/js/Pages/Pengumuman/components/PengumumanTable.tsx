import { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Eye,
} from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import PengumumanModal from "@/Components/PengumumanModal";

interface Role {
    id: number;
    name: string;
}

type Props = {
    data: any[];
    page: number;
    totalPages: number;
    rowsPerPage: number;
    searchTerm: string;
    onSearchChange: (v: string) => void;
    onRowsChange: (v: number) => void;
    onPrev: () => void;
    onNext: () => void;
};

export default function PengumumanTable({
    data,
    page,
    totalPages,
    rowsPerPage,
    searchTerm,
    onSearchChange,
    onRowsChange,
    onPrev,
    onNext,
}: Props) {
    const { auth, flash } = usePage<any>().props;
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [toast, setToast] = useState({ open: false, message: "", type: "success" as "success" | "error" });
    const [selectedDetail, setSelectedDetail] = useState<any | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ open: true, message: flash.success, type: "success" });
            setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
        }
        if (flash?.error) {
            setToast({ open: true, message: flash.error, type: "error" });
            setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
        }
    }, [flash]);

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deleteId) return;
        router.delete(`/pengumuman/${deleteId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmDeleteOpen(false);
                setToast({ open: true, message: "Pengumuman berhasil dihapus!", type: "success" });
                setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
            },
            onError: () => {
                setConfirmDeleteOpen(false);
                setToast({ open: true, message: "Gagal menghapus pengumuman.", type: "error" });
                setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
            }
        });
    };

    function formatRangeDate(start?: string, end?: string) {
        if (!start) return "-";

        const s = new Date(start);
        const e = end ? new Date(end) : null;

        const sDay = s.getDate();
        const sMonth = s.toLocaleString("id-ID", { month: "short" });
        const sYear = s.getFullYear();

        if (!e) {
            return `${sDay} ${sMonth} ${sYear}`;
        }

        const eDay = e.getDate();
        const eMonth = e.toLocaleString("id-ID", { month: "short" });
        const eYear = e.getFullYear();

        if (sMonth === eMonth && sYear === eYear) {
            return `${sDay} - ${eDay} ${sMonth} ${sYear}`;
        }

        if (sYear === eYear) {
            return `${sDay} ${sMonth} - ${eDay} ${eMonth} ${sYear}`;
        }

        return `${sDay} ${sMonth} ${sYear} - ${eDay} ${eMonth} ${eYear}`;
    }

    function truncateWords(text: string, limit = 10) {
        if (!text) return "-";
        const words = text.split(" ");
        return words.length > limit
            ? words.slice(0, limit).join(" ") + "…"
            : text;
    }

    return (
        <>
            <div className="w-full space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <Link
                            href="/pengumuman/create"
                            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Pengumuman
                        </Link>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-xl font-semibold text-gray-800">
                            Daftar Pengumuman
                        </h1>

                        <div className="flex text-sm items-center gap-3">
                            <select
                                value={rowsPerPage}
                                onChange={(e) =>
                                    onRowsChange(Number(e.target.value))
                                }
                                className="border border-gray-200 px-3 py-2 rounded w-[90px]"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Cari judul / target..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-64 border border-gray-200 px-3 py-2 rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded border border-gray-200 bg-white">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-max text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-sky-100 text-gray-700 h-12">
                                    <th className="p-3 text-center border-b border-gray-200">No</th>
                                    <th className="p-3 border-b border-gray-200">Judul</th>
                                    <th className="p-3 text-center border-b border-gray-200">Target</th>
                                    <th className="p-3 border-b border-gray-200">Isi</th>
                                    <th className="p-3 text-center border-b border-gray-200">Tanggal</th>
                                    <th className="p-3 text-center border-b border-gray-200">Status</th>
                                    <th className="p-3 text-center border-b border-gray-200">Gambar</th>
                                    <th className="p-3 text-center border-b border-gray-200">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-4 text-center">
                                            Tidak ada data pengumuman.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((p: any) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-gray-200"
                                        >
                                            <td className="p-3 text-center">
                                                {p.no}
                                            </td>
                                            <td className="p-3 font-medium">
                                                {p.judul}
                                            </td>
                                            <td className="p-3 text-center">
                                                {p.roles && p.roles.length > 0 ? (
                                                    <div className="flex flex-wrap justify-center gap-1">
                                                        {p.roles.filter((r: any) => r.name !== 'devhero' || auth?.roles?.includes('devhero')).map((r: any) => (
                                                            <span key={r.id} className="inline-block bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                                {r.name.toUpperCase()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">Semua</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                {truncateWords(p.isi)}
                                            </td>
                                            <td className="p-3 text-center">
                                                {formatRangeDate(
                                                    p.tanggal_mulai,
                                                    p.tanggal_selesai
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${
                                                        p.is_active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {p.is_active
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {p.gambar ? (
                                                    <img 
                                                        src={`/storage/${p.gambar}`} 
                                                        alt={p.judul}
                                                        className="w-10 h-10 object-cover rounded mx-auto border border-gray-200"
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedDetail(p)}
                                                        className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded text-xs flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Detail
                                                    </button>

                                                    <Link
                                                        href={`/pengumuman/${p.id}/edit`}
                                                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs flex items-center gap-1"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                        Edit
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDeleteClick(p.id)}
                                                        className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3">
                    <button
                        onClick={onPrev}
                        disabled={page === 1}
                        className="p-2 border rounded disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="text-sm text-gray-600">
                        {page} dari {totalPages}
                    </span>

                    <button
                        onClick={onNext}
                        disabled={page === totalPages}
                        className="p-2 border rounded disabled:opacity-40"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <ConfirmDialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Pengumuman?"
                message="Apakah Anda yakin ingin menghapus pengumuman ini secara permanen?"
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="danger"
            />

            <Toast 
                open={toast.open} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
            />

            <PengumumanModal 
                open={!!selectedDetail}
                data={selectedDetail}
                onClose={() => setSelectedDetail(null)}
            />
        </>
    );
}
