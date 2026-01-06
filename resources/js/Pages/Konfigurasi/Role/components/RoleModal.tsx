import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { X } from "lucide-react";
import PermissionTree from "@/Components/PermissionTree";

type Permission = { id: number; name: string };

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function RoleModal({ isOpen, onClose }: Props) {
    const { allPermissions } = usePage<any>().props;
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        permissions: [] as number[],
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen]);

    const handleToggleIds = (ids: number[], checked: boolean) => {
        if (checked) {
            const unique = new Set([...data.permissions, ...ids]);
            setData('permissions', Array.from(unique));
        } else {
            setData('permissions', data.permissions.filter(id => !ids.includes(id)));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/konfigurasi/role", {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Tambah Role Baru</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Atur nama dan permission sekaligus</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-6 space-y-4 border-b">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Role</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="contoh: kurikulum"
                                className={`w-full px-4 py-2 rounded-xl border transition-all focus:ring-2 focus:ring-sky-500/20 outline-none ${
                                    errors.name ? "border-red-500" : "border-gray-200"
                                }`}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div className="flex items-center gap-3 bg-sky-50 border border-sky-200 px-3 py-2 rounded-lg">
                            <div className="text-xs font-medium text-sky-700">Terpilih:</div>
                            <div className="text-sm font-bold text-sky-700">{data.permissions.length} <span className="text-xs font-normal">permissions</span></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <PermissionTree 
                            allPermissions={allPermissions}
                            selectedIds={data.permissions}
                            onToggleIds={handleToggleIds}
                        />
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-sky-600 text-white text-sm font-bold rounded-lg hover:bg-sky-700 transition-all shadow active:scale-95 disabled:opacity-50"
                        >
                            {processing ? "Menyimpan..." : "Simpan Role"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
