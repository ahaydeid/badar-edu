import { X } from "lucide-react";

type Props = {
    open: boolean;
    mode: "baru" | "sub" | null;
    penilaianId?: number | null;
    onClose: () => void;
};

export default function TambahPenilaianModal({
    open,
    mode,
    penilaianId,
    onClose,
}: Props) {
    if (!open || !mode) return null;
    const title = mode === "baru" ? "Penilaian Baru" : "Sub Nilai";
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white border border-gray-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h2 className="text-sm font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4 text-gray-600" />
                    </button>
                </div>

                <div className="p-4 space-y-4 text-sm">
                    {mode === "baru" && (
                        <div>
                            <label className="text-xs text-gray-500">
                                Nama Penilaian
                            </label>
                            <input
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Contoh: Tugas Mandiri"
                            />
                        </div>
                    )}

                    {mode === "sub" && (
                        <>
                            <input type="hidden" value={penilaianId ?? ""} />
                            <div>
                                <label className="text-xs text-gray-500">
                                    Nama Sub Nilai
                                </label>
                                <input
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="Contoh: Membuat Halaman Responsif"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm"
                    >
                        Batal
                    </button>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
