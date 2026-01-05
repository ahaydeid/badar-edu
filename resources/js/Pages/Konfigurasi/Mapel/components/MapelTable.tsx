import React, { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, User, AlertCircle as AlertIcon } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import { router } from "@inertiajs/react";

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
    onEdit: (m: any) => void;
};

export default function MapelTable({
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
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            router.delete(route("konfigurasi.mapel.destroy", selectedId), {
                onSuccess: () => setIsConfirmOpen(false),
            });
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* ACTION BAR */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Mata Pelajaran
                    </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Konfigurasi Mata Pelajaran
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
                            placeholder="Cari nama / kode mapel..."
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
                                <th className="p-3">Nama Mapel</th>
                                <th className="p-3">Guru Pengampu</th>
                                <th className="p-3 text-center">Kode</th>
                                <th className="p-3 text-center">Kategori</th>
                                <th className="p-3 text-center">Tingkat</th>
                                <th className="p-3">Jurusan</th>
                                <th className="p-3 text-center">Warna</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-4 text-center">
                                        Tidak ada data mata pelajaran.
                                    </td>
                                </tr>
                            ) : (
                                data.map((m: any) => (
                                    <tr
                                        key={m.id}
                                        className="border-b border-gray-200 hover:bg-sky-50"
                                    >
                                        <td className="p-3 text-center">
                                            {m.no}
                                        </td>
                                        <td className="p-3 font-medium">
                                            {m.nama}
                                        </td>
                                        <td className="p-3">
                                            {m.guru ? m.guru.nama : <span className="text-red-500 italic text-xs">Belum ada guru</span>}
                                        </td>
                                        <td className="p-3 text-center">
                                            {m.kode_mapel}
                                        </td>
                                        <td className="p-3 text-center">
                                            {m.kategori}
                                        </td>
                                        <td className="p-3 text-center">
                                            {m.tingkat}
                                        </td>
                                        <td className="p-3">
                                            {m.jurusan ? m.jurusan.nama : "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {m.warna_hex_mapel ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <span
                                                        className="w-4 h-4 rounded"
                                                        style={{
                                                            backgroundColor:
                                                                m.warna_hex_mapel,
                                                        }}
                                                    />
                                                    {m.warna_hex_mapel}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit(m)}
                                                    className="px-3 py-2 bg-amber-500 text-white cursor-pointer rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(m.id)}
                                                    className="px-3 py-2 bg-red-500 cursor-pointer text-white rounded-md text-xs flex items-center gap-1"
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
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Mata Pelajaran"
                message="Apakah Anda yakin ingin menghapus mata pelajaran ini? Data yang sudah dihapus tidak dapat dikembalikan."
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="danger"
            />
        </div>
    );
}
