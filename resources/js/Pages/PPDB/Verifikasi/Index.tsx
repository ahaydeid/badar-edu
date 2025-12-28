import { Head } from "@inertiajs/react";
import { useState } from "react";

type VerifikasiItem = {
    id: number;
    nama: string;
    jurusan: string;
    nilai: number;
    status: "Terverifikasi" | "Diterima" | "Cadangan" | "Ditolak";
};

export default function Index() {
    const [search, setSearch] = useState<string>("");

    const data: VerifikasiItem[] = [
        {
            id: 1,
            nama: "Ahmad Fauzi",
            jurusan: "TBSM",
            nilai: 82,
            status: "Terverifikasi",
        },
        {
            id: 2,
            nama: "Siti Nurhaliza",
            jurusan: "MPLB",
            nilai: 88,
            status: "Diterima",
        },
    ];

    const filtered = data.filter((d) => {
        const q = search.toLowerCase();
        return q
            ? d.nama.toLowerCase().includes(q) ||
                  d.jurusan.toLowerCase().includes(q)
            : true;
    });

    return (
        <>
            <Head title="Verifikasi & Seleksi" />

            <div className="max-w-7xl space-y-6">
                {/* HEADER */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Verifikasi & Seleksi
                        </h1>
                        <p className="text-sm text-gray-500">
                            Penentuan kelulusan pendaftar PPDB
                        </p>
                    </div>

                    {/* SEARCH */}
                    <div className="w-64">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama / jurusan..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="rounded-sm border border-gray-200 bg-white overflow-x-auto">
                    <table className="w-full text-sm whitespace-nowrap">
                        <thead className="bg-sky-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left">No</th>
                                <th className="px-6 py-3 text-left">Nama</th>
                                <th className="px-6 py-3 text-left">Jurusan</th>
                                <th className="px-6 py-3 text-right">Nilai</th>
                                <th className="px-6 py-3 text-center">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filtered.map((d, i) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3">{i + 1}</td>
                                    <td className="px-6 py-3">{d.nama}</td>
                                    <td className="px-6 py-3">{d.jurusan}</td>
                                    <td className="px-6 py-3 text-right">
                                        {d.nilai}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className="rounded-sm bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="inline-flex gap-2">
                                            <button className="rounded-sm border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                                                Terima
                                            </button>
                                            <button className="rounded-sm border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                                                Cadangan
                                            </button>
                                            <button className="rounded-sm border border-gray-300 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                                                Tolak
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-6 text-center text-gray-500"
                                    >
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
