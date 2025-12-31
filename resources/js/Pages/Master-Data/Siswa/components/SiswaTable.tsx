// resources/js/Pages/Master-Data/Siswa/components/SiswaTable.tsx

import { Link, router } from "@inertiajs/react";
import { Eye, MapPin, Pencil, Trash2, User } from "lucide-react";
import MapsModal from "./MapsModal";
import ModalFoto from "./ModalFoto";
import { useState } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import { useUiFeedback } from "@/hooks/useUiFeedback";

export default function SiswaTable({ data, loading, onEdit }) {
    const [openMaps, setOpenMaps] = useState(false);
    const [selectedMap, setSelectedMap] = useState(null);

    const [openFoto, setOpenFoto] = useState(false);
    const [fotoData, setFotoData] = useState<{
        foto: string | null;
        nama: string | null;
    } | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { toast, showToast } = useUiFeedback();

    function openMapsModal(s) {
        setSelectedMap(s);
        setOpenMaps(true);
    }

    function openFotoModal(s) {
        setFotoData({ foto: s.foto, nama: s.nama });
        setOpenFoto(true);
    }

    function formatDateShort(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("id-ID", { month: "short" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    return (
        <div className="rounded border border-gray-200 bg-white">
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-max text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-sky-100 text-gray-700 h-12">
                            <th className="p-3 text-center">No</th>
                            <th className="p-3">Nama</th>
                            <th className="p-3 text-center">NIPD</th>
                            <th className="p-3 text-center">NISN</th>
                            <th className="p-3 text-center">JK</th>
                            <th className="p-3 text-center">Tgl Lahir</th>
                            <th className="p-3 text-center">Rombel</th>
                            <th className="p-3">Alamat</th>
                            <th className="p-3 text-center">HP</th>
                            <th className="p-3">Ayah</th>
                            <th className="p-3">Ibu</th>
                            <th className="p-3 text-center">Maps</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={13} className="p-4 text-center">
                                    Memuat data...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={13} className="p-4 text-center">
                                    Tidak ada data siswa.
                                </td>
                            </tr>
                        ) : (
                            data.map((s) => (
                                <tr
                                    key={s.id}
                                    className="border-b border-gray-200 hover:bg-sky-50"
                                >
                                    <td className="py-2 px-3 text-center">
                                        {s.no}
                                    </td>

                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openFotoModal(s)}
                                                className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer overflow-hidden shrink-0 flex items-center justify-center hover:outline-none hover:ring-2 hover:ring-sky-400"
                                                title="Lihat foto"
                                            >
                                                {s.foto ? (
                                                    <img
                                                        src={`/storage/${s.foto}`}
                                                        alt={s.nama}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>

                                            <span>{s.nama}</span>
                                        </div>
                                    </td>

                                    <td className="py-2 px-3 text-center">
                                        {s.nipd ?? "-"}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {s.nisn ?? "-"}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {s.jk}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {formatDateShort(s.tanggal_lahir)}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {s.rombel_nama ?? "-"}
                                    </td>

                                    <td className="py-2 px-3 whitespace-nowrap">
                                        {[
                                            s.alamat,
                                            s.rt || s.rw
                                                ? `RT${s.rt || ""}${
                                                      s.rt && s.rw ? "/" : ""
                                                  }${s.rw ? `RW${s.rw}` : ""}`
                                                : "",
                                            s.kelurahan,
                                            s.kecamatan,
                                        ]
                                            .filter(Boolean)
                                            .join(", ") || "-"}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {s.hp ?? "-"}
                                    </td>
                                    <td className="py-2 px-3">
                                        {s.ayah_nama ?? "-"}
                                    </td>
                                    <td className="py-2 px-3">
                                        {s.ibu_nama ?? "-"}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        <button
                                            onClick={() => openMapsModal(s)}
                                            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs flex items-center gap-1 mx-auto"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            Buka
                                        </button>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/master-data/siswa/${s.id}`}
                                                className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </Link>

                                            <Link
                                                href={`/master-data/siswa/${s.id}/edit`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onEdit(s.id);
                                                }}
                                                className="px-3 py-2 bg-amber-500 text-white rounded-md text-xs flex items-center gap-1"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => {
                                                    console.log(
                                                        "ID SISWA:",
                                                        s.id
                                                    );
                                                    setSelectedId(s.id);
                                                    setConfirmOpen(true);
                                                }}
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

                {openMaps && (
                    <MapsModal
                        student={selectedMap}
                        onClose={() => setOpenMaps(false)}
                    />
                )}

                {openFoto && fotoData && (
                    <ModalFoto
                        open={openFoto}
                        foto={fotoData.foto}
                        nama={fotoData.nama}
                        onClose={() => setOpenFoto(false)}
                    />
                )}

                <ConfirmDialog
                    open={confirmOpen}
                    title="Hapus Siswa"
                    message="Data siswa yang dihapus tidak dapat dikembalikan. Lanjutkan?"
                    variant="danger"
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        if (!selectedId) return;

                        router.delete(`/master-data/siswa/${selectedId}`, {
                            preserveScroll: true,
                            onSuccess: () => {
                                showToast("Siswa berhasil dihapus");
                                setConfirmOpen(false);
                                setSelectedId(null);
                            },
                            onError: () => {
                                showToast("Gagal menghapus siswa", "error");
                            },
                        });
                    }}
                />

                <Toast
                    open={toast.open}
                    message={toast.message}
                    type={toast.type}
                />
            </div>
        </div>
    );
}
