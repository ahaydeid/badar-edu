import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Eye, Pencil, Trash2, User } from "lucide-react";
import ModalFoto from "./ModalFoto";

export default function GuruTable({ data, loading, onEdit }) {
    const [openFoto, setOpenFoto] = useState(false);
    const [fotoAktif, setFotoAktif] = useState<string | null>(null);
    const [namaAktif, setNamaAktif] = useState<string | null>(null);

    function formatDateShort(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("id-ID", { month: "short" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    return (
        <>
            <div className="rounded border border-gray-200 bg-white">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-max text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-sky-100 text-gray-700 h-12">
                                <th className="p-3 text-center">No</th>
                                <th className="p-3 text-center">Nama</th>
                                <th className="p-3 text-center">JK</th>
                                <th className="p-3 text-center">
                                    Tempat Lahir
                                </th>
                                <th className="p-3 text-center">Tgl Lahir</th>
                                <th className="p-3">Status Kepegawaian</th>
                                <th className="p-3">Jenis PTK</th>
                                <th className="p-3">Gelar Belakang</th>
                                <th className="p-3">Jenjang</th>
                                <th className="p-3">Prodi</th>
                                <th className="p-3">Mengajar</th>
                                <th className="p-3">Kompetensi</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={13}
                                        className="p-4 text-center"
                                    >
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={13}
                                        className="p-4 text-center"
                                    >
                                        Tidak ada data guru.
                                    </td>
                                </tr>
                            ) : (
                                data.map((g) => (
                                    <tr
                                        key={g.id}
                                        className="border-b border-gray-200 hover:bg-sky-50"
                                    >
                                        <td className="py-2 px-3 text-center">
                                            {g.no}
                                        </td>

                                        <td className="py-2 px-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFotoAktif(
                                                            g.foto ?? null
                                                        );
                                                        setNamaAktif(g.nama);
                                                        setOpenFoto(true);
                                                    }}
                                                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center hover:outline-none hover:ring-2 hover:ring-sky-400"
                                                    title={
                                                        g.foto
                                                            ? "Lihat foto"
                                                            : undefined
                                                    }
                                                >
                                                    {g.foto ? (
                                                        <img
                                                            src={`/storage/${g.foto}`}
                                                            className="w-full h-full object-cover"
                                                            alt={g.nama}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                </button>

                                                <span>{g.nama}</span>
                                            </div>
                                        </td>

                                        <td className="py-2 px-3 text-center">
                                            {g.jk}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            {g.tempat_lahir ?? "-"}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            {formatDateShort(g.tanggal_lahir)}
                                        </td>
                                        <td className="py-2 px-3">
                                            {g.status_kepegawaian ?? "-"}
                                        </td>
                                        <td className="py-2 px-3">
                                            {g.jenis_ptk ?? "-"}
                                        </td>
                                        <td className="py-2 px-3">
                                            {g.gelar_belakang ?? "-"}
                                        </td>
                                        <td className="py-2 px-3">
                                            {g.jenjang ?? "-"}
                                        </td>
                                        <td className="py-2 px-3">
                                            {g.prodi ?? "-"}
                                        </td>
                                        <td className="py-2 px-3">
                                            {g.mengajar ?? "-"}
                                        </td>
                                        <td className="py-2 px-3">
                                            {g.kompetensi ?? "-"}
                                        </td>

                                        <td className="py-2 px-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/master-data/guru/${g.id}`}
                                                    className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </Link>

                                                <Link
                                                    href={`/master-data/guru/${g.id}/edit`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        onEdit(g.id);
                                                    }}
                                                    className="px-3 py-2 bg-amber-500 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        router.delete(
                                                            `/master-data/guru/${g.id}`,
                                                            {
                                                                preserveScroll:
                                                                    true,
                                                            }
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-rose-500 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalFoto
                open={openFoto}
                foto={fotoAktif}
                nama={namaAktif}
                onClose={() => setOpenFoto(false)}
            />
        </>
    );
}
