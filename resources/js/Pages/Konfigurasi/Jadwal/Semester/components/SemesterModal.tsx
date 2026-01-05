import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { X, Save, AlertCircle } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    semester?: any;
};

export default function SemesterModal({ isOpen, onClose, semester }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama: "",
        tipe: "GANJIL",
        tahun_ajaran_dari: new Date().getFullYear(),
        tahun_ajaran_sampai: new Date().getFullYear() + 1,
        tanggal_mulai: "",
        tanggal_selesai: "",
    });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (semester) {
                setData({
                    nama: semester.nama || "",
                    tipe: semester.tipe || "GANJIL",
                    tahun_ajaran_dari: semester.tahun_ajaran_dari || new Date().getFullYear(),
                    tahun_ajaran_sampai: semester.tahun_ajaran_sampai || new Date().getFullYear() + 1,
                    tanggal_mulai: semester.tanggal_mulai || "",
                    tanggal_selesai: semester.tanggal_selesai || "",
                });
            } else {
                // Reset to default values for create mode
                setData({
                    nama: "",
                    tipe: "GANJIL",
                    tahun_ajaran_dari: new Date().getFullYear(),
                    tahun_ajaran_sampai: new Date().getFullYear() + 1,
                    tanggal_mulai: "",
                    tanggal_selesai: "",
                });
            }
            clearErrors();
        }
    }, [semester, isOpen]);

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
        if (semester) {
            put(`/konfigurasi/jadwal/semester/${semester.id}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setTimeout(() => {
                        reset();
                        onClose();
                    }, 100);
                },
            });
        } else {
            post("/konfigurasi/jadwal/semester", {
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
                <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {semester ? "Edit Semester" : "Tambah Semester"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {semester ? "Perbarui informasi semester yang ada." : "Lengkapi detail untuk menambahkan semester baru."}
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
                            {/* Nama Semester */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Nama Semester</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.nama ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    placeholder="Contoh: Semester Ganjil 2025/2026"
                                    value={data.nama}
                                    onChange={(e) => setData("nama", e.target.value)}
                                />
                                {errors.nama && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.nama}
                                    </p>
                                )}
                            </div>

                            {/* Tipe */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Tipe</label>
                                <select
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.tipe ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    value={data.tipe}
                                    onChange={(e) => setData("tipe", e.target.value)}
                                >
                                    <option value="GANJIL">GANJIL</option>
                                    <option value="GENAP">GENAP</option>
                                </select>
                                {errors.tipe && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.tipe}
                                    </p>
                                )}
                            </div>

                            {/* Tahun Ajaran Dari */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Tahun Ajaran Dari</label>
                                <input
                                    type="number"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.tahun_ajaran_dari ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    placeholder="2025"
                                    value={data.tahun_ajaran_dari}
                                    onChange={(e) => setData("tahun_ajaran_dari", parseInt(e.target.value))}
                                />
                                {errors.tahun_ajaran_dari && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.tahun_ajaran_dari}
                                    </p>
                                )}
                            </div>

                            {/* Tahun Ajaran Sampai */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Tahun Ajaran Sampai</label>
                                <input
                                    type="number"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.tahun_ajaran_sampai ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    placeholder="2026"
                                    value={data.tahun_ajaran_sampai}
                                    onChange={(e) => setData("tahun_ajaran_sampai", parseInt(e.target.value))}
                                />
                                {errors.tahun_ajaran_sampai && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.tahun_ajaran_sampai}
                                    </p>
                                )}
                            </div>

                            {/* Tanggal Mulai */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.tanggal_mulai ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData("tanggal_mulai", e.target.value)}
                                />
                                {errors.tanggal_mulai && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.tanggal_mulai}
                                    </p>
                                )}
                            </div>

                            {/* Tanggal Selesai */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.tanggal_selesai ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData("tanggal_selesai", e.target.value)}
                                />
                                {errors.tanggal_selesai && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.tanggal_selesai}
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
                                {processing ? "Menyimpan..." : semester ? "Perbarui" : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                message={semester ? "Apakah Anda yakin ingin memperbarui semester ini?" : "Apakah Anda yakin ingin menambahkan semester baru?"}
                confirmText={semester ? "Ya, Perbarui" : "Ya, Tambah"}
                loading={processing}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmSubmit}
            />
        </>
    );
}
