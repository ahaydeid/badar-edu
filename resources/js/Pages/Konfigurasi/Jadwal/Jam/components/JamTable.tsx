import { Link } from "@inertiajs/react";
import { Plus, ChevronLeft, ChevronRight, Eye, Pencil } from "lucide-react";

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

function formatTime(t: string) {
    if (!t) return "-";
    return t.slice(0, 5); // HH:mm
}

export default function JamTable({
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
    return (
        <div className="w-full space-y-6">
            {/* ACTION BAR */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                    <Link
                        href="/jam/create"
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Jam
                    </Link>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Konfigurasi Jam
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
                            placeholder="Cari nama jam..."
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
                                <th className="p-3 text-center">Jam Mulai</th>
                                <th className="p-3 text-center">Jam Selesai</th>
                                <th className="p-3 text-center">Jumlah JP</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center">
                                        Tidak ada data jam.
                                    </td>
                                </tr>
                            ) : (
                                data.map((j: any) => (
                                    <tr
                                        key={j.id}
                                        className="border-b border-gray-200 hover:bg-sky-50"
                                    >
                                        <td className="p-3 text-center">
                                            {j.no}
                                        </td>
                                        <td className="p-3 font-medium">
                                            {j.nama}
                                        </td>
                                        <td className="p-3 text-center">
                                            {formatTime(j.jam_mulai)}
                                        </td>
                                        <td className="p-3 text-center">
                                            {formatTime(j.jam_selesai)}
                                        </td>
                                        <td className="p-3 text-center">
                                            {j.jumlah_jp}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/jam/${j.id}`}
                                                    className="px-3 py-2 bg-sky-500 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </Link>

                                                <Link
                                                    href={`/jam/${j.id}/edit`}
                                                    className="px-3 py-2 bg-amber-500 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Edit
                                                </Link>
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
        </div>
    );
}
