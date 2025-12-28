import { Head } from "@inertiajs/react";
import { useState } from "react";
import TambahPPDBModal from "./components/TambahPPDBModal";
import { Settings2 } from "lucide-react";

type HistoryPPDB = {
    id: number;
    tahun: string;
    gelombang: string;
    periode: string;
    jurusan: string;
    kuota: number;
    status: string;
};

type PPDBAktif = {
    tahun: string;
    gelombang: string;
    periode: string;
    jurusan: string;
    kuota: number;
    status: string;
};

export default function Index() {
    const [openModal, setOpenModal] = useState(false);

    type KuotaJurusan = {
        jurusan: string;
        kuota: number;
        terisi: number;
    };

    const ppdbAktif: PPDBAktif = {
        tahun: "2025/2026",
        gelombang: "Gelombang 1",
        periode: "01 Jun 2025 – 30 Jun 2025",
        jurusan: "MPLB, TBSM, TKR, TBG",
        kuota: 240,
        status: "Aktif",
    };

    const kuota: KuotaJurusan[] = [
        { jurusan: "MPLB", kuota: 60, terisi: 45 },
        { jurusan: "TBSM", kuota: 60, terisi: 52 },
        { jurusan: "TKR", kuota: 60, terisi: 58 },
        { jurusan: "TBG", kuota: 60, terisi: 40 },
    ];

    const history: HistoryPPDB[] = [
        {
            id: 1,
            tahun: "2024/2025",
            gelombang: "Gelombang 1",
            periode: "01 Jun 2024 – 30 Jun 2024",
            jurusan: "MPLB, TBSM, TKR, TBG",
            kuota: 240,
            status: "Arsip",
        },
    ];

    return (
        <>
            <Head title="Pengaturan PPDB" />

            <div className="max-w-7xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Pengaturan PPDB
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manajemen periode dan gelombang PPDB
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="rounded-md bg-blue-600 cursor-pointer px-4 py-2 text-sm text-white"
                    >
                        + Tambah PPDB
                    </button>
                </div>
                {/* PPDB AKTIF */}
                <div className="rounded-sm border border-blue-200 bg-blue-50 px-4 py-3 relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-blue-700">
                                PPDB Aktif
                            </h2>
                            <p className="text-xs text-blue-600">
                                {ppdbAktif.tahun} · {ppdbAktif.gelombang}
                            </p>
                        </div>
                        <span className="flex items-center gap-2 text-xs font-medium text-gray-700">
                            <span className="relative flex h-3 w-3 items-center justify-center">
                                <span className="absolute h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
                                <span className="relative h-2 w-2 rounded-full bg-green-600" />
                            </span>
                            {ppdbAktif.status}
                        </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-700">
                        <div>
                            <span className="text-xs text-gray-500">
                                Periode
                            </span>
                            <div>{ppdbAktif.periode}</div>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500">
                                Jurusan
                            </span>
                            <div>{ppdbAktif.jurusan}</div>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500">
                                Total Kuota
                            </span>
                            <div>{ppdbAktif.kuota}</div>
                        </div>
                    </div>

                    {/* BUTTON KELOLA */}
                    <div className="absolute bottom-3 right-4">
                        <button className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-3 py-1.5 text-xs text-white cursor-pointer hover:bg-blue-600">
                            <Settings2 className="h-4 w-4" />
                            Kelola
                        </button>
                    </div>
                </div>
                {/* KUOTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {kuota.map((k) => {
                        const persen = Math.round((k.terisi / k.kuota) * 100);
                        return (
                            <div
                                key={k.jurusan}
                                className="rounded-md border border-gray-200 bg-white p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        {k.jurusan}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {persen}%
                                    </span>
                                </div>

                                <div className="mt-2 text-xs text-gray-500">
                                    {k.terisi} dari {k.kuota} siswa
                                </div>

                                <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                                    <div
                                        className="h-2 rounded-full bg-blue-600"
                                        style={{ width: `${persen}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* HISTORY */}
                <div className="pt-6">
                    <h2 className="mb-2 text-sm font-semibold text-gray-700">
                        History PPDB
                    </h2>

                    <div className="bg-white rounded-sm border border-gray-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-sky-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        Tahun
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Gelombang
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Periode
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Jurusan
                                    </th>
                                    <th className="px-6 py-3 text-right">
                                        Kuota
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {history.map((h) => (
                                    <tr key={h.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">{h.tahun}</td>
                                        <td className="px-6 py-3">
                                            {h.gelombang}
                                        </td>
                                        <td className="px-6 py-3">
                                            {h.periode}
                                        </td>
                                        <td className="px-6 py-3">
                                            {h.jurusan}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            {h.kuota}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                                {h.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <TambahPPDBModal
                open={openModal}
                onClose={() => setOpenModal(false)}
            />
        </>
    );
}
