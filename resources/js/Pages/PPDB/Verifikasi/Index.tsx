import { Head, router, Link } from "@inertiajs/react";
import { useState, useMemo } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import { Megaphone, Lock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import DetailPendaftarModal from "../Pendaftaran/components/DetailPendaftarModal";

type VerifikasiItem = {
    id: number;
    no_pendaftaran: string;
    nama: string;
    jurusan: string;
    nilai_akhir: number;
    status: "Terverifikasi" | "Diterima" | "Cadangan" | "Ditolak";
};

type Props = {
    pendaftars?: VerifikasiItem[]; // Now expecting full array
};

export default function Index({ pendaftars = [] }: Props) { // Default to empty array
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [isPublished, setIsPublished] = useState(false); // TODO: Fetch from Period status
    const [confirmPublish, setConfirmPublish] = useState(false);

    const [confirmUpdateStatus, setConfirmUpdateStatus] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedPendaftar, setSelectedPendaftar] = useState<VerifikasiItem | null>(null);
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
        if (search) {
            const q = search.toLowerCase();
            data = data.filter(d => 
                d.nama.toLowerCase().includes(q) ||
                d.no_pendaftaran.toLowerCase().includes(q) ||
                (d.jurusan && d.jurusan.toLowerCase().includes(q))
            );
        }
        return data;
    }, [pendaftars, search]);

    // Client-side Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(start, start + rowsPerPage);

    const onSearchChange = (val: string) => {
        setSearch(val);
        setPage(1);
    };

    const handleUpdateStatus = (id: number, status: string) => {
        setSelectedId(id);
        setSelectedStatus(status);
        setConfirmUpdateStatus(true);
    };

    const confirmUpdate = () => {
        if (selectedId && selectedStatus) {
            router.put(`/ppdb/verifikasi/${selectedId}/status`, { status: selectedStatus }, {
                preserveScroll: true,
                onSuccess: () => {
                    showToast("Status berhasil diperbarui", "success");
                    setConfirmUpdateStatus(false);
                    setSelectedId(null);
                    setSelectedStatus(null);
                },
                onError: () => {
                    showToast("Gagal memperbarui status", "error");
                    setConfirmUpdateStatus(false);
                }
            });
        }
    };

    const handlePublish = () => {
        // Mocking publish for now
        setIsPublished(true);
        setConfirmPublish(false);
    };

    return (
        <>
            <Head title="Verifikasi & Seleksi" />

            <div className="max-w-7xl space-y-6">
                {/* HEADER */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Verifikasi & Seleksi
                        </h1>
                        <p className="text-sm text-gray-500">
                            Penentuan kelulusan pendaftar PPDB
                        </p>
                    </div>

                    <div className="flex gap-3">
                         {/* SEARCH */}
                        <div className="w-64">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Cari nama / jurusan..."
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>

                        {/* PUBLISH BUTTON */}
                        {!isPublished ? (
                            <button
                                onClick={() => setConfirmPublish(true)}
                                className="inline-flex items-center gap-2 cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                <Megaphone className="h-4 w-4" />
                                Publikasikan
                            </button>
                        ) : (
                            <button
                                disabled
                                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Terpublikasi
                            </button>
                        )}
                    </div>
                </div>

                {/* BANNER STATUS */}
                {isPublished && (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                        <Lock className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        <div>
                            <p className="font-semibold text-sm text-gray-900">Seleksi Telah Dikunci</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Pengumuman hasil seleksi telah dipublikasikan. Anda tidak dapat mengubah status kelulusan siswa saat ini.
                            </p>
                        </div>
                    </div>
                )}

                {/* VISIBLE ENTRIES SELECTOR */}
                <div className="flex justify-end">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Tampilkan</span>
                        <select
                            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
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

                {/* TABLE */}
                <div className="rounded-sm border border-gray-200 bg-white overflow-x-auto">
                    <table className="w-full text-sm whitespace-nowrap">
                        <thead className="bg-sky-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4 text-left w-12">No</th>
                                <th className="px-6 py-4 text-left">Siswa</th>
                                <th className="px-6 py-4 text-left">Jurusan</th>
                                <th className="px-6 py-4 text-right">Nilai Akhir</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Aksi Seleksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.map((d, i) => (
                                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 text-center">{start + i + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{d.nama}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{d.no_pendaftaran}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                            {d.jurusan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                                        {d.nilai_akhir ? d.nilai_akhir.toFixed(2) : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`inline-flex items-center gap-2 text-sm
                                                ${d.status === 'Diterima' ? 'text-gray-900' : 
                                                  d.status === 'Ditolak' ? 'text-gray-500' :
                                                  d.status === 'Cadangan' ? 'text-gray-900' :
                                                  'text-gray-500'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full 
                                                    ${d.status === 'Diterima' ? 'bg-emerald-500' : 
                                                      d.status === 'Ditolak' ? 'bg-red-500' :
                                                      d.status === 'Cadangan' ? 'bg-amber-500' :
                                                      'bg-gray-300'
                                                    }`} />
                                                {d.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {isPublished ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-full">
                                                <Lock className="h-3 w-3" />
                                                Terkunci
                                            </span>
                                        ) : (
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={() => setSelectedPendaftar(d)}
                                                    className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-sky-700"
                                                >
                                                    Proses
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        Tidak ada data yang ditemukan.
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
                        <span className="px-4 py-2 text-sm bg-white text-gray-700">
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

            <ConfirmDialog
                open={confirmPublish}
                title="Publikasikan Pengumuman?"
                message="Tindakan ini akan mengunci hasil seleksi dan siswa dapat melihat status kelulusan mereka. Anda tidak dapat mengubahnya lagi kecuali akses dibuka kembali oleh Super Admin."
                confirmText="Ya, Publikasikan"
                onClose={() => setConfirmPublish(false)}
                onConfirm={handlePublish}
                variant="primary"
            />

            <ConfirmDialog
                open={confirmUpdateStatus}
                title={`Konfirmasi Status: ${selectedStatus}`}
                message={`Apakah Anda yakin ingin mengubah status siswa ini menjadi "${selectedStatus}"? Pastikan pilihan Anda sudah benar.`}
                confirmText="Ya, Simpan"
                onClose={() => setConfirmUpdateStatus(false)}
                onConfirm={confirmUpdate}
                variant={selectedStatus === 'Ditolak' ? 'danger' : 'primary'}
            />
            {/* SELECTION MODAL */}
            {selectedPendaftar && (
                <DetailPendaftarModal
                    open={!!selectedPendaftar}
                    data={selectedPendaftar as any}
                    onClose={() => setSelectedPendaftar(null)}
                    onSuccess={showToast}
                    mode="selection"
                />
            )}

            <Toast 
                open={toastState.open}
                message={toastState.message}
                type={toastState.type}
            />
        </>
    );
}
