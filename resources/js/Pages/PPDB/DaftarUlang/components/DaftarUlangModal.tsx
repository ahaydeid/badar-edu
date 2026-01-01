import { Fragment, useState } from "react";
import { Printer } from "lucide-react";
import { router } from "@inertiajs/react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";

type DaftarUlang = {
    id: number;
    no_pendaftaran: string;
    nama: string;
    jurusan: string;
    asal_sekolah: string;
};

type Props = {
    open: boolean;
    data: DaftarUlang | null;
    onClose: () => void;
    onSuccess: (message: string, type: "success" | "error") => void;
};

export default function DaftarUlangModal({ open, data, onClose, onSuccess }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        type: "success" as "success" | "error"
    });

    const showToast = (message: string, type: "success" | "error") => {
        setToastState({ open: true, message, type });
        setTimeout(() => setToastState(p => ({ ...p, open: false })), 3000);
        if (onSuccess) {
            onSuccess(message, type);
        }
    };

    if (!open || !data) return null;

    const handleComplete = () => {
        router.put(`/ppdb/daftar-ulang/${data.id}/complete`, {}, {
            onSuccess: () => {
                showToast("Berhasil menyelesaikan daftar ulang!", "success");
                setTimeout(() => {
                   onClose();
                }, 2000);
                setConfirmOpen(false);
            },
            onError: () => {
                showToast("Gagal memproses data. Silakan coba lagi.", "error");
                setConfirmOpen(false);
            }
        });
    };

    return (
        <Fragment>
            <Toast 
                open={toastState.open}
                message={toastState.message}
                type={toastState.type}
            />
            {/* ... modal content ... */}
            <div className="fixed inset-0 z-9999 bg-black/40" />
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl rounded-md bg-white border border-gray-300">
                    {/* HEADER */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <div>
                            <h2 className="text-sm font-semibold">
                                Daftar Ulang
                            </h2>
                            <p className="text-xs text-gray-500">
                                Finalisasi penerimaan siswa
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Tutup
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-4 text-sm">
                        {/* BIODATA */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-xs text-gray-500">
                                    Nama
                                </div>
                                <div className="font-medium">{data.nama}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Jurusan
                                </div>
                                <div className="truncate">{data.jurusan}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    No Pendaftaran
                                </div>
                                <div className="font-mono">{data.no_pendaftaran}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Asal Sekolah
                                </div>
                                <div className="truncate">{data.asal_sekolah}</div>
                            </div>
                        </div>

                        {/* DOKUMEN */}
                        <div className="border-t border-gray-200 pt-3">
                            <div className="mb-2 text-sm font-medium">
                                Checklist Dokumen
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "Ijazah / SKL",
                                    "SKHU / Nilai",
                                    "Akta Kelahiran",
                                    "Kartu Keluarga",
                                    "Pas Foto",
                                ].map((item) => (
                                    <label
                                        key={item}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 transform scale-90"
                                        />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* BIAYA */}
                        <div className="border-t border-gray-200 pt-3 space-y-2">
                            <div className="text-sm font-medium">
                                Verifikasi Biaya
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="biaya"
                                        className="border-gray-300"
                                    />
                                    Belum Bayar
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="biaya"
                                        className="border-gray-300"
                                    />
                                    Lunas
                                </label>
                            </div>
                            <textarea
                                className="w-full rounded-sm border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Catatan admin (opsional)"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex gap-2">
                             <button 
                                onClick={() => window.open(`/ppdb/cetak/${data.id}`, '_blank')}
                                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Printer size={16} /> Bukti
                             </button>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => setConfirmOpen(true)}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-700 transition-colors">
                                Selesaikan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title="Selesaikan Daftar Ulang?"
                message="Status siswa akan berubah menjadi 'Siswa Baru' dan data akan siap untuk dimigrasi. Tindakan ini tidak dapat dibatalkan."
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleComplete}
                confirmText="Ya, Selesaikan"
                cancelText="Batal"
            />
        </Fragment>
    );
}
