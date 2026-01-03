import { useState, ChangeEvent } from "react";
import { Head, usePage, router as inertiaRouter } from "@inertiajs/react";
import LokasiAbsenModal from "./components/LokasiAbsenModal";
import Toast from "@/Components/ui/Toast";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

export default function AbsensiGuru() {
    const { items } = usePage<any>().props;
    const rows = items as any[];

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Toast State
    const [toast, setToast] = useState<{ show: boolean; message: string; variant: "success" | "error" }>({
        show: false,
        message: "",
        variant: "success",
    });

    const showToast = (message: string, variant: "success" | "error" = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    };

    // ConfirmDialog State
    const [confirmAction, setConfirmAction] = useState<{
        open: boolean;
        id: number | null;
        status: "APPROVED" | "REJECTED" | null;
    }>({
        open: false,
        id: null,
        status: null,
    });

    const [detail, setDetail] = useState<{
        nama: string | null;
        jamMasuk: string | null;
        lat: number | null;
        lng: number | null;
        foto: string | null;
        verifikasi: "AUTO" | "PENDING" | "APPROVED" | "REJECTED" | null;
        isInRange: boolean;
    }>({
        nama: null,
        jamMasuk: null,
        lat: null,
        lng: null,
        foto: null,
        verifikasi: null,
        isInRange: true,
    });

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleVerify = () => {
        if (!confirmAction.id || !confirmAction.status) return;

        setIsProcessing(true);
        inertiaRouter.post(`/absensi-guru/verify/${confirmAction.id}`, {
            status: confirmAction.status
        }, {
            onSuccess: () => {
                showToast(`Absensi berhasil ${confirmAction.status === 'APPROVED' ? 'disetujui' : 'ditolak'}`);
                setConfirmAction({ open: false, id: null, status: null });
            },
            onError: () => showToast("Gagal memproses verifikasi", "error"),
            onFinish: () => setIsProcessing(false)
        });
    };

    const filtered = rows.filter((item) => {
        const q = search.toLowerCase();
        return (
            item.nama.toLowerCase().includes(q) ||
            item.mapel.toLowerCase().includes(q)
        );
    });

    const openModal = (item: any) => {
        setDetail({
            nama: item.nama,
            jamMasuk: item.jamMasuk,
            lat: item.lat,
            lng: item.lng,
            foto: item.foto,
            verifikasi: item.verifikasi,
            isInRange: item.isInRange,
        });
        setOpen(true);
    };

    const renderVerifikasiBadge = (item: any) => {
        if (!item.jamMasuk || item.metodeAbsen !== 'geo') return null;

        switch (item.verifikasi) {
            case 'AUTO':
                return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">AUTO</span>;
            case 'PENDING':
                return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">PENDING</span>;
            case 'APPROVED':
                return <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-[10px] font-bold">APPROVED</span>;
            case 'REJECTED':
                return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">REJECTED</span>;
            default:
                return null;
        }
    };

    const renderStatus = (item: any) => {
        if (!item.jamMasuk) return <span className="text-red-500 font-bold uppercase">Belum Absen</span>;
        return <span className="text-green-600 font-bold uppercase">Sudah Absen</span>;
    };

    return (
        <div className="p-6">
            <Head title="Absensi Guru Hari Ini" />
            
            <h2 className="font-bold text-3xl mb-6">Absensi Guru Hari Ini</h2>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Cari guru atau mapel..."
                    className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                    value={search}
                    onChange={handleSearch}
                />

                <div className="overflow-x-auto border border-gray-200 rounded bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-sky-100 text-gray-700 font-bold">
                            <tr className="text-center">
                                <th className="p-3 border-r border-white">No</th>
                                <th className="p-3 border-r border-white">Nama</th>
                                <th className="p-3 border-r border-white">Mengajar</th>
                                <th className="p-3 border-r border-white">Jadwal</th>
                                <th className="p-3 border-r border-white">Absen Masuk</th>
                                <th className="p-3 border-r border-white">Absen Pulang</th>
                                <th className="p-3 border-r border-white">Status</th>
                                <th className="p-3 border-r border-white">Jenis Absen</th>
                                <th className="p-3 border-r border-white">Verifikasi</th>
                                <th className="p-3 border-r border-white">Foto</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center p-4 text-gray-400">
                                        Tidak ada jadwal hari ini.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item, idx) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-3 text-center">{idx + 1}</td>
                                        <td className="p-3">{item.nama}</td>
                                        <td className="p-3">{item.mapel}</td>
                                        <td className="p-3 text-center">{item.jadwal}</td>
                                        <td className="p-3 text-center">{item.jamMasuk ?? "-"}</td>
                                        <td className="p-3 text-center">{item.jamPulang ?? "-"}</td>
                                        <td className="p-3 text-center">{renderStatus(item)}</td>
                                        <td className="p-3 text-center">
                                            {item.jamMasuk ? (
                                                item.metodeAbsen === "geo" ? "MOBILE" : "RFID"
                                            ) : "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {renderVerifikasiBadge(item) || "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.foto ? (
                                                <button 
                                                    onClick={() => openModal(item)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Lihat Foto
                                                </button>
                                            ) : "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                {item.jamMasuk && item.metodeAbsen === "geo" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openModal(item)}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                                                    >
                                                        Lokasi
                                                    </button>
                                                )}
                                                
                                                {item.verifikasi === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => setConfirmAction({ open: true, id: item.id, status: 'APPROVED' })}
                                                            className="px-3 py-1 bg-sky-600 text-white rounded text-xs"
                                                        >
                                                            Terima
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmAction({ open: true, id: item.id, status: 'REJECTED' })}
                                                            className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                {rows.filter(item => item.verifikasi === 'PENDING').length > 0 && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded text-sm text-amber-800">
                        <strong>Perhatian:</strong> Terdapat {rows.filter(item => item.verifikasi === 'PENDING').length} absensi yang memerlukan verifikasi manual.
                    </div>
                )}
            </div>

            <LokasiAbsenModal
                open={open}
                onClose={() => setOpen(false)}
                lat={detail.lat}
                lng={detail.lng}
                nama={detail.nama}
                jamMasuk={detail.jamMasuk}
                foto={detail.foto}
                verifikasi={detail.verifikasi}
                isInRange={detail.isInRange}
            />

            <Toast open={false} {...toast} />
            <ConfirmDialog
                open={confirmAction.open}
                variant={confirmAction.status === 'REJECTED' ? 'danger' : 'primary'}
                title={confirmAction.status === 'APPROVED' ? "Terima Absensi" : "Tolak Absensi"}
                message={`Konfirmasi: Apakah Anda yakin ingin ${confirmAction.status === 'APPROVED' ? 'menerima' : 'menolak'} rekaman absensi ini?`}
                confirmText={confirmAction.status === 'APPROVED' ? "Ya, Terima" : "Ya, Tolak"}
                onClose={() => setConfirmAction({ open: false, id: null, status: null })}
                onConfirm={handleVerify}
                loading={isProcessing}
            />
        </div>
    );
}
