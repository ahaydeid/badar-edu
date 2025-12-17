import { Link, router } from "@inertiajs/react";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Eye,
    Image as ImageIcon,
} from "lucide-react";

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

        // sama bulan & tahun
        if (sMonth === eMonth && sYear === eYear) {
            return `${sDay} - ${eDay} ${sMonth} ${sYear}`;
        }

        // beda bulan, sama tahun
        if (sYear === eYear) {
            return `${sDay} ${sMonth} - ${eDay} ${eMonth} ${sYear}`;
        }

        // beda tahun
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
        <div className="w-full space-y-6">
            {/* ACTION BAR */}
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
                            className="border border-gray-200 px-3 py-2 rounded-lg w-[90px]"
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
                                <th className="p-3">Judul</th>
                                <th className="p-3 text-center">Target</th>
                                <th className="p-3">Isi</th>
                                <th className="p-3 text-center">Tanggal</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Gambar</th>
                                <th className="p-3 text-center">Aksi</th>
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
                                        className="border-b border-gray-200 hover:bg-sky-50"
                                    >
                                        <td className="p-3 text-center">
                                            {p.no}
                                        </td>
                                        <td className="p-3 font-medium">
                                            {p.judul}
                                        </td>
                                        <td className="p-3 text-center">
                                            {p.target}
                                        </td>
                                        <td className="p-3">
                                            {truncateWords(p.isi)}
                                        </td>
                                        <td className="p-3">
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
                                                <ImageIcon className="w-4 h-4 mx-auto text-sky-600" />
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/pengumuman/${p.id}`}
                                                    className="px-3 py-2 bg-sky-500 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </Link>

                                                <Link
                                                    href={`/pengumuman/${p.id}/edit`}
                                                    className="px-3 py-2 bg-amber-500 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        router.delete(
                                                            `/pengumuman/${p.id}`,
                                                            {
                                                                preserveScroll:
                                                                    true,
                                                            }
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-rose-500 text-white rounded-md text-xs flex items-center gap-1"
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
        </div>
    );
}
