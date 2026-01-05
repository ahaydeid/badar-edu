import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Pen,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

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
    onAdd: () => void;
    onEdit: (kelas: any) => void;
};

export default function KelasTable({
    data,
    page,
    totalPages,
    rowsPerPage,
    searchTerm,
    onSearchChange,
    onRowsChange,
    onPrev,
    onNext,
    onAdd,
    onEdit,
}: Props) {
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
    const [deleting, setDeleting] = useState(false);

    const handleDelete = (id: number) => {
        setDeleteConfirm({ open: true, id });
    };

    const confirmDelete = () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);
        router.delete(`/master-data/rombel/${deleteConfirm.id}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteConfirm({ open: false, id: null });
            },
        });
    };
    return (
        <div className="w-full space-y-6">
            {/* ACTION BAR */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded shadow active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Kelas
                    </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Master Kelas (Rombel)
                    </h1>

                    <div className="flex text-sm items-center gap-3">
                        <select
                            value={rowsPerPage}
                            onChange={(e) =>
                                onRowsChange(Number(e.target.value))
                            }
                            className="border border-gray-200 px-3 py-2 rounded-lg w-[90px]"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Cari nama / tingkat / jurusan / wali..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-64 border border-gray-200 px-3 py-2 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded border border-gray-200 bg-white">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-max text-sm text-left">
                        <thead>
                            <tr className="bg-sky-100 text-gray-700 h-12">
                                <th className="p-3 text-center">No</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3 text-center">Tingkat</th>
                                <th className="p-3">Jurusan</th>
                                <th className="p-3">Jumlah Siswa</th>
                                <th className="p-3">Wali Kelas</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center">
                                        Tidak ada data kelas.
                                    </td>
                                </tr>
                            ) : (
                                data.map((k: any) => (
                                    <tr
                                        key={k.id}
                                        className="border-b border-gray-200 hover:bg-sky-50"
                                    >
                                        <td className="p-3 text-center">
                                            {k.no}
                                        </td>
                                        <td className="p-3 font-medium">
                                            {k.nama}
                                        </td>
                                        <td className="p-3 text-center">
                                            {k.tingkat}
                                        </td>
                                        <td className="p-3">
                                            {k.jurusan?.nama}
                                        </td>
                                        <td className="p-3 text-center font-bold">
                                            {k.jumlah_siswa}
                                        </td>

                                        <td className="p-3">
                                            {k.wali ? k.wali.nama : "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit(k)}
                                                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white cursor-pointer rounded-md text-xs flex items-center gap-1 transition-colors"
                                                >
                                                    <Pen className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(k.id)}
                                                    className="px-3 py-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-md text-xs flex items-center gap-1 transition-colors"
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

            {/* PAGINATION */}
            <div className="flex justify-end items-center gap-3">
                <button
                    onClick={onPrev}
                    disabled={page === 1}
                    className="p-2 border rounded-lg disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-600">
                    {page} dari {totalPages}
                </span>

                <button
                    onClick={onNext}
                    disabled={page === totalPages}
                    className="p-2 border rounded-lg disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <ConfirmDialog
                open={deleteConfirm.open}
                message="Apakah Anda yakin ingin menghapus kelas ini? Kelas yang masih memiliki siswa tidak dapat dihapus."
                confirmText="Ya, Hapus"
                loading={deleting}
                onClose={() => setDeleteConfirm({ open: false, id: null })}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
