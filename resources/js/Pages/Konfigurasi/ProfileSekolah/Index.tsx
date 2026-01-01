import { Head, useForm, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";

type Props = {
    settings: {
        school_name?: string;
        school_address?: string;
        school_phone?: string;
        school_logo?: string;
        kop_surat_title?: string;
    };
};

export default function ProfileSekolah({ settings }: Props) {
    const { data, setData, processing, errors } = useForm({
        school_name: settings.school_name || "",
        school_address: settings.school_address || "",
        school_phone: settings.school_phone || "",
        school_logo: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(settings.school_logo || null);
    
    // UI States
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType("success");
            setToastOpen(true);
            setTimeout(() => setToastOpen(false), 2000);
        }
        if (flash?.error) {
            setToastMessage(flash.error);
            setToastType("error");
            setToastOpen(true);
            setTimeout(() => setToastOpen(false), 2000);
        }
    }, [flash]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        setConfirmOpen(false);
        
        router.post('/konfigurasi/profile-sekolah', {
            _method: 'post',
            ...data,
        }, {
            forceFormData: true,
            onSuccess: () => {
                setToastMessage("Berhasil menyimpan perubahan.");
                setToastType("success");
                setToastOpen(true);
                setTimeout(() => setToastOpen(false), 3000);
            },
            onError: (err) => {
                console.error(err);
                setToastMessage("Gagal menyimpan. Periksa input.");
                setToastType("error");
                setToastOpen(true);
                setTimeout(() => setToastOpen(false), 3000);
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData("school_logo", e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Head title="Profil Sekolah" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-800">Profil Sekolah</h1>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* LOGO */}
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                            {preview ? (
                                <img src={preview} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-xs text-center p-2">No Logo</span>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-s file:text-gray-700 hover:file:bg-gray-100"
                            />
                            {errors.school_logo && <p className="text-red-500 text-xs">{errors.school_logo}</p>}
                        </div>
                    </div>

                    {/* FORM INPUTS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Nama Sekolah</label>
                            <input
                                type="text"
                                value={data.school_name}
                                onChange={(e) => setData("school_name", e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-sky-500 focus:border-sky-500"
                            />
                            {errors.school_name && <p className="text-red-500 text-xs">{errors.school_name}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Telepon / Website</label>
                            <input
                                type="text"
                                value={data.school_phone}
                                onChange={(e) => setData("school_phone", e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-sky-500 focus:border-sky-500"
                            />
                            {errors.school_phone && <p className="text-red-500 text-xs">{errors.school_phone}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                            <textarea
                                value={data.school_address}
                                onChange={(e) => setData("school_address", e.target.value)}
                                rows={3}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-sky-500 focus:border-sky-500"
                            />
                            {errors.school_address && <p className="text-red-500 text-xs">{errors.school_address}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-sky-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-sky-700 transition disabled:opacity-50"
                        >
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title="Simpan Perubahan?"
                message="Apakah Anda yakin ingin menyimpan perubahan pada profil sekolah ini?"
                confirmText="Ya, Simpan"
                onConfirm={handleConfirm}
                onClose={() => setConfirmOpen(false)}
                loading={processing}
            />

            <Toast open={toastOpen} message={toastMessage} type={toastType} />
        </div>
    );
}
