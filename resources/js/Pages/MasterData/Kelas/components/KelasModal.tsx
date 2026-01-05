import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { X, Save, AlertCircle } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    kelas?: any;
    jurusans: any[];
    gurus: any[];
};

export default function KelasModal({ isOpen, onClose, kelas, jurusans, gurus }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama: "",
        tingkat: 10,
        jurusan_id: "",
        wali_guru_id: "",
    });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (kelas) {
                setData({
                    nama: kelas.nama || "",
                    tingkat: kelas.tingkat || 10,
                    jurusan_id: kelas.jurusan_id || "",
                    wali_guru_id: kelas.wali_guru_id || "",
                });
            } else {
                // Reset to default values for create mode
                setData({
                    nama: "",
                    tingkat: 10,
                    jurusan_id: "",
                    wali_guru_id: "",
                });
            }
            clearErrors();
        }
    }, [kelas, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const handleClose = () => {
        reset();
        clearErrors();
        setIsConfirmOpen(false);
        onClose();
    };

    const confirmSubmit = () => {
        if (kelas) {
            put(`/master-data/rombel/${kelas.id}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setTimeout(() => {
                        reset();
                        onClose();
                    }, 100);
                },
            });
        } else {
            post("/master-data/rombel", {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setTimeout(() => {
                        reset();
                        onClose();
                    }, 100);
                },
            });
        }
    };


    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm shadow-xl transition-all duration-300">
                <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {kelas ? "Edit Kelas" : "Tambah Kelas"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {kelas ? "Perbarui informasi kelas yang ada." : "Lengkapi detail untuk menambahkan kelas baru."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nama Kelas */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Nama Kelas</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.nama ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    placeholder="Contoh: A"
                                    value={data.nama}
                                    onChange={(e) => setData("nama", e.target.value)}
                                />
                                {errors.nama && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.nama}
                                    </p>
                                )}
                            </div>

                            {/* Tingkat */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Tingkat</label>
                                <select
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.tingkat ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    value={data.tingkat}
                                    onChange={(e) => setData("tingkat", parseInt(e.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={11}>11</option>
                                    <option value={12}>12</option>
                                </select>
                                {errors.tingkat && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.tingkat}
                                    </p>
                                )}
                            </div>

                            {/* Jurusan */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Jurusan</label>
                                <select
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.jurusan_id ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    value={data.jurusan_id}
                                    onChange={(e) => setData("jurusan_id", e.target.value)}
                                >
                                    <option value="">Pilih Jurusan</option>
                                    {jurusans.map((j: any) => (
                                        <option key={j.id} value={j.id}>{j.nama}</option>
                                    ))}
                                </select>
                                {errors.jurusan_id && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.jurusan_id}
                                    </p>
                                )}
                            </div>

                            {/* Wali Kelas */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Wali Kelas (Opsional)</label>
                                <select
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.wali_guru_id ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    value={data.wali_guru_id}
                                    onChange={(e) => setData("wali_guru_id", e.target.value)}
                                >
                                    <option value="">Pilih Wali Kelas</option>
                                    {gurus.map((g: any) => (
                                        <option key={g.id} value={g.id}>{g.nama}</option>
                                    ))}
                                </select>
                                {errors.wali_guru_id && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.wali_guru_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 shadow transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? "Menyimpan..." : kelas ? "Perbarui" : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                message={kelas ? "Apakah Anda yakin ingin memperbarui kelas ini?" : "Apakah Anda yakin ingin menambahkan kelas baru?"}
                confirmText={kelas ? "Ya, Perbarui" : "Ya, Tambah"}
                loading={processing}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmSubmit}
            />
        </>
    );
}
