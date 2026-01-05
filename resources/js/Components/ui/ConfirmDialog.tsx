import React, { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";

type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    variant?: "primary" | "danger" | "warning";
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({
    open,
    title = "Konfirmasi",
    message,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    loading = false,
    variant = "primary",
    onConfirm,
    onClose,
}: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [open]);

    if (!open && !visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
                visible ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-md rounded bg-white px-6 pb-6 pt-14 shadow-lg border border-gray-200 transition-all duration-200 ${
                    visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ICON FLOAT */}
                <div
                    className={`absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 animate-bounce ${
                        variant === "danger" ? "bg-red-500" : 
                        variant === "warning" ? "bg-amber-500" : "bg-sky-500"
                    } ${visible ? "scale-100 opacity-100" : "scale-80 opacity-0"}`}
                    style={{ animationDuration: "2s" }}
                >
                    <HelpCircle className="h-7 w-7" />
                </div>

                <h2 className="text-center text-lg font-semibold text-gray-800">
                    {title}
                </h2>

                <p className="mt-2 text-center text-sm text-gray-600">
                    {message}
                </p>

                <div className="mt-6 flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-lg cursor-pointer px-4 py-2 text-sm text-white disabled:opacity-60 transition-colors ${
                            variant === "danger"
                                ? "bg-rose-600 hover:bg-rose-700"
                                : variant === "warning"
                                ? "bg-amber-600 hover:bg-amber-700"
                                : "bg-sky-600 hover:bg-sky-700"
                        }`}
                    >
                        {loading ? "Memproses..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
