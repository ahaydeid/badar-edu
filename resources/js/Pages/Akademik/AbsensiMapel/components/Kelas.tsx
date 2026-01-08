"use client";

import { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import { ArrowLeft, Eye, User } from "lucide-react";
import ModalFoto from "./ModalFoto";
import ModalDetailAbsen from "./ModalDetailAbsen";

export default function Kelas() {
    const { siswa, kelas, mapel, jadwalId } = usePage<any>().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [openFoto, setOpenFoto] = useState(false);
    const [fotoAktif, setFotoAktif] = useState<string | null>(null);
    const [namaAktif, setNamaAktif] = useState<string | null>(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [detailRows, setDetailRows] = useState<any[]>([]);
    const [selectedSiswa, setSelectedSiswa] = useState<any>(null);

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return siswa.filter((s: any) => s.nama.toLowerCase().includes(q));
    }, [siswa, searchTerm]);

    return (
        <div className="w-full space-y-6 p-2">
            <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
                <ArrowLeft className="w-4 h-4" /> Kembali
            </button>

            <h1 className="text-3xl font-semibold text-gray-800">
                Absensi {mapel.nama} – {kelas.nama}
            </h1>

            <div className="flex justify-end">
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama siswa..."
                    className="w-64 border border-gray-300 px-3 py-2 rounded-lg"
                />
            </div>

            <div className="rounded border border-gray-300 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-sky-100">
                        <tr>
                            <th className="p-3 text-center">No</th>
                            <th className="p-3">Nama</th>
                            <th className="p-3 text-center">Hadir</th>
                            <th className="p-3 text-center">Terlambat</th>
                            <th className="p-3 text-center">Sakit</th>
                            <th className="p-3 text-center">Izin</th>
                            <th className="p-3 text-center">Alfa</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((s: any, i: number) => (
                            <tr key={s.id} className="border-b border-gray-200">
                                <td className="p-3 text-center">{i + 1}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setFotoAktif(s.foto);
                                                setNamaAktif(s.nama);
                                                setOpenFoto(true);
                                            }}
                                            className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"
                                        >
                                            {s.foto ? (
                                                <img
                                                    src={`/storage/${s.foto}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-4 h-4 mx-auto text-gray-500" />
                                            )}
                                        </button>
                                        {s.nama}
                                    </div>
                                </td>
                                {[
                                    "hadir",
                                    "terlambat",
                                    "sakit",
                                    "izin",
                                    "alfa",
                                ].map((k) => (
                                    <td
                                        key={k}
                                        className={`text-center ${
                                            s[k] > 0
                                                ? "font-semibold"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {s[k] > 0 ? s[k] : "-"}
                                    </td>
                                ))}
                                <td className="text-center">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const res = await fetch(
                                                `/absensi-siswa/detail/${jadwalId}/${s.id}`
                                            );
                                            const json = await res.json();
                                            setDetailRows(json);
                                            setSelectedSiswa(s);
                                            setOpenDetail(true);
                                        }}
                                        className="text-sky-600 text-xs flex justify-center gap-1"
                                    >
                                        <Eye className="w-4 h-4" /> Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="p-6 text-center text-gray-500"
                                >
                                    Data siswa tidak ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ModalFoto
                open={openFoto}
                foto={fotoAktif}
                nama={namaAktif}
                onClose={() => setOpenFoto(false)}
            />
            <ModalDetailAbsen
                open={openDetail}
                siswa={selectedSiswa}
                kelas={kelas}
                rows={detailRows}
                onClose={() => setOpenDetail(false)}
            />
        </div>
    );
}
