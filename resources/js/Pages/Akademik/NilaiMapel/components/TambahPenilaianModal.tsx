import { X } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

type Props = {
    open: boolean;
    mode: "baru" | "sub" | null;
    penilaianId?: number | null;
    kelasId?: number;
    mapelId?: number;
    onClose: () => void;
};

export default function TambahPenilaianModal({
    open,
    mode,
    penilaianId,
    kelasId,
    mapelId,
    onClose,
}: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        kelas_id: kelasId || '', 
        mapel_id: mapelId || '',
        jenis_penilaian_id: penilaianId || '',
        nama: "",
        has_sub: false, // Default non-aktif
    });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Reset when modal opens/changes
    useEffect(() => {
        if (open) {
            setData({
                kelas_id: kelasId || '',
                mapel_id: mapelId || '',
                jenis_penilaian_id: penilaianId || '',
                nama: "",
                has_sub: false,
            });
            setIsConfirmOpen(false);
        }
    }, [open, kelasId, mapelId, penilaianId]);

    if (!open || !mode) return null;

    const title = mode === "baru" ? "Penilaian Baru" : "Sub Nilai";

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const confirmSubmit = () => {
        if (mode === "baru") {
            post('/penilaian', {
                onSuccess: () => {
                    reset();
                    onClose();
                    setIsConfirmOpen(false);
                },
                onError: () => setIsConfirmOpen(false)
            });
        } else {
             post('/penilaian/sub', {
                onSuccess: () => {
                    reset();
                    onClose();
                    setIsConfirmOpen(false);
                },
                onError: () => setIsConfirmOpen(false)
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h2 className="text-sm font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4 text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-4 text-sm">
                        
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 p-3 rounded-md text-red-600 text-xs mb-3">
                                <p className="font-semibold mb-1">Gagal Menyimpan:</p>
                                <ul className="list-disc pl-4">
                                    {Object.entries(errors).map(([key, msg]) => (
                                        <li key={key}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {mode === "baru" && (
                            <>
                                <div>
                                    <label className="text-xs text-gray-500">
                                        Nama Penilaian
                                    </label>
                                    <input
                                        autoFocus
                                        value={data.nama}
                                        onChange={e => setData('nama', e.target.value)}
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                                        placeholder="Contoh: Tugas Mandiri"
                                    />
                                    {errors.nama && <div className="text-red-500 text-xs mt-1">{errors.nama}</div>}
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <label className="text-sm font-medium text-gray-700">Gunakan Sub Nilai</label>
                                        <p className="text-xs text-gray-500">Aktifkan jika penilaian ini memiliki beberapa rincian nilai <br/> yang akan diambil rata-ratanya.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('has_sub', !data.has_sub)}
                                        className={`${
                                            data.has_sub ? 'bg-blue-600' : 'bg-gray-200'
                                        } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                                    >
                                        <span
                                            className={`${
                                                data.has_sub ? 'translate-x-5' : 'translate-x-0'
                                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                        />
                                    </button>
                                </div>
                            </>
                        )}

                        {mode === "sub" && (
                            <div>
                                <label className="text-xs text-gray-500">
                                    Nama Sub Nilai
                                </label>
                                <input
                                    autoFocus
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                                    placeholder="Contoh: Membuat Halaman Responsif"
                                />
                                {errors.nama && <div className="text-red-500 text-xs mt-1">{errors.nama}</div>}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button 
                            disabled={processing}
                            type="submit" 
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                title={mode === "baru" ? "Simpan Penilaian?" : "Simpan Sub Nilai?"}
                message="Pastikan data sudah benar sebelum menyimpan."
                confirmText={processing ? "Menyimpan..." : "Ya, Simpan"}
                cancelText="Batal"
                loading={processing}
                onConfirm={confirmSubmit}
                onClose={() => setIsConfirmOpen(false)}
            />
        </div>
    );
}
