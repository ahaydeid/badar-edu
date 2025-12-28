import { X } from "lucide-react";

type ModalFotoProps = {
    open: boolean;
    foto: string | null;
    nama: string | null;
    onClose: () => void;
};

export default function ModalFoto({
    open,
    foto,
    nama,
    onClose,
}: ModalFotoProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative">
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-700">
                        {nama}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-4 flex flex-col items-center gap-3">
                    {foto ? (
                        <img
                            src={`/storage/${foto}`}
                            alt={nama ?? "Foto Siswa"}
                            className="max-h-[70vh] rounded-lg object-contain"
                        />
                    ) : (
                        <div className="w-full h-64 flex items-center justify-center text-gray-400">
                            Tidak ada foto
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
