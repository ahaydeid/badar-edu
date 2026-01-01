import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import DaftarUlangModal from "./components/DaftarUlangModal";
import Toast from "@/Components/ui/Toast";

type DaftarUlang = {
    id: number;
    no_pendaftaran: string;
    nama: string;
    jurusan: string;
    asal_sekolah: string;
};

type Props = {
    pendaftars?: DaftarUlang[];
};

export default function Index({ pendaftars = [] }: Props) {
    const [selected, setSelected] = useState<DaftarUlang | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        type: "success" as "success" | "error"
    });

    const filtered = (pendaftars || []).filter((d) => {
        const q = search.toLowerCase();
        return q
            ? d.no_pendaftaran.toLowerCase().includes(q) ||
                  d.nama.toLowerCase().includes(q) ||
                  d.asal_sekolah?.toLowerCase().includes(q) // Optional check
            : true;
    });

    const openDetail = (row: DaftarUlang) => {
        setSelected(row);
        setOpenModal(true);
    };

    const closeDetail = () => {
        setSelected(null);
        setOpenModal(false);
    };

    const showToast = (message: string, type: "success" | "error") => {
        setToastState({ open: true, message, type });
        setTimeout(() => setToastState(p => ({ ...p, open: false })), 3000);
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
                                <th className="px-4 py-3 text-left">Siswa</th>
                                <th className="px-4 py-3 text-left">Jurusan</th>
                                <th className="px-4 py-3 text-left">
                                    Asal Sekolah
                                </th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filtered.map((d, i) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{d.nama}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{d.no_pendaftaran}</div>
                                    </td>
                                    <td className="px-4 py-3">{d.jurusan}</td>
                                    <td className="px-4 py-3">
                                        {d.asal_sekolah}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => openDetail(d)}
                                            className="inline-flex items-center cursor-pointer rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 transition-colors"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
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
                onSuccess={showToast}
            />

            <Toast 
                open={toastState.open}
                message={toastState.message}
                type={toastState.type}
            />
        </>
    );
}
