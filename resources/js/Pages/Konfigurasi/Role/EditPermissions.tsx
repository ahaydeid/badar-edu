import { useState } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import { ArrowLeft } from "lucide-react";
import { useForm } from "@inertiajs/react";

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
    const initialIds = rolePermissions.map((p) => p.id);

    const form = useForm<{ permissions: number[] }>({
        permissions: [],
    });

    const [selectedRight, setSelectedRight] = useState<number[]>(initialIds);
    const [removedLeft, setRemovedLeft] = useState<number[]>([]);
    const [search, setSearch] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const handleRightToggle = (id: number) => {
        if (initialIds.includes(id)) {
            setRemovedLeft((prev) =>
                prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
            );
            return;
        }
        setSelectedRight((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const leftPermissionIds = Array.from(
        new Set([...initialIds, ...selectedRight])
    );

    const filteredPermissions = allPermissions.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleConfirmSave = () => {
        const originalStillActive = initialIds.filter(
            (id) => !removedLeft.includes(id)
        );

        const newlyAdded = selectedRight.filter(
            (id) => !initialIds.includes(id)
        );

        const finalPermissions = [...originalStillActive, ...newlyAdded];

        form.setData("permissions", finalPermissions);

        form.post(`/konfigurasi/role/${role.id}/permissions`, {
            onSuccess: () => {
                setConfirmOpen(false);
                setToastOpen(true);
                setTimeout(() => setToastOpen(false), 2000);
            },
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] px-6 pb-6 gap-4">
            <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex mb-6 cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali
            </button>
            <h1 className="text-xl font-semibold">
                Edit Permission Role: {role.name}
            </h1>

            {/* CONTENT */}
            <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
                {/* LEFT */}
                <div className="border rounded p-4 flex flex-col overflow-hidden">
                    <h2 className="font-medium mb-3">Role Permissions</h2>
                    <div className="space-y-2 overflow-y-auto pr-2">
                        {leftPermissionIds.map((id) => {
                            const p = allPermissions.find((x) => x.id === id)!;
                            const isOriginal = initialIds.includes(id);
                            const isRemoved = removedLeft.includes(id);
                            const isNew = !isOriginal;

                            return (
                                <label
                                    key={id}
                                    className={`flex items-center gap-2 ${
                                        isRemoved || isNew ? "opacity-40" : ""
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        disabled={isNew}
                                        checked={isOriginal && !isRemoved}
                                        onChange={() => handleRightToggle(id)}
                                    />
                                    <span>{p.name}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="border rounded p-4 flex flex-col overflow-hidden">
                    <h2 className="font-medium mb-3">All Permissions</h2>

                    <input
                        type="text"
                        placeholder="Cari permission..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-3 w-full border border-gray-200 px-3 py-2 rounded-lg text-sm"
                    />

                    <div className="space-y-2 overflow-y-auto pr-2">
                        {filteredPermissions.map((p) => (
                            <label
                                key={p.id}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedRight.includes(p.id) &&
                                        !removedLeft.includes(p.id)
                                    }
                                    onChange={() => handleRightToggle(p.id)}
                                />
                                <span>{p.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                >
                    Batal
                </button>

                <button
                    onClick={() => setConfirmOpen(true)}
                    className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700"
                >
                    Simpan Perubahan
                </button>
            </div>

            {/* CONFIRM */}
            <ConfirmDialog
                open={confirmOpen}
                message="Apakah kamu yakin ingin menyimpan perubahan permission role ini?"
                confirmText="Ya, Simpan"
                loading={form.processing}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmSave}
            />

            {/* TOAST */}
            <Toast
                open={toastOpen}
                message="Perubahan permission berhasil disimpan"
                type="success"
            />
        </div>
    );
}
