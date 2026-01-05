import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { X, Save, AlertCircle } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    mapel?: any;
    gurus: any[];
    jurusans: any[];
};

export default function MapelModal({ isOpen, onClose, mapel, gurus, jurusans }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama: "",
        kode_mapel: "",
        kategori: "Wajib",
        tingkat: 10,
        jurusan_id: "",
        guru_id: "",
        warna_hex_mapel: "#0ea5e9",
    });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (mapel) {
            setData({
                nama: mapel.nama || "",
                kode_mapel: mapel.kode_mapel || "",
                kategori: mapel.kategori || "Wajib",
                tingkat: mapel.tingkat || 10,
                jurusan_id: mapel.jurusan_id || "",
                guru_id: mapel.guru_id || "",
                warna_hex_mapel: mapel.warna_hex_mapel || "#0ea5e9",
            });
        } else {
            reset();
        }
        clearErrors();
    }, [mapel, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const confirmSubmit = () => {
        if (mapel) {
            put(`/konfigurasi/mapel/${mapel.id}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    onClose();
                },
            });
        } else {
            post("/konfigurasi/mapel", {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    onClose();
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
                                {mapel ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {mapel ? "Perbarui informasi mata pelajaran yang ada." : "Lengkapi detail untuk menambahkan mata pelajaran baru."}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nama Mapel */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Nama Mata Pelajaran</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.nama ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    placeholder="Contoh: Matematika Gaje"
                                    value={data.nama}
                                    onChange={(e) => setData("nama", e.target.value)}
                                />
                                {errors.nama && (
                                    <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.nama}
                                    </p>
                                )}
                            </div>

                            {/* Kode Mapel */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Kode Mapel</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.kode_mapel ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium`}
                                    placeholder="MTK-10"
                                    value={data.kode_mapel}
                                    onChange={(e) => setData("kode_mapel", e.target.value)}
                                />
                                {errors.kode_mapel && <p className="text-xs text-red-500 ml-1">{errors.kode_mapel}</p>}
                            </div>

                            {/* Kategori */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Kategori</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium"
                                    value={data.kategori}
                                    onChange={(e) => setData("kategori", e.target.value)}
                                >
                                    <option value="Wajib">Wajib</option>
                                    <option value="Kejuruan">Kejuruan</option>
                                    <option value="Muatan Lokal">Muatan Lokal</option>
                                    <option value="Pilihan">Pilihan</option>
                                </select>
                            </div>

                            {/* Tingkat */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Tingkat</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium"
                                    value={data.tingkat}
                                    onChange={(e) => setData("tingkat", parseInt(e.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={11}>11</option>
                                    <option value={12}>12</option>
                                </select>
                            </div>

                            {/* Jurusan */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Jurusan (Opsional)</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium"
                                    value={data.jurusan_id || ""}
                                    onChange={(e) => setData("jurusan_id", e.target.value)}
                                >
                                    <option value="">Semua Jurusan</option>
                                    {jurusans.map((j) => (
                                        <option key={j.id} value={j.id}>{j.nama}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Guru Pengampu */}
                            <div className="md:col-span-2 space-y-1.5 border-t border-gray-100 pt-5 mt-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Guru Pengampu</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium"
                                    value={data.guru_id || ""}
                                    onChange={(e) => setData("guru_id", e.target.value)}
                                >
                                    <option value="">Pilih Guru Pengampu</option>
                                    {gurus.map((g) => (
                                        <option key={g.id} value={g.id}>{g.nama}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Warna Mapel */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 ml-1">Warna Identitas</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        className="w-12 h-11 p-1 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all cursor-pointer shadow-sm"
                                        value={data.warna_hex_mapel}
                                        onChange={(e) => setData("warna_hex_mapel", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        maxLength={7}
                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all font-mono text-sm"
                                        value={data.warna_hex_mapel}
                                        onChange={(e) => setData("warna_hex_mapel", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer / Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-8 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? "Menyimpan..." : (mapel ? "Simpan Perubahan" : "Tambah Mapel")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmSubmit}
                title={mapel ? "Konfirmasi Perubahan" : "Konfirmasi Tambah Mapel"}
                message={mapel ? "Apakah Anda yakin ingin menyimpan perubahan data mata pelajaran ini?" : "Apakah Anda yakin ingin menambahkan mata pelajaran baru ini?"}
                confirmText="Ya, Simpan"
                cancelText="Batal"
            />
        </>
    );
}
