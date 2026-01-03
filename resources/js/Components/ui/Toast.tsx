import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export type ToastType = "success" | "error";

type ToastProps = {
    open: boolean;
    message: string;
    type?: ToastType;
    onClose?: () => void;
};

export default function Toast({ open, message, type = "success", onClose }: ToastProps) {
    const isSuccess = type === "success";

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full max-w-md rounded bg-white px-6 pb-6 pt-14 shadow-lg border border-gray-200"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* ICON FLOAT */}
                        <motion.div
                            className={`absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-md
                ${isSuccess ? "bg-emerald-500" : "bg-rose-500"}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {isSuccess ? (
                                <CheckCircle className="h-7 w-7" />
                            ) : (
                                <XCircle className="h-7 w-7" />
                            )}
                        </motion.div>

                        <p className="mt-2 text-center text-base font-medium text-gray-800">
                            {message}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
