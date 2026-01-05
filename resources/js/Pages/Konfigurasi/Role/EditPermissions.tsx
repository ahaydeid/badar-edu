import { useState, useMemo } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import { ArrowLeft } from "lucide-react";
import { useForm } from "@inertiajs/react";
import PermissionTree from "@/Components/PermissionTree";

type Permission = { id: number; name: string };

type Props = {
    role: { id: number; name: string };
    allPermissions: Permission[];
    rolePermissions: Permission[];
};

export default function EditPermissions({
    role,
    allPermissions,
    rolePermissions,
}: Props) {
    const initialIds = useMemo(() => rolePermissions.map((p) => p.id), [rolePermissions]);

    const form = useForm<{ permissions: number[] }>({
        permissions: [],
    });

    const [selectedIds, setSelectedIds] = useState<number[]>(initialIds);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const handleToggleIds = (ids: number[], checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => {
                const unique = new Set([...prev, ...ids]);
                return Array.from(unique);
            });
        } else {
            setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
        }
    };

    const handleConfirmSave = () => {
        form.transform((data) => ({
            ...data,
            permissions: selectedIds,
        }));

        form.post(`/konfigurasi/role/${role.id}/permissions`, {
            onSuccess: () => {
                setConfirmOpen(false);
                setToastOpen(true);
                setTimeout(() => setToastOpen(false), 2000);
            },
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] px-6 pb-6 gap-4 max-w-4xl mx-auto w-full">
            <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex mb-2 cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900 self-start"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Hak Akses Role
                    </h1>
                     <p className="text-gray-500 text-sm mt-1">
                        Atur permission untuk role <span className="font-semibold text-gray-800 bg-gray-200 px-2 py-0.5 rounded">{role.name}</span>
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-white border border-gray-200 px-4 py-2 rounded">
                    <div className="text-sm font-medium text-gray-600">Terpilih:</div>
                    <div className="text-lg font-bold text-sky-700">{selectedIds.length} <span className="text-xs font-normal text-gray-400">items</span></div>
                </div>
            </div>

            {/* TREE CONTAINER */}
            <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded p-6">
                <PermissionTree 
                    allPermissions={allPermissions}
                    selectedIds={selectedIds}
                    onToggleIds={handleToggleIds}
                />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-2">
                <button
                    onClick={() => window.history.back()}
                    className="px-5 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                >
                    Batal
                </button>

                <button
                    onClick={() => setConfirmOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-sky-600 text-white text-sm hover:bg-sky-700 font-semibold shadow shadow-purple-200 hover:shadow-lg transition-all"
                >
                    Simpan Perubahan
                </button>
            </div>

            {/* CONFIRM */}
            <ConfirmDialog
                open={confirmOpen}
                message={`Anda akan menyimpan ${selectedIds.length} permission untuk role ${role.name}. Lanjutkan?`}
                confirmText="Ya, Simpan"
                loading={form.processing}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmSave}
            />

            {/* TOAST */}
            <Toast
                open={toastOpen}
                message="Hak akses berhasil diperbarui!"
                type="success"
            />
        </div>
    );
}
