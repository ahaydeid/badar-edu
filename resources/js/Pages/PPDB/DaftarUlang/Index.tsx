import { Head } from "@inertiajs/react";
import { useState } from "react";
import DaftarUlangModal from "./components/DaftarUlangModal";

type DaftarUlang = {
    id: number;
    no_pendaftaran: string;
    nama: string;
    jurusan: string;
    asal_sekolah: string;
    status: "Belum" | "Proses" | "Selesai";
};

export default function Index() {
    const [selected, setSelected] = useState<DaftarUlang | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState<string>("");

    const data: DaftarUlang[] = [
        {
            id: 1,
            no_pendaftaran: "PPDB-2025-001",
            nama: "Ahmad Fauzi",
            jurusan: "TKR",
            asal_sekolah: "SMP Negeri 1",
            status: "Belum",
        },
        {
            id: 2,
            no_pendaftaran: "PPDB-2025-002",
            nama: "Siti Aisyah",
            jurusan: "MPLB",
            asal_sekolah: "SMP Negeri 3",
            status: "Proses",
        },
    ];

    const filtered = data.filter((d) => {
        const q = search.toLowerCase();
        return q
            ? d.no_pendaftaran.toLowerCase().includes(q) ||
                  d.nama.toLowerCase().includes(q) ||
                  d.asal_sekolah.toLowerCase().includes(q)
            : true;
    });

    const statusColor = (status: DaftarUlang["status"]) => {
        if (status === "Selesai") return "bg-green-600";
        if (status === "Proses") return "bg-yellow-500";
        return "bg-gray-400";
    };

    const openDetail = (row: DaftarUlang) => {
        setSelected(row);
        setOpenModal(true);
    };

    const closeDetail = () => {
        setSelected(null);
        setOpenModal(false);
    };

    return (
        <>
            <Head title="Daftar Ulang PPDB" />

            <div className="max-w-7xl space-y-4">
                {/* HEADER + SEARCH */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Daftar Ulang</h1>
                        <p className="text-sm text-gray-500">
                            Finalisasi penerimaan siswa baru
                        </p>
                    </div>

                    <div className="w-64">
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
                <div className="rounded-sm border border-gray-200 bg-white overflow-x-auto">
                    <table className="w-full text-sm whitespace-nowrap">
                        <thead className="bg-sky-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left">No</th>
                                <th className="px-4 py-3 text-left">
                                    No Pendaftaran
                                </th>
                                <th className="px-4 py-3 text-left">Nama</th>
                                <th className="px-4 py-3 text-left">Jurusan</th>
                                <th className="px-4 py-3 text-left">
                                    Asal Sekolah
                                </th>
                                <th className="px-4 py-3 text-center">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filtered.map((d, i) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3">
                                        {d.no_pendaftaran}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {d.nama}
                                    </td>
                                    <td className="px-4 py-3">{d.jurusan}</td>
                                    <td className="px-4 py-3">
                                        {d.asal_sekolah}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center gap-2 text-xs">
                                            <span
                                                className={`h-2 w-2 rounded-full ${statusColor(
                                                    d.status
                                                )}`}
                                            />
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => openDetail(d)}
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL TERPISAH */}
            <DaftarUlangModal
                open={openModal}
                data={selected}
                onClose={closeDetail}
            />
        </>
    );
}
