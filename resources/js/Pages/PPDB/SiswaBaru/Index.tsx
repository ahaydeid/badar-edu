import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Users2, Eye, Send } from "lucide-react";
import SiswaBaruDetailModal from "./components/SiswaBaruDetailModal";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";

type SiswaBaru = {
    id: number;
    no_pendaftaran: string;
    nama_lengkap: string;
    nisn: string;
    nik: string;
    jenis_kelamin: "L" | "P";
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    no_hp_siswa: string;
    alamat_jalan: string;
    rt_rw: string;
    desa_kelurahan: string;
    kecamatan: string;
    kota_kabupaten: string;
    provinsi: string;
    asal_sekolah: string;
    created_at: string;
    jurusan?: { kode: string; nama: string };
};

type Props = {
    siswaBaru?: SiswaBaru[];
};

export default function Index({ siswaBaru = [] }: Props) {
    const [search, setSearch] = useState<string>("");
    const [selected, setSelected] = useState<SiswaBaru | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        type: "success" as "success" | "error"
    });

    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [processStep, setProcessStep] = useState(0);

    const steps = [
        "Menganalisis data calon siswa...",
        "Menyiapkan struktur tabel induk...",
        "Validasi integritas data...",
        "Sinkronisasi database...",
        "Finalisasi migrasi..."
    ];

    const filtered = (siswaBaru || []).filter((d) => {
        const q = search.toLowerCase();
        return q
            ? d.no_pendaftaran.toLowerCase().includes(q) ||
                  d.nama_lengkap.toLowerCase().includes(q) ||
                  d.asal_sekolah?.toLowerCase().includes(q)
            : true;
    });

    const handleMigrate = () => {
        setIsConfirmOpen(false);
        setIsProcessing(true);
        setProcessStep(0);

        // Artificial delay logic (5 steps, 1 second each)
        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step < steps.length) {
                setProcessStep(step);
            } else {
                clearInterval(interval);
            }
        }, 1000);

        // Actual migration call after 5 seconds
        setTimeout(() => {
            router.post('/ppdb/siswa-baru/bulk-migrate', {}, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSuccess(true);
                    setToastState({
                        open: true,
                        message: "Berhasil memigrasikan seluruh siswa baru ke tabel utama!",
                        type: "success"
                    });
                    
                    // Keep modal for 2 more seconds to show success state
                    setTimeout(() => {
                        setIsProcessing(false);
                        setIsSuccess(false);
                        setTimeout(() => setToastState(p => ({ ...p, open: false })), 3000);
                    }, 2000);
                },
                onError: () => {
                    setToastState({
                        open: true,
                        message: "Gagal melakukan migrasi. Silakan coba lagi.",
                        type: "error"
                    });
                    setIsProcessing(false);
                    setIsSuccess(false);
                }
            });
        }, 5500); // Slightly more than 5s to finish animation smoothly
    };

    const openDetail = (data: SiswaBaru) => {
        setSelected(data);
        setIsDetailOpen(true);
    };

    return (
        <>
            <Head title="Siswa Baru PPDB" />

            <div className="max-w-7xl space-y-4">
                {/* HEADER + ACTIONS */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Siswa Baru</h1>
                        <p className="text-sm text-gray-500">
                            Peserta didik baru yang telah melakukan daftar ulang
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari..."
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                            />
                        </div>

                        <button 
                            disabled={siswaBaru.length === 0}
                            onClick={() => setIsConfirmOpen(true)}
                            className="inline-flex items-center gap-2 cursor-pointer rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} /> Migrasi ke Tabel Siswa
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-600 font-bold tracking-wider">
                            <tr>
                                <th className="px-4 py-4 text-center w-12 border-b border-gray-100">No</th>
                                <th className="px-4 py-4 text-left border-b border-gray-100">Siswa</th>
                                <th className="px-4 py-4 text-left border-b border-gray-100">Jurusan</th>
                                <th className="px-4 py-4 text-left border-b border-gray-100">Asal Sekolah</th>
                                <th className="px-4 py-4 text-center border-b border-gray-100">Tgl Daftar</th>
                                <th className="px-4 py-4 text-center border-b border-gray-100">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {filtered.map((d, i) => (
                                <tr key={d.id} className="hover:bg-sky-50/30 transition-colors group">
                                    <td className="px-4 py-3.5 text-center text-gray-700">{i + 1}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-medium text-gray-900">{d.nama_lengkap}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{d.no_pendaftaran}</div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="inline-flex items-center text-sm font-bold text-gray-700 uppercase">
                                            {d.jurusan?.kode || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-gray-700">{d.asal_sekolah}</td>
                                    <td className="px-4 py-3.5 text-center text-gray-700">{d.created_at}</td>
                                    <td className="px-4 py-3.5 text-center">
                                         <button 
                                            onClick={() => openDetail(d)}
                                            className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:shadow-sm hover:bg-sky-600 hover:text-white transition-all cursor-pointer active:scale-95"
                                         >
                                            <Eye size={14} /> Detail
                                         </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-20 text-center text-gray-400 italic">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Users2 className="h-10 w-10 text-gray-200" />
                                            <p>Belum ada data siswa baru yang ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SiswaBaruDetailModal 
                open={isDetailOpen}
                data={selected}
                onClose={() => setIsDetailOpen(false)}
            />

            <ConfirmDialog 
                open={isConfirmOpen}
                title="Migrasi Masal Siswa Baru"
                message={`Sistem akan memindahkan seluruh siswa baru (${siswaBaru.length} orang) ke tabel data induk siswa. Proses ini tidak dapat dibatalkan.`}
                onConfirm={handleMigrate}
                onClose={() => setIsConfirmOpen(false)}
                confirmText="Ya, Migrasikan"
                variant="primary"
            />

            <Toast 
                open={toastState.open}
                message={toastState.message}
                type={toastState.type}
            />

            {/* PREMIUM PROCESSING MODAL */}
            {isProcessing && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/80 backdrop-blur-md">
                    <div className="w-full max-w-sm rounded-sm bg-white p-8 text-center shadow-2xl ring-1 ring-white/20">
                        {/* ANIMATED LOADER / SUCCESS ICON */}
                        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                            {isSuccess ? (
                                <>
                                    <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-75"></div>
                                    <div className="relative h-16 w-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                        <Eye className="h-8 w-8 text-white" /> {/* Using Eye as a placeholder for check, or just keep Send */}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 animate-ping rounded-full bg-sky-100 opacity-75"></div>
                                    <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600 shadow-lg"></div>
                                    <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                                        <Send className="h-5 w-5 text-sky-600" />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* STEP CONTENT */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isSuccess ? "Migrasi Selesai!" : "Migrasi Sedang Berlangsung"}
                            </h3>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ease-in-out ${isSuccess ? 'bg-green-500 w-full' : 'bg-sky-600'}`}
                                    style={{ width: isSuccess ? '100%' : `${((processStep + 1) / steps.length) * 100}%` }}
                                />
                            </div>
                            <div className="h-10">
                                <p className={`text-sm font-medium ${isSuccess ? 'text-green-600' : 'animate-pulse text-sky-700'}`}>
                                    {isSuccess ? "Data berhasil dipindahkan ke tabel siswa." : steps[processStep]}
                                </p>
                            </div>
                            {!isSuccess && (
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                    Mohon jangan tutup halaman ini
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
