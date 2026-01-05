import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

type ToastProps = {
    open: boolean;
    message: string;
    type?: ToastType;
    onClose?: () => void;
};

export default function Toast({ open, message, type = "success", onClose }: ToastProps) {
    const isSuccess = type === "success";
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            // Small delay to trigger CSS transition
            requestAnimationFrame(() => setVisible(true));
            
            // Auto-close after 3 seconds
            const timer = setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 2000);
            
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [open, onClose]);

    if (!open && !visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
                visible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                className={`relative w-full max-w-md rounded bg-white px-6 pb-6 pt-14 shadow-lg border border-gray-200 transition-all duration-200 ${
                    visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                {/* ICON FLOAT */}
                <div
                    className={`absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-md transition-all duration-200
                        ${isSuccess ? "bg-emerald-500" : "bg-rose-500"}
                        ${visible ? "scale-100 opacity-100" : "scale-80 opacity-0"}`}
                >
                    {isSuccess ? (
                        <CheckCircle className="h-7 w-7" />
                    ) : (
                        <XCircle className="h-7 w-7" />
                    )}
                </div>

                <p className="mt-2 text-center text-base font-medium text-gray-800">
                    {message}
                </p>
            </div>
        </div>
    );
}
