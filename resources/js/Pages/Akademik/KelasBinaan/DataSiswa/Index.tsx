import { useMemo, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Eye, Users } from "lucide-react";

export default function Index() {
    const { siswa, kelas } = usePage<any>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return siswa.filter((s: any) => s.nama.toLowerCase().includes(q));
    }, [siswa, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const numbered = paginated.map((s: any, i: number) => ({
        ...s,
        no: start + i + 1,
    }));

    return (
        <div className="w-full space-y-6">
            {/* ACTION BAR */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Data Siswa Kelas {kelas.nama}
                    </h1>

                    <div className="flex text-sm items-center gap-3">
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
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
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
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
                                <th className="p-3 text-center">JK</th>
                                <th className="p-3 text-center">NIPD</th>
                                <th className="p-3 text-center">NISN</th>
                                <th className="p-3 text-center">Status Kedisiplinan</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {numbered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center">
                                        Tidak ada data siswa.
                                    </td>
                                </tr>
                            ) : (
                                numbered.map((s: any) => (
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
                                        <td className="p-3 text-center">
                                            {s.jenis_kelamin}
                                        </td>
                                        <td className="p-3 text-center">
                                            {s.nipd ?? "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {s.nisn ?? "-"}
                                        </td>
                                        <td className="p-3 text-center italic text-gray-400">
                                            Tidak ada sanksi
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center">
                                                <Link
                                                    href={`/kelas-binaan/siswa/${s.id}`}
                                                    className="px-3 py-2 bg-sky-500 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border rounded-lg disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-600">
                    {page} dari {totalPages}
                </span>

                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border rounded-lg disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
