import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

interface Location {
    id: number;
    nama: string;
    latitude: number;
    longitude: number;
    radius: number;
    is_active: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editData: Location | null;
    showToast: (message: string, type?: "success" | "error") => void;
}

export default function TitikAbsenModal({ isOpen, onClose, editData, showToast }: Props) {
    const [confirmSave, setConfirmSave] = useState(false);

    const { data, setData, post, patch, processing, reset, errors } = useForm({
        nama: "",
        latitude: "",
        longitude: "",
        radius: 100,
        is_active: true,
    });

    useEffect(() => {
        if (editData) {
            setData({
                nama: editData.nama,
                latitude: editData.latitude.toString(),
                longitude: editData.longitude.toString(),
                radius: editData.radius,
                is_active: editData.is_active,
            });
        } else {
            reset();
        }
    }, [editData]);

    const handleConfirmSave = (e: React.FormEvent) => {
        e.preventDefault();
        setConfirmSave(true);
    };

    const submit = () => {
        const url = "/konfigurasi/titik-absen";
        setConfirmSave(false);
        
        if (editData) {
            patch(`${url}/${editData.id}`, {
                onSuccess: () => {
                    onClose();
                    showToast("Lokasi berhasil diperbarui");
                },
                onError: () => showToast("Gagal memperbarui lokasi", "error")
            });
        } else {
            post(url, {
                onSuccess: () => {
                    onClose();
                    showToast("Lokasi berhasil ditambahkan");
                    reset();
                },
                onError: () => showToast("Gagal menambahkan lokasi", "error")
            });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">
                            {editData ? "Edit Titik Absen" : "Tambah Titik Absen"}
                        </h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
                    </div>

                    <form onSubmit={handleConfirmSave} className="p-6 space-y-6">
                        {/* Warning: Single Location Policy */}
                        {data.is_active && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <p className="text-sm text-yellow-800">
                                    <strong>⚠️ Perhatian:</strong> Hanya 1 titik absen yang dapat aktif pada satu waktu.
                                    Mengaktifkan titik ini akan menonaktifkan titik lain secara otomatis.
                                </p>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lokasi</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                                    placeholder="Contoh: Gedung Utama SMK"
                                    value={data.nama}
                                    onChange={e => setData("nama", e.target.value)}
                                    required
                                />
                                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Latitude</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                                    placeholder="-6.123456"
                                    value={data.latitude}
                                    onChange={e => setData("latitude", e.target.value)}
                                    required
                                />
                                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Longitude</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                                    placeholder="106.123456"
                                    value={data.longitude}
                                    onChange={e => setData("longitude", e.target.value)}
                                    required
                                />
                                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Radius (Meter)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                                    value={data.radius}
                                    onChange={e => setData("radius", parseInt(e.target.value))}
                                    required
                                />
                                {errors.radius && <p className="text-red-500 text-xs mt-1">{errors.radius}</p>}
                            </div>

                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={data.is_active}
                                            onChange={e => setData("is_active", e.target.checked)}
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors ${data.is_active ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${data.is_active ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Status Aktif</span>
                                </label>
                            </div>
                        </div>

                        {/* Preview Map */}
                        {data.latitude && data.longitude && (
                            <div className="h-48 rounded overflow-hidden border border-slate-200">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.google.com/maps?q=${data.latitude},${data.longitude}&hl=id;z=16&output=embed`}
                                ></iframe>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded font-bold transition-all cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-[2] bg-sky-600 hover:bg-sky-700 text-white py-2 rounded font-bold hover:shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
                            >
                                {processing && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                                {editData ? "Simpan Perubahan" : "Simpan Lokasi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmDialog
                open={confirmSave}
                variant="primary"
                title={editData ? "Simpan Perubahan" : "Tambah Lokasi"}
                message={editData ? "Apakah Anda yakin ingin menyimpan perubahan pada lokasi ini?" : "Apakah Anda yakin ingin menambahkan lokasi baru ini?"}
                confirmText="Ya, Simpan"
                onClose={() => setConfirmSave(false)}
                onConfirm={submit}
                loading={processing}
            />
        </>
    );
}
