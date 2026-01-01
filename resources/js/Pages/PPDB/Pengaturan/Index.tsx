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
    deskripsi?: string;
    // Raw fields for editing
    id?: number;
    start_date_raw?: string;
    end_date_raw?: string;
    committee_name?: string;
    jurusans_raw?: any[];
};

type KuotaJurusan = {
    jurusan: string;
    kuota: number;
    terisi: number;
};

type Props = {
    ppdbAktifList: PPDBAktif[]; // Renamed and array type
    kuota: KuotaJurusan[];
    history: HistoryPPDB[];
    allJurusans: { id: number; nama: string; kode: string }[];
};

export default function Index({ ppdbAktifList, kuota, history, allJurusans }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState<any>(null); // Use proper type if possible

    const handleEdit = (item: PPDBAktif) => {
        setEditData({
            id: item.id,
            tahun_ajaran: item.tahun,
            gelombang: item.gelombang,
            status: item.status,
            start_date: item.start_date_raw,
            end_date: item.end_date_raw,
            committee_name: item.committee_name || '',
            jurusans: item.jurusans_raw || []
        });
        setOpenModal(true);
    };

    const handleAdd = () => {
        setEditData(null);
        setOpenModal(true);
    };

    return (
        <>
            <Head title="Pengaturan PPDB" />

            <div className="max-w-7xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Pengaturan PPDB
                        </h1>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="rounded-md bg-blue-600 cursor-pointer px-4 py-2 text-sm text-white"
                    >
                        + Tambah PPDB
                    </button>
                </div>
                {/* PPDB AKTIF LIST */}
                {ppdbAktifList.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {ppdbAktifList.map((ppdb, index) => (
                            <div key={ppdb.id || index} className="rounded-sm border border-sky-200 bg-sky-50 px-4 py-3 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-700">
                                            PPDB Aktif
                                        </h2>
                                        <p className="text-xs text-gray-600">
                                            {ppdb.tahun} · {ppdb.gelombang}
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-2 text-xs font-medium text-gray-700">
                                        <span className="relative flex h-3 w-3 items-center justify-center">
                                            <span className="absolute h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
                                            <span className="relative h-2 w-2 rounded-full bg-green-600" />
                                        </span>
                                        {ppdb.status}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm text-gray-700">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">
                                            Periode
                                        </span>
                                        <div className="font-medium">{ppdb.periode}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">
                                            Jurusan
                                        </span>
                                        <div className="font-medium">{ppdb.jurusan}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">
                                            Total Kuota
                                        </span>
                                        <div className="font-medium">{ppdb.kuota} Siswa</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">
                                            Ketua Panitia
                                        </span>
                                        <div className="font-medium truncate" title={ppdb.committee_name || ''}>{ppdb.committee_name || '-'}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">
                                            Deskripsi
                                        </span>
                                        <div className="truncate font-medium" title={ppdb.deskripsi}>{ppdb.deskripsi || '-'}</div>
                                    </div>
                                </div>

                                {/* BUTTON KELOLA */}
                                <div className="mt-4 flex justify-end border-t border-blue-200/50 pt-3">
                                    <button 
                                        onClick={() => handleEdit(ppdb)}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-4 py-2 text-xs font-medium text-white cursor-pointer hover:bg-sky-600 transition-colors shadow-sm"
                                    >
                                        <Settings2 className="h-4 w-4" />
                                        Kelola
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-sm border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                        Tidak ada periode PPDB yang aktif saat ini. Silakan buat periode baru.
                    </div>
                )}
                {/* KUOTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {kuota.map((k) => {
                        const persen = checkPersen(k.terisi, k.kuota); // Prevent NaN
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
                editData={editData}
                onClose={() => setOpenModal(false)}
                allJurusans={allJurusans}
            />
        </>
    );
}

function checkPersen(terisi: number, kuota: number) {
    if (kuota === 0) return 0;
    return Math.round((terisi / kuota) * 100);
}
