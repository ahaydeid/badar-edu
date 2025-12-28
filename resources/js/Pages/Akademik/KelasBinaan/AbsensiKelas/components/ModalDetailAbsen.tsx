import { useMemo, useState } from "react";

export default function ModalDetailAbsen({
    open,
    siswa,
    kelas,
    rows,
    onClose,
}: any) {
    if (!open) return null;

    const [search, setSearch] = useState("");

    const getStatus = (r: any) => {
        if (r.hadir)
            return { label: "Hadir", color: "bg-green-100 text-green-700" };
        if (r.terlambat)
            return {
                label: "Terlambat",
                color: "bg-yellow-100 text-yellow-700",
            };
        if (r.sakit)
            return { label: "Sakit", color: "bg-blue-100 text-blue-700" };
        if (r.izin)
            return { label: "Izin", color: "bg-purple-100 text-purple-700" };
        if (r.alfa) return { label: "Alfa", color: "bg-red-100 text-red-700" };
        return { label: "-", color: "bg-gray-100 text-gray-500" };
    };

    const filteredRows = useMemo(() => {
        const q = search.toLowerCase();
        return rows.filter((r: any) => {
            const tanggal = new Date(r.tanggal)
                .toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                .toLowerCase();

            const status = getStatus(r).label.toLowerCase();
            return tanggal.includes(q) || status.includes(q);
        });
    }, [rows, search]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">{siswa.nama}</h2>
                    <p className="text-sm text-gray-500">Kelas {kelas.nama}</p>
                </div>

                <div className="px-6 py-3 border-b border-gray-200">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari tanggal atau status"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                </div>

                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    {filteredRows.length === 0 ? (
                        <div className="text-center text-sm text-gray-400 py-8">
                            Data tidak ditemukan
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-200">
                                    <th className="py-2">Tanggal</th>
                                    <th className="py-2 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((r: any, i: number) => {
                                    const status = getStatus(r);
                                    return (
                                        <tr
                                            key={i}
                                            className="border-b border-gray-200 last:border-b-0"
                                        >
                                            <td className="py-2">
                                                {new Date(
                                                    r.tanggal
                                                ).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="py-2 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded text-xs font-medium ${status.color}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded bg-slate-100 hover:bg-slate-200"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
