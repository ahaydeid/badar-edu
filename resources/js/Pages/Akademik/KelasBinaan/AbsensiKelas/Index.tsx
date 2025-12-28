"use client";

import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { Eye } from "lucide-react";
import ModalDetailAbsen from "./components/ModalDetailAbsen";

export default function Index() {
    const { siswa, kelas } = usePage<any>().props;

    const [openDetail, setOpenDetail] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);

    return (
        <div className="w-full space-y-6 p-2">
            <h1 className="text-3xl font-semibold text-gray-800">
                Absensi Siswa – {kelas.nama}
            </h1>

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
                        {siswa.map((s: any, i: number) => (
                            <tr key={s.id} className="border-b border-gray-200">
                                <td className="p-3 text-center">{i + 1}</td>
                                <td className="p-3">{s.nama}</td>

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
                                        onClick={async () => {
                                            const res = await fetch(
                                                `/kelas-binaan/absensi-siswa/detail/${s.id}`
                                            );
                                            setRows(await res.json());
                                            setSelected(s);
                                            setOpenDetail(true);
                                        }}
                                        className="text-sky-600 text-xs flex justify-center gap-1"
                                    >
                                        <Eye className="w-4 h-4" /> Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalDetailAbsen
                open={openDetail}
                siswa={selected}
                kelas={kelas}
                rows={rows}
                onClose={() => setOpenDetail(false)}
            />
        </div>
    );
}
