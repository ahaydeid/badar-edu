import { Head, Link } from "@inertiajs/react";
import { useState, useMemo } from "react";
import DetailPendaftarModal from "./components/DetailPendaftarModal";
import Toast from "@/Components/ui/Toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Pendaftar = {
    id: number;
    no_pendaftaran: string;
    nama: string;
    nik: string;
    nisn?: string; // Optional since not all candidates might have it
    asalSekolah: string;
    jurusan: string;
    gelombang: string;
    tanggalDaftar: string;
    status: string;
};

type Props = {
    pendaftars?: Pendaftar[]; // Now expecting full array
};

export default function Index({ pendaftars = [] }: Props) { // Default to empty array
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [selectedPendaftar, setSelectedPendaftar] = useState<Pendaftar | null>(null);

    // Client-side Pagination State
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        type: "success" as "success" | "error"
    });

    const showToast = (message: string, type: "success" | "error") => {
        setToastState({ open: true, message, type });
        setTimeout(() => setToastState(p => ({ ...p, open: false })), 3000);
    };

    // Client-side Filtering
    const filteredData = useMemo(() => {
        let data = pendaftars;

        if (filterStatus) {
            data = data.filter(p => p.status === filterStatus);
        }

        if (search) {
            const q = search.toLowerCase();
            data = data.filter(p => 
                p.nama.toLowerCase().includes(q) ||
                p.no_pendaftaran.toLowerCase().includes(q) ||
                (p.nik && p.nik.includes(q)) ||
                (p.nisn && p.nisn.includes(q)) ||
                (p.jurusan && p.jurusan.toLowerCase().includes(q))
            );
        }

        return data;
    }, [pendaftars, filterStatus, search]);

    // Client-side Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(start, start + rowsPerPage);

    // Reset page on filter change
    const onSearchChange = (val: string) => {
        setSearch(val);
        setPage(1);
    };

    const onFilterStatusChange = (val: string) => {
        setFilterStatus(val);
        setPage(1);
    };

    return (
        <>
            <Head title="Pendaftaran Masuk" />

            <div className="max-w-7xl space-y-6">
                {/* HEADER */}
                <div>
                    <h1 className="text-xl font-semibold">Pendaftaran Masuk</h1>
                    <p className="text-sm text-gray-500">
                        Daftar pendaftar PPDB yang masuk
                    </p>
                </div>

                {/* FILTER & SEARCH */}
                <div className="bg-white rounded-sm border border-gray-200 p-4 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">
                                Status
                            </label>
                            <select
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={filterStatus}
                                onChange={(e) => onFilterStatusChange(e.target.value)}
                            >
                                <option value="">Semua</option>
                                <option value="Menunggu Verifikasi">
                                    Menunggu Verifikasi
                                </option>
                                <option value="Perlu Perbaikan">
                                    Perlu Perbaikan
                                </option>
                                <option value="Ditolak">Ditolak</option>
                                <option value="Terverifikasi">Terverifikasi</option>
                            </select>
                        </div>
                         <div>
                            <label className="text-xs text-gray-500 block mb-1">
                                Jumlah
                            </label>
                            <select
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-64 text-right">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Cari (Nama, No Daf, NIK, Jurusan)..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm whitespace-nowrap">
                        <thead className="bg-sky-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left">No</th>
                                <th className="px-6 py-3 text-left">Siswa</th>
                                <th className="px-6 py-3 text-left">NIK</th>
                                <th className="px-6 py-3 text-left">
                                    Asal Sekolah
                                </th>
                                <th className="px-6 py-3 text-left">Jurusan</th>
                                <th className="px-6 py-3 text-left">
                                    Gelombang
                                </th>
                                <th className="px-6 py-3 text-left">Tanggal</th>
                                <th className="px-6 py-3 text-center">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.map((p, i) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3">{start + i + 1}</td>
                                    <td className="px-6 py-3">
                                        <div className="font-medium text-gray-900">{p.nama}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{p.no_pendaftaran}</div>
                                    </td>
                                    <td className="px-6 py-3">{p.nik}</td>
                                    <td className="px-6 py-3">
                                        {p.asalSekolah}
                                    </td>
                                    <td className="px-6 py-3">{p.jurusan}</td>
                                    <td className="px-6 py-3">{p.gelombang}</td>
                                    <td className="px-6 py-3">
                                        {p.tanggalDaftar}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button 
                                            onClick={() => setSelectedPendaftar(p)}
                                            className="inline-flex items-center rounded-md border border-gray-300 text-white bg-sky-600 px-3 py-1.5 text-sm cursor-pointer hover:bg-sky-700 hover:text-white"
                                        >
                                            Validasi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-6 py-6 text-center text-gray-500"
                                    >
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                 <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-600">
                        Menampilkan {paginatedData.length} dari {filteredData.length} data
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-gray-700 text-sm">
                            {page} dari {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
                        >
                             <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>


            <DetailPendaftarModal
                open={!!selectedPendaftar}
                data={selectedPendaftar}
                onClose={() => setSelectedPendaftar(null)}
                onSuccess={showToast}
            />

            <Toast 
                open={toastState.open}
                message={toastState.message}
                type={toastState.type}
            />
        </>
    );
}
