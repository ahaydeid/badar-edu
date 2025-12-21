import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

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

function formatTanggal(d?: string | null) {
    if (!d) return "-";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return d;
    const dd = String(date.getDate()).padStart(2, "0");
    const mon = date.toLocaleString("en-US", { month: "short" });
    const yyyy = date.getFullYear();
    return `${dd} ${mon} ${yyyy}`;
}

export default function SiswaTable({
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
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Monitoring Kedisiplinan Siswa
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
                            placeholder="Cari nama siswa..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-64 border border-gray-200 px-3 py-2 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded border border-gray-200 bg-white">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-max text-sm text-left">
                        <thead>
                            <tr className="bg-sky-100 text-gray-700 h-12">
                                <th className="p-3 text-center">No</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3 text-center">Total Poin</th>
                                <th className="p-3 text-center">
                                    Sanksi Aktif
                                </th>
                                <th className="p-3 text-center">
                                    Tanggal Diberikan
                                </th>
                                <th className="p-3 text-center">
                                    Tanggal Selesai
                                </th>
                                <th className="p-3 text-center">
                                    Sisa Masa Berlaku
                                </th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center">
                                        Tidak ada data siswa.
                                    </td>
                                </tr>
                            ) : (
                                data.map((s: any) => (
                                    <tr
                                        key={s.id}
                                        className="border-b border-gray-200 hover:bg-sky-50"
                                    >
                                        <td className="p-3 text-center">
                                            {s.no}
                                        </td>
                                        <td className="p-3 font-medium">
                                            {s.nama}
                                        </td>
                                        <td className="p-3 text-center font-semibold">
                                            {s.total_poin}
                                        </td>
                                        <td className="p-3 text-center">
                                            {s.sanksi_nama ? (
                                                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-medium">
                                                    {s.sanksi_nama} (
                                                    {s.sanksi_kode})
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            {formatTanggal(s.tanggal_mulai)}
                                        </td>
                                        <td className="p-3 text-center">
                                            {formatTanggal(s.tanggal_selesai)}
                                        </td>
                                        <td className="p-3 text-center">
                                            {s.sisa_hari !== null &&
                                            s.sisa_hari !== undefined
                                                ? `${s.sisa_hari} hari`
                                                : "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <Link
                                                href={`/kedisiplinan/siswa/${s.id}`}
                                                className="px-3 py-2 bg-sky-600 text-white rounded-md text-xs flex items-center justify-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </Link>
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
