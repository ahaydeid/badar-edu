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
        status: "DISETUJUI" | "DITOLAK" | null;
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
        verifikasi: "OTOMATIS" | "PENDING" | "DISETUJUI" | "DITOLAK" | null;
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
                showToast(`Absensi berhasil ${confirmAction.status === 'DISETUJUI' ? 'disetujui' : 'ditolak'}`);
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
            case 'OTOMATIS':
                return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">OTOMATIS</span>;
            case 'PENDING':
                return <span className="bg-yellow-400 text-white px-2 py-0.5 text-[10px] font-bold">PENDING</span>;
            case 'DISETUJUI':
                return <span className="bg-sky-100 text-sky-700 px-2 py-0.5 text-[10px] font-bold">DISETUJUI</span>;
            case 'DITOLAK':
                return <span className="bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-bold">DITOLAK</span>;
            default:
                return null;
        }
    };

    const renderStatus = (item: any) => {
        if (!item.jamMasuk) return <span className="text-red-500 font-bold uppercase">Belum Absen</span>;
        
        if (item.statusId === 5) {
            return <span className="text-red-500 font-bold uppercase">Terlambat</span>;
        }

        return <span className="text-green-600 font-bold uppercase">Hadir</span>;
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

                {/* Summary Section - Moved up */}
                {rows.filter(item => item.verifikasi === 'PENDING').length > 0 && (
                    <div className="p-4 bg-yellow-100 border border-yellow-100 rounded text-sm text-gray-800 animate-pulse">
                        <strong>Perhatian:</strong> Terdapat {rows.filter(item => item.verifikasi === 'PENDING').length} absensi yang memerlukan verifikasi manual.
                    </div>
                )}

                <div className="overflow-x-auto border border-gray-200 rounded bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-sky-100 text-gray-700 font-bold">
                            <tr className="text-center">
                                <th className="p-3 border-r border-white whitespace-nowrap">No</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Nama</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Mengajar</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Jadwal</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Absen Masuk</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Absen Pulang</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Status</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Jenis Absen</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Verifikasi</th>
                                <th className="p-3 border-r border-white whitespace-nowrap">Foto</th>
                                <th className="p-3 whitespace-nowrap">Aksi</th>
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
                                        <td className="p-3 text-center whitespace-nowrap">{idx + 1}</td>
                                        <td className="p-3 whitespace-nowrap">{item.nama}</td>
                                        <td className="p-3 whitespace-nowrap">{item.mapel}</td>
                                        <td className="p-3 text-center whitespace-nowrap">{item.jadwal}</td>
                                        <td className="p-3 text-center whitespace-nowrap">{item.jamMasuk ? item.jamMasuk.substring(0, 5) : "-"}</td>
                                        <td className="p-3 text-center whitespace-nowrap">{item.jamPulang ? item.jamPulang.substring(0, 5) : "-"}</td>
                                        <td className="p-3 text-center whitespace-nowrap">{renderStatus(item)}</td>
                                        <td className="p-3 text-center whitespace-nowrap">
                                            {item.jamMasuk ? (
                                                item.metodeAbsen === "geo" ? "LOKASI" : "RFID"
                                            ) : "-"}
                                        </td>
                                        <td className="p-3 text-center whitespace-nowrap">
                                            {renderVerifikasiBadge(item) || "-"}
                                        </td>
                                        <td className="p-3 text-center whitespace-nowrap">
                                            {item.foto ? (
                                                <img 
                                                    src={item.foto} 
                                                    alt="Foto Absen"
                                                    className="w-12 h-12 object-cover rounded border border-gray-300 mx-auto"
                                                />
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center whitespace-nowrap">
                                            <div className="flex justify-center items-center gap-2">
                                                {item.foto && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openModal(item)}
                                                        className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                                    >
                                                        Detail
                                                    </button>
                                                )}
                                                
                                                {item.jamMasuk && (
                                                    <>
                                                        {(item.verifikasi === 'PENDING' || item.verifikasi === 'OTOMATIS' || item.verifikasi === 'DITOLAK') && (
                                                            <button
                                                                onClick={() => setConfirmAction({ open: true, id: item.id, status: 'DISETUJUI' })}
                                                                className="px-3 py-2 bg-sky-600 text-white rounded text-sm hover:bg-sky-700"
                                                                title="Terima Absensi"
                                                            >
                                                                Terima
                                                            </button>
                                                        )}
                                                        {(item.verifikasi === 'PENDING' || item.verifikasi === 'OTOMATIS' || item.verifikasi === 'DISETUJUI') && (
                                                            <button
                                                                onClick={() => setConfirmAction({ open: true, id: item.id, status: 'DITOLAK' })}
                                                                className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                                                title="Tolak Absensi"
                                                            >
                                                                Tolak
                                                            </button>
                                                        )}
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
                variant={confirmAction.status === 'DITOLAK' ? 'danger' : 'primary'}
                title={confirmAction.status === 'DISETUJUI' ? "Terima Absensi" : "Tolak Absensi"}
                message={`Konfirmasi: Apakah Anda yakin ingin ${confirmAction.status === 'DISETUJUI' ? 'menerima' : 'menolak'} rekaman absensi ini?`}
                confirmText={confirmAction.status === 'DISETUJUI' ? "Ya, Terima" : "Ya, Tolak"}
                onClose={() => setConfirmAction({ open: false, id: null, status: null })}
                onConfirm={handleVerify}
                loading={isProcessing}
            />
        </div>
    );
}
