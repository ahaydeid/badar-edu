import { useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";

type Jurusan = {
    id: number;
    nama: string;
    kuota: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    editData?: any; // Add editData prop
    allJurusans: { id: number; nama: string; kode: string }[];
};

export default function TambahPPDBModal({ open, onClose, editData, allJurusans }: Props) {
    const { data, setData, reset, errors } = useForm({
        tahun_ajaran: "2025/2026",
        status: "Draft",
        gelombang: "Gelombang 1",
        start_date: "",
        end_date: "",
        committee_name: "",
        jurusans: allJurusans.map(j => ({
            id: j.id,
            nama: `${j.nama} (${j.kode})`,
            kuota: 60 // Default Value
        })),
    });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [processing, setProcessing] = useState(false); // Manual processing state

    useEffect(() => {
        if (open) {
            if (editData) {
                // When editing, we want to show existing quotas.
                // But we also want to include any NEW jurusans that might have been added to the system since the period was created, 
                // initialized with 0 or default quota?
                // For simplicity, let's just use editData.jurusans if valid, otherwise fallback to allJurusans.
                // A better approach: Merge allJurusans with editData.jurusans values.
                
                const mergedJurusans = allJurusans.map(refApi => {
                    const existing = editData.jurusans.find((e: any) => e.id === refApi.id);
                    return {
                        id: refApi.id,
                        nama: `${refApi.nama} (${refApi.kode})`,
                        kuota: existing ? existing.kuota : 0 // Use existing quota or 0 if not previously attached
                    };
                });

                setData({
                    tahun_ajaran: editData.tahun_ajaran,
                    status: editData.status,
                    gelombang: editData.gelombang,
                    start_date: editData.start_date,
                    end_date: editData.end_date,
                    committee_name: editData.committee_name,
                    jurusans: mergedJurusans
                });
            } else {
                // Reset for add mode
                 setData({
                    tahun_ajaran: "2025/2026",
                    status: "Draft",
                    gelombang: "Gelombang 1",
                    start_date: "",
                    end_date: "",
                    committee_name: "",
                    jurusans: allJurusans.map(j => ({
                        id: j.id,
                        nama: `${j.nama} (${j.kode})`,
                        kuota: 60 
                    })),
                });
            }
        }
    }, [open, editData, allJurusans]);

    const handleSave = () => {
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        setConfirmOpen(false);
        setProcessing(true);

        try {
            const baseUrl = "/ppdb/pengaturan";
            const url = editData?.id 
                ? `${baseUrl}/${editData.id}`
                : baseUrl;
            
            const method = editData?.id ? 'PUT' : 'POST';

            console.log("Submitting to:", url, "Method:", method);

            router.post(url, {
                ...data,
                _method: method
            }, {
                forceFormData: true,
                onSuccess: () => {
                    // setProcessing(false); // Handled by onFinish
                    setToastMessage(editData ? "Periode PPDB berhasil diperbarui!" : "Periode PPDB berhasil dibuat!");
                    setToastType("success");
                    setToastOpen(true);
                    setTimeout(() => {
                        reset();
                        onClose();
                    }, 1500); 
                },
                onError: (err) => {
                    // setProcessing(false); // Handled by onFinish
                    console.error("Submission Error:", err);
                    const errorMsg = Object.values(err).flat().join(", ") || "Gagal menyimpan. Periksa inputan Anda.";
                    setToastMessage(errorMsg);
                    setToastType("error");
                    setToastOpen(true);
                },
                onFinish: () => {
                    setProcessing(false);
                }
            });
        } catch (e: any) {
            setProcessing(false);
            alert("Terjadi kesalahan sistem: " + e.message);
            console.error(e);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl border border-gray-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div>
                            <h2 className="text-lg font-semibold">{editData ? 'Edit Periode PPDB' : 'Tambah PPDB'}</h2>
                            <p className="text-sm text-gray-500">
                                Membuka periode PPDB baru
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-4">
                                <label className="text-xs text-gray-500">
                                    Tahun Ajaran
                                </label>
                                <select
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    value={data.tahun_ajaran}
                                    onChange={(e) => setData("tahun_ajaran", e.target.value)}
                                >
                                    <option value="2025/2026">2025/2026</option>
                                    <option value="2026/2027">2026/2027</option>
                                    <option value="2027/2028">2027/2028</option>
                                </select>
                                {errors.tahun_ajaran && <p className="text-red-500 text-xs">{errors.tahun_ajaran}</p>}
                            </div>

                            <div className="col-span-12 md:col-span-3">
                                <label className="text-xs text-gray-500">
                                    Status
                                </label>
                                <select
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Aktif">Aktif (Dibuka)</option>
                                    <option value="Selesai">Ditutup (Selesai)</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
                            </div>

                             <div className="col-span-12 md:col-span-5">
                                <label className="text-xs text-gray-500 font-bold text-blue-600">
                                    Ketua Panitia PPDB (Utk Tanda Tangan)
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="Contoh: Drs. H. Ahmad Fauzi, M.Pd"
                                    value={data.committee_name}
                                    onChange={(e) => setData("committee_name", e.target.value)}
                                />
                                {errors.committee_name && <p className="text-red-500 text-xs">{errors.committee_name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-4">
                                <label className="text-xs text-gray-500">
                                    Gelombang
                                </label>
                                <select
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    value={data.gelombang}
                                    onChange={(e) => setData("gelombang", e.target.value)}
                                >
                                    <option value="Gelombang 1">Gelombang 1</option>
                                    <option value="Gelombang 2">Gelombang 2</option>
                                    <option value="Gelombang 3">Gelombang 3</option>
                                </select>
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                <label className="text-xs text-gray-500">
                                    Periode Mulai
                                </label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    value={data.start_date}
                                    onChange={(e) => setData("start_date", e.target.value)}
                                />
                                {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date}</p>}
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                <label className="text-xs text-gray-500">
                                    Periode Selesai
                                </label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    value={data.end_date}
                                    onChange={(e) => setData("end_date", e.target.value)}
                                />
                                {errors.end_date && <p className="text-red-500 text-xs">{errors.end_date}</p>}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Jurusan & Kuota
                            </h3>
                            <div className="rounded-md border border-gray-200 divide-y divide-gray-200">
                                {data.jurusans.map((j, index) => (
                                    <div
                                        key={j.id}
                                        className="flex items-center justify-between px-4 py-3"
                                    >
                                        <span className="text-sm">{j.nama}</span>
                                        <input
                                            type="number"
                                            className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm text-right"
                                            value={j.kuota}
                                            onChange={(e) => {
                                                const newJurusans = [...data.jurusans];
                                                newJurusans[index].kuota = Number(e.target.value);
                                                setData("jurusans", newJurusans);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <button
                            onClick={onClose}
                            disabled={processing}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={processing}
                            className="rounded-md cursor-pointer bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? "Menyimpan..." : (editData ? "Simpan Perubahan" : "Simpan & Buka PPDB")}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                title={editData ? "Simpan Perubahan?" : "Buka PPDB Baru?"}
                message={editData ? "Apakah Anda yakin ingin memperbarui data periode PPDB ini?" : "Apakah Anda yakin data PPDB sudah benar? Periode akan segera dibuka."}
            />

            <Toast
                open={toastOpen}
                message={toastMessage}
                type={toastType}
            />
        </>
    );
}
