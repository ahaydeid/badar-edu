import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useForm } from "@inertiajs/react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import { useUiFeedback } from "@/hooks/useUiFeedback";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function UpdatePasswordModal({ open, onClose }: Props) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const { toast, showToast } = useUiFeedback();

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open]);

    // Handle success from backend
    useEffect(() => {
       if (wasSuccessful) {
           onClose();
           reset();
       }
    }, [wasSuccessful]);


    function handleSubmit() {
        post('/profile/update-password', {
            preserveScroll: true,
            onSuccess: () => {
                showToast("Kata sandi berhasil diperbarui", "success");
                setConfirmSubmit(false);
                // Close is handled by effect
            },
            onError: (err) => {
                console.error(err);
                showToast("Gagal memperbarui kata sandi. Periksa inputan anda.", "error");
                setConfirmSubmit(false);
            }
        });
    }

    if (!open) return null;

    return (
        <>
            <Toast open={toast.open} message={toast.message} type={toast.type} />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Ubah Kata Sandi
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kata Sandi Saat Ini
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={data.current_password}
                                    onChange={(e) => setData("current_password", e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none pr-10 ${
                                        errors.current_password
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Masukkan kata sandi lama"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.current_password && (
                                <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={data.new_password}
                                    onChange={(e) => setData("new_password", e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none pr-10 ${
                                        errors.new_password
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Minimal 8 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.new_password && (
                                <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={data.new_password_confirmation}
                                    onChange={(e) => setData("new_password_confirmation", e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none pr-10 ${
                                        errors.new_password_confirmation
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Ulangi kata sandi baru"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                             {errors.new_password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">{errors.new_password_confirmation}</p>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            disabled={processing}
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => setConfirmSubmit(true)}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan Kata Sandi"}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmSubmit}
                title="Simpan Perubahan?"
                message="Pastikan kata sandi baru anda sudah benar dan mudah diingat."
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onConfirm={handleSubmit}
                onClose={() => setConfirmSubmit(false)}
            />
        </>
    );
}
