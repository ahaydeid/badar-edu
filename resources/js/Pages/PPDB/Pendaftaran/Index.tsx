import { Head } from "@inertiajs/react";
import { useState } from "react";

type Pendaftar = {
    id: number;
    no_pendaftaran: string;
    nama: string;
    nik: string;
    asalSekolah: string;
    jurusan: string;
    gelombang: string;
    tanggalDaftar: string;
    status:
        | "Menunggu Verifikasi"
        | "Perlu Perbaikan"
        | "Ditolak"
        | "Terverifikasi";
};

export default function Index() {
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    const data: Pendaftar[] = [
        {
            id: 1,
            no_pendaftaran: "PPDB-2025-001",
            nama: "Ahmad Fauzi",
            nik: "327xxxxxxxxx",
            asalSekolah: "SMP Negeri 1",
            jurusan: "TBSM",
            gelombang: "Gelombang 1",
            tanggalDaftar: "2025-06-10",
            status: "Menunggu Verifikasi",
        },
        {
            id: 2,
            no_pendaftaran: "PPDB-2025-002",
            nama: "Siti Nurhaliza",
            nik: "327xxxxxxxxx",
            asalSekolah: "SMP Negeri 3",
            jurusan: "MPLB",
            gelombang: "Gelombang 1",
            tanggalDaftar: "2025-06-11",
            status: "Perlu Perbaikan",
        },
    ];

    const filtered = data.filter((d) => {
        const matchStatus = filterStatus ? d.status === filterStatus : true;
        const q = search.toLowerCase();
        const matchSearch = q
            ? d.no_pendaftaran.toLowerCase().includes(q) ||
              d.nama.toLowerCase().includes(q) ||
              d.nik.toLowerCase().includes(q) ||
              d.asalSekolah.toLowerCase().includes(q)
            : true;
        return matchStatus && matchSearch;
    });

    return (
        <>
            <Head title="Pendaftaran Masuk" />

            <div className="max-w-7xl space-y-6">
                {/* HEADER */}
                <div>
                    <h1 className="text-xl font-semibold">Pendaftaran Masuk</h1>
                    <p className="text-sm text-gray-500">
                        Daftar pendaftar PPDB yang masuk
                    </p>
                </div>

                {/* FILTER & SEARCH */}
                <div className="bg-white rounded-sm border border-gray-200 p-4 flex items-end justify-between gap-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">
                            Status
                        </label>
                        <select
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">Semua</option>
                            <option value="Menunggu Verifikasi">
                                Menunggu Verifikasi
                            </option>
                            <option value="Perlu Perbaikan">
                                Perlu Perbaikan
                            </option>
                            <option value="Ditolak">Ditolak</option>
                            <option value="Terverifikasi">Terverifikasi</option>
                        </select>
                    </div>

                    <div className="w-64 text-right">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm whitespace-nowrap">
                        <thead className="bg-sky-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left">No</th>
                                <th className="px-6 py-3 text-left">
                                    No Pendaftaran
                                </th>
                                <th className="px-6 py-3 text-left">Nama</th>
                                <th className="px-6 py-3 text-left">NIK</th>
                                <th className="px-6 py-3 text-left">
                                    Asal Sekolah
                                </th>
                                <th className="px-6 py-3 text-left">Jurusan</th>
                                <th className="px-6 py-3 text-left">
                                    Gelombang
                                </th>
                                <th className="px-6 py-3 text-left">Tanggal</th>
                                <th className="px-6 py-3 text-center">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filtered.map((p, i) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3">{i + 1}</td>
                                    <td className="px-6 py-3">
                                        {p.no_pendaftaran}
                                    </td>
                                    <td className="px-6 py-3">{p.nama}</td>
                                    <td className="px-6 py-3">{p.nik}</td>
                                    <td className="px-6 py-3">
                                        {p.asalSekolah}
                                    </td>
                                    <td className="px-6 py-3">{p.jurusan}</td>
                                    <td className="px-6 py-3">{p.gelombang}</td>
                                    <td className="px-6 py-3">
                                        {p.tanggalDaftar}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                                            Lihat Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={10}
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
