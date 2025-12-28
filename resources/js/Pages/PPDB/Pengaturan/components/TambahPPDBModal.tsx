import { useState } from "react";

type Jurusan = {
    id: number;
    nama: string;
    kuota: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function TambahPPDBModal({ open, onClose }: Props) {
    const [tahunAjaran, setTahunAjaran] = useState("2025/2026");
    const [status, setStatus] = useState<"draft" | "open" | "closed">("draft");
    const [gelombang, setGelombang] = useState("Gelombang 1");
    const [periode, setPeriode] = useState({ mulai: "", selesai: "" });

    const [jurusan, setJurusan] = useState<Jurusan[]>([
        {
            id: 1,
            nama: "Manajemen Perkantoran dan Layanan Bisnis (MPLB)",
            kuota: 60,
        },
        { id: 2, nama: "Teknis Dan Bisnis Sepeda Motor (TBSM)", kuota: 60 },
        { id: 3, nama: "Teknik Kendaraan Ringan (TKR)", kuota: 60 },
        { id: 4, nama: "Tata Boga (TBG)", kuota: 60 },
    ]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold">Tambah PPDB</h2>
                        <p className="text-sm text-gray-500">
                            Membuka periode PPDB baru
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-4">
                            <label className="text-xs text-gray-500">
                                Tahun Ajaran
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={tahunAjaran}
                                onChange={(e) => setTahunAjaran(e.target.value)}
                            >
                                <option value="2025/2026">2025/2026</option>
                                <option value="2026/2027">2026/2027</option>
                                <option value="2027/2028">2027/2028</option>
                            </select>
                        </div>

                        <div className="col-span-12 md:col-span-3">
                            <label className="text-xs text-gray-500">
                                Status
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as any)
                                }
                            >
                                <option value="draft">Draft</option>
                                <option value="open">Dibuka</option>
                                <option value="closed">Ditutup</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-4">
                            <label className="text-xs text-gray-500">
                                Gelombang
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={gelombang}
                                onChange={(e) => setGelombang(e.target.value)}
                            >
                                <option value="Gelombang 1">Gelombang 1</option>
                                <option value="Gelombang 2">Gelombang 2</option>
                                <option value="Gelombang 3">Gelombang 3</option>
                            </select>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label className="text-xs text-gray-500">
                                Periode Mulai
                            </label>
                            <input
                                type="date"
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={periode.mulai}
                                onChange={(e) =>
                                    setPeriode({
                                        ...periode,
                                        mulai: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label className="text-xs text-gray-500">
                                Periode Selesai
                            </label>
                            <input
                                type="date"
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={periode.selesai}
                                onChange={(e) =>
                                    setPeriode({
                                        ...periode,
                                        selesai: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Jurusan & Kuota
                        </h3>
                        <div className="rounded-md border border-gray-200 divide-y divide-gray-200">
                            {jurusan.map((j) => (
                                <div
                                    key={j.id}
                                    className="flex items-center justify-between px-4 py-3"
                                >
                                    <span className="text-sm">{j.nama}</span>
                                    <input
                                        type="number"
                                        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm text-right"
                                        value={j.kuota}
                                        onChange={(e) =>
                                            setJurusan(
                                                jurusan.map((x) =>
                                                    x.id === j.id
                                                        ? {
                                                              ...x,
                                                              kuota: Number(
                                                                  e.target.value
                                                              ),
                                                          }
                                                        : x
                                                )
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm"
                    >
                        Batal
                    </button>
                    <button className="rounded-md cursor-pointer bg-blue-600 px-4 py-2 text-sm text-white">
                        Simpan & Buka PPDB
                    </button>
                </div>
            </div>
        </div>
    );
}
