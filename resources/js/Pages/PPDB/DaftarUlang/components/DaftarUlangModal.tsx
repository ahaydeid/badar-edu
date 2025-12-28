import { Fragment } from "react";

type DaftarUlang = {
    id: number;
    no_pendaftaran: string;
    nama: string;
    jurusan: string;
    asal_sekolah: string;
    status: "Belum" | "Proses" | "Selesai";
};

type Props = {
    open: boolean;
    data: DaftarUlang | null;
    onClose: () => void;
};

export default function DaftarUlangModal({ open, data, onClose }: Props) {
    if (!open || !data) return null;

    return (
        <Fragment>
            <div className="fixed inset-0 z-9999 bg-black/40" />
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl rounded-md bg-white border border-gray-300">
                    {/* HEADER */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <div>
                            <h2 className="text-sm font-semibold">
                                Daftar Ulang
                            </h2>
                            <p className="text-xs text-gray-500">
                                Finalisasi penerimaan siswa
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Tutup
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-4 text-sm">
                        {/* BIODATA */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-xs text-gray-500">
                                    Nama
                                </div>
                                <div className="font-medium">{data.nama}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Jurusan
                                </div>
                                <div>{data.jurusan}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    No Pendaftaran
                                </div>
                                <div>{data.no_pendaftaran}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Asal Sekolah
                                </div>
                                <div>{data.asal_sekolah}</div>
                            </div>
                        </div>

                        {/* DOKUMEN */}
                        <div className="border-t border-gray-200 pt-3">
                            <div className="mb-2 text-sm font-medium">
                                Checklist Dokumen
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "Ijazah / SKL",
                                    "SKHU / Nilai",
                                    "Akta Kelahiran",
                                    "Kartu Keluarga",
                                    "Pas Foto",
                                ].map((item) => (
                                    <label
                                        key={item}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                        />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* BIAYA */}
                        <div className="border-t border-gray-200 pt-3 space-y-2">
                            <div className="text-sm font-medium">
                                Verifikasi Biaya
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="biaya"
                                        className="border-gray-300"
                                    />
                                    Belum Bayar
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="biaya"
                                        className="border-gray-300"
                                    />
                                    Lunas
                                </label>
                            </div>
                            <textarea
                                className="w-full rounded-sm border border-gray-300 p-2 text-sm"
                                placeholder="Catatan admin"
                            />
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm"
                        >
                            Batal
                        </button>
                        <button className="rounded-md bg-green-600 px-4 py-2 text-sm text-white">
                            Selesaikan Daftar Ulang
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
