import { Link } from "@inertiajs/react";
import { Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import MapsModal from "./MapsModal";
import { useState } from "react";

export default function SiswaTable({ data, loading }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    function openMaps(s) {
        setSelected(s);
        setOpen(true);
    }

    function formatDateShort(dateString: string | null | undefined) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("id-ID", { month: "short" }); // Feb, Mar, Apr
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    return (
        <div className="rounded border border-gray-200 bg-white">
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-max text-sm text-left border-collapse">
                    {/* =====================================================
                       HEADER
                    ===================================================== */}
                    <thead>
                        <tr className="bg-sky-100 text-gray-700 text-[14px] h-12">
                            <th className="p-3 border-r border-gray-100 text-center">
                                No
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                Nama
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                NIPD
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                NISN
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                JK
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                Tanggal Lahir
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                Rombel
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                Alamat
                            </th>
                            <th className="py-2 px-3 text-center">Maps</th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                HP
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                Ayah
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                Ibu
                            </th>
                            <th className="p-3 border-r border-gray-100 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    {/* =====================================================
                       BODY
                    ===================================================== */}
                    <tbody className="text-gray-700">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={12}
                                    className="p-4 text-center text-gray-500"
                                >
                                    Memuat data...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={12}
                                    className="p-4 text-center text-gray-500"
                                >
                                    Tidak ada data siswa.
                                </td>
                            </tr>
                        ) : (
                            data.map((s) => (
                                <tr
                                    key={s.id}
                                    className="border-b border-gray-100 last:border-none hover:bg-sky-50"
                                >
                                    <td className="py-2 px-3 text-center">
                                        {s.no}
                                    </td>

                                    <td className="py-2 px-3">{s.nama}</td>
                                    <td className="py-2 px-3">{s.nipd}</td>
                                    <td className="py-2 px-3">{s.nisn}</td>

                                    <td className="py-2 px-3 text-center">
                                        {s.jk}
                                    </td>

                                    <td className="py-2 px-3">
                                        {formatDateShort(s.tanggal_lahir)}
                                    </td>

                                    <td className="py-2 px-3">
                                        {s.rombel_saat_ini}
                                    </td>

                                    {/* ALAMAT RINGKAS */}
                                    <td className="py-2 px-3 whitespace-nowrap">
                                        {s.alamat}, RT{s.rt}/RW{s.rw},{" "}
                                        {s.kelurahan}, {s.kecamatan},{" "}
                                        {s.kode_pos}
                                    </td>

                                    <td className="py-2 px-3 text-center">
                                        <button
                                            onClick={() => openMaps(s)}
                                            className="px-3 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md text-xs flex items-center gap-1 mx-auto"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            Buka
                                        </button>
                                    </td>

                                    <td className="py-2 px-3">{s.hp}</td>

                                    <td className="py-2 px-3">{s.ayah_nama}</td>
                                    <td className="py-2 px-3">{s.ibu_nama}</td>

                                    {/* AKSI */}
                                    <td className="py-2 px-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <Link
                                                href={`/master-data/siswa/${s.id}`}
                                                className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />{" "}
                                                Detail
                                            </Link>

                                            <button className="px-3 py-2 bg-amber-500 text-white rounded-md text-xs flex items-center gap-1">
                                                <Pencil className="w-4 h-4" />{" "}
                                                Edit
                                            </button>

                                            <button className="px-3 py-2 bg-rose-500 text-white rounded-md text-xs flex items-center gap-1">
                                                <Trash2 className="w-4 h-4" />{" "}
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {open && (
                    <MapsModal
                        student={selected}
                        onClose={() => setOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
