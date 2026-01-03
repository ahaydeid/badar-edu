import { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";

interface Role {
    id: number;
    name: string;
}

interface Props {
    pengumuman?: any;
    roles: Role[];
    isEdit?: boolean;
}

export default function PengumumanForm({ pengumuman, roles, isEdit = false }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toast, setToast] = useState({ open: false, message: "", type: "success" as "success" | "error" });

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "PUT" : "POST",
        judul: pengumuman?.judul || "",
        isi: pengumuman?.isi || "",
        gambar: null as File | null,
        tanggal_mulai: pengumuman?.tanggal_mulai?.split("T")[0] || "",
        tanggal_selesai: pengumuman?.tanggal_selesai?.split("T")[0] || "",
        is_active: isEdit ? !!pengumuman.is_active : true,
        role_ids: pengumuman?.roles?.map((r: any) => r.id) || [] as number[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        setConfirmOpen(false);
        const url = isEdit ? `/pengumuman/${pengumuman.id}` : "/pengumuman";
        
        post(url, {
            onSuccess: () => {
                setToast({
                    open: true,
                    message: isEdit ? "Pengumuman berhasil diperbarui!" : "Pengumuman berhasil ditambahkan!",
                    type: "success",
                });
                setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 3000);
            },
            onError: () => {
                setToast({
                    open: true,
                    message: "Terjadi kesalahan. Silakan periksa kembali formulir Anda.",
                    type: "error",
                });
                setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 3000);
            },
        });
    };

    const handleRoleToggle = (roleId: number) => {
        const id = Number(roleId);
        if (data.role_ids.includes(id)) {
            setData("role_ids", data.role_ids.filter((i: number) => i !== id));
        } else {
            setData("role_ids", [...data.role_ids, id]);
        }
    };

    return (
        <div className="p-6">
            <Head title={isEdit ? "Edit Pengumuman" : "Tambah Pengumuman"} />

            <div className="mb-6 flex flex-col gap-4">
                <Link
                    href="/pengumuman"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-600 w-fit"
                >
                    <ArrowLeft size={18} />
                    <span>Kembali</span>
                </Link>
                <h2 className="font-bold text-3xl text-gray-800">
                    {isEdit ? "Edit Pengumuman" : "Tambah Pengumuman"}
                </h2>
            </div>

            <div className="bg-white border border-gray-200 rounded p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Pengumuman</label>
                            <input
                                type="text"
                                value={data.judul}
                                onChange={(e) => setData("judul", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-sm focus:border-sky-500"
                                placeholder="Masukkan judul..."
                            />
                            {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                            <button
                                type="button"
                                onClick={() => setData("is_active", !data.is_active)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                    data.is_active ? "bg-sky-600" : "bg-gray-200"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                                        data.is_active ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                            </button>
                            <span className="text-[10px] mt-1 text-gray-500 font-medium uppercase tracking-wider">
                                {data.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Isi Pengumuman</label>
                        <textarea
                            rows={6}
                            value={data.isi}
                            onChange={(e) => setData("isi", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-sm focus:border-sky-500"
                            placeholder="Masukkan isi pengumuman..."
                        />
                        {errors.isi && <p className="text-red-500 text-xs mt-1">{errors.isi}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Target Role (Kosongkan jika untuk Semua)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 border border-gray-200 rounded">
                            {roles.map((role) => (
                                <label key={role.id} className="flex items-center gap-3 cursor-pointer text-sm py-1 group">
                                    <input
                                        type="checkbox"
                                        checked={data.role_ids.includes(role.id)}
                                        onChange={() => handleRoleToggle(role.id)}
                                        className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                    />
                                    <span className="text-gray-700">
                                        {role.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={data.tanggal_mulai}
                                onChange={(e) => setData("tanggal_mulai", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-sm focus:border-sky-500"
                            />
                            {errors.tanggal_mulai && <p className="text-red-500 text-xs mt-1">{errors.tanggal_mulai}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Selesai</label>
                            <input
                                type="date"
                                value={data.tanggal_selesai}
                                onChange={(e) => setData("tanggal_selesai", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-sm focus:border-sky-500"
                            />
                            {errors.tanggal_selesai && <p className="text-red-500 text-xs mt-1">{errors.tanggal_selesai}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Gambar (Opsional)</label>
                        {isEdit && pengumuman?.gambar && (
                           <div className="mb-2 text-xs text-sky-600 italic">Gambar saat ini: {pengumuman.gambar}</div>
                        )}
                        <input
                            type="file"
                            onChange={(e) => setData("gambar", e.target.files ? e.target.files[0] : null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer border border-gray-200 rounded p-1"
                        />
                        {errors.gambar && <p className="text-red-500 text-xs mt-1">{errors.gambar}</p>}
                    </div>

                    <div className="pt-6 border-t border-gray-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-2.5 rounded font-bold disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? "Menyimpan..." : isEdit ? "Update Pengumuman" : "Simpan Pengumuman"}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmSubmit}
                title={isEdit ? "Simpan Perubahan?" : "Tambah Pengumuman?"}
                message={isEdit 
                    ? "Apakah Anda yakin ingin menyimpan perubahan pada pengumuman ini?" 
                    : "Apakah Anda yakin ingin menambahkan pengumuman baru ini?"
                }
                confirmText={isEdit ? "Ya, Simpan" : "Ya, Tambahkan"}
                loading={processing}
            />

            <Toast 
                open={toast.open} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
}
