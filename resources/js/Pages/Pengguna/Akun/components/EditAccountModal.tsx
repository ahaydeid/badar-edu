import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useEffect, useState } from "react"; // Added useState
import Toast from "@/Components/ui/Toast"; // Added Import
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

export default function EditAccountModal({ open, user, allRoles, onClose }) {
    const { data, setData, put, delete: destroy, processing, reset } = useForm<{
        roles: string[];
        status: string;
    }>({
        roles: [],
        status: "aktif",
    });

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
        open: false,
        message: "",
        type: "success",
    });

    useEffect(() => {
        if (user) {
            // Map DB status to form value
            let safeStatus = "ACTIVE";
            const upperStatus = user.status?.toUpperCase();
            if (upperStatus === "INACTIVE" || upperStatus === "NONAKTIF") {
                safeStatus = "INACTIVE";
            }
            // Default to ACTIVE for any other case (including 'aktif', 'active', null)

            setData({
                roles: user.roles?.map((r) => r.name) || [],
                status: safeStatus,
            });
        }
    }, [user]);
    


    const handleToggleRole = (roleName) => {
        if (data.roles.includes(roleName)) {
            setData("roles", data.roles.filter((r) => r !== roleName));
        } else {
            setData("roles", [...data.roles, roleName]);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/akun/guru-pegawai/${user.id}`, {
            onSuccess: () => {
                setToast({ open: true, message: "Data akun berhasil diperbarui!", type: "success" });
                setTimeout(() => {
                    setToast((prev) => ({ ...prev, open: false }));
                    onClose();
                    reset(); 
                }, 2000);
            },
            onError: (errors) => {
                // Construct error message from errors object or generic
                const msg = Object.values(errors)[0] || "Gagal memperbarui data akun.";
                setToast({ open: true, message: String(msg), type: "error" });
                // Auto hide error toast too
                setTimeout(() => {
                     setToast((prev) => ({ ...prev, open: false }));
                }, 3000);
            }
        });
    };

    const handleDelete = () => {
        // Safe access (user should be present if clicked)
        destroy(`/akun/${user?.id}`, {
            onSuccess: () => {
                setConfirmDeleteOpen(false); // Close confirm dialog
                setToast({ open: true, message: "Akun berhasil dihapus!", type: "success" });
                setTimeout(() => {
                    setToast((prev) => ({ ...prev, open: false }));
                    onClose();
                }, 1500);
            },
            onError: (errors) => {
                setConfirmDeleteOpen(false); // Close confirm on error too? Or keep open? Maybe keep open to retry?
                // Usually close if we show toast.
                const msg = Object.values(errors)[0] || "Gagal menghapus akun.";
                setToast({ open: true, message: String(msg), type: "error" });
            }
        });
    };

    // safe guard
    if (!user) return null;

    return (
        <>
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Edit Akun
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Perbarui status dan hak akses pengguna
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Content Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Info User */}
                                <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                                    <h4 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
                                        Informasi Akun
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Nama Akun</p>
                                            <p className="font-semibold text-gray-800">
                                                {user.profile?.nama || user.username}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {user.profile_type?.includes("Siswa") ? "NISN" : "Kode Guru"}
                                            </p>
                                            <p className="font-mono text-sm font-medium text-gray-700">
                                                {user.username}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Switch */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status Akun
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setData("status", data.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${data.status === "ACTIVE" ? "bg-green-500" : "bg-gray-200"}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.status === "ACTIVE" ? "translate-x-6" : "translate-x-1"}`}
                                            />
                                        </button>
                                        <span className={`text-sm font-medium ${data.status === "ACTIVE" ? "text-green-600" : "text-gray-500"}`}>
                                            {data.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                                        </span>
                                    </div>
                                </div>

                                {/* Role Selection - Dropdown Style */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Role Pengguna
                                    </label>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <div className="max-h-40 overflow-y-auto p-2 space-y-1">
                                            {allRoles.map((role) => {
                                                const isSelected = data.roles.includes(role.name);
                                                return (
                                                    <div
                                                        key={role.id}
                                                        onClick={() => handleToggleRole(role.name)}
                                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                                            isSelected
                                                                ? "text-sky-700"
                                                                : "hover:bg-gray-50 text-gray-700"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 border rounded flex items-center justify-center ${
                                                                isSelected
                                                                    ? "bg-sky-500 border-sky-500"
                                                                    : "border-gray-400 bg-white"
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <Check className="w-3 h-3 text-white" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {role.name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Klik untuk memilih satu atau lebih role.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => setConfirmDeleteOpen(true)}
                                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded transition-colors"
                                >
                                    Hapus Akun
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
            <Toast open={toast.open} message={toast.message} type={toast.type} />
        </AnimatePresence>

        <ConfirmDialog
            open={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
            onConfirm={handleDelete}
            title="Hapus Akun?"
            message="Apakah Anda yakin ingin menghapus akun ini secara permanen? Data yang dihapus tidak dapat dikembalikan."
            confirmText="Ya, Hapus Akun"
            cancelText="Batal"
            variant="danger"
            loading={processing}
        />
        </>
    );
}
