import { useMemo, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Eye, Pencil, User } from "lucide-react";
import ModalFoto from "./components/ModalFoto";
import TambahSiswaModal from "@/Pages/Master-Data/Siswa/components/TambahSiswa";
import Toast from "@/Components/ui/Toast";
import { useUiFeedback } from "@/hooks/useUiFeedback";

export default function Index() {
    const { siswa, kelas, rombelList, canEdit } = usePage<any>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [openFoto, setOpenFoto] = useState(false);
    const [fotoAktif, setFotoAktif] = useState<string | null>(null);
    const [namaAktif, setNamaAktif] = useState<string | null>(null);

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editInitial, setEditInitial] = useState<any>(null);
    const { toast, showToast } = useUiFeedback();

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return siswa.filter((s: any) => s.nama.toLowerCase().includes(q));
    }, [siswa, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const numbered = paginated.map((s: any, i: number) => ({
        ...s,
        no: start + i + 1,
    }));

    async function handleOpenEdit(id: number) {
        const res = await fetch(`/kelas-binaan/siswa/${id}/edit`, {
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            showToast("Gagal memuat data siswa", "error");
            return;
        }

        const payload = await res.json();
        setEditId(id);
        setEditInitial(payload);
        setIsEditModalOpen(true);
    }

    return (
        <div className="w-full space-y-6">
            {/* ACTION BAR */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Data Siswa Kelas {kelas.nama}
                    </h1>

                    <div className="flex text-sm items-center gap-3">
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="border border-gray-200 px-3 py-2 rounded-lg w-[90px]"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Cari nama siswa..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="w-64 border border-gray-200 px-3 py-2 rounded-lg"
                        />
                    </div>
                </div>
            </div>
            {/* TABLE */}
            <div className="rounded border border-gray-200 bg-white">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-max text-sm text-left">
                        <thead>
                            <tr className="bg-sky-100 text-gray-700 h-12">
                                <th className="p-3 text-center">No</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3 text-center">JK</th>
                                <th className="p-3 text-center">NIPD</th>
                                <th className="p-3 text-center">NIS</th>
                                <th className="p-3 text-center">NISN</th>
                                <th className="p-3 text-center">
                                    Status Kedisiplinan
                                </th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {numbered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center">
                                        Tidak ada data siswa.
                                    </td>
                                </tr>
                            ) : (
                                numbered.map((s: any) => (
                                    <tr
                                        key={s.id}
                                        className="border-b border-gray-200 hover:bg-sky-50"
                                    >
                                        <td className="p-3 text-center">
                                            {s.no}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFotoAktif(
                                                            s.foto ?? null
                                                        );
                                                        setNamaAktif(
                                                            s.nama ?? null
                                                        );
                                                        setOpenFoto(true);
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer overflow-hidden shrink-0 flex items-center justify-center hover:ring-2 hover:ring-sky-400"
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

                                                <span className="font-medium">
                                                    {s.nama}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-3 text-center">
                                            {s.jenis_kelamin}
                                        </td>
                                        <td className="p-3 text-center">
                                            {s.nipd ?? "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {s.nis ?? "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {s.nisn ?? "-"}
                                        </td>
                                        <td className="p-3 text-center italic text-gray-400">
                                            Tidak ada sanksi
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/kelas-binaan/siswa/${s.id}`}
                                                    className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </Link>

                                                <button
                                                    onClick={() => {
                                                        if (!canEdit) return;
                                                        handleOpenEdit(s.id);
                                                    }}
                                                    disabled={!canEdit}
                                                    title={!canEdit ? "Pengeditan sedang dikunci" : "Perbarui data siswa"}
                                                    className={`px-3 py-2 rounded-md text-xs flex items-center gap-1 ${
                                                        canEdit 
                                                            ? "bg-amber-500 hover:bg-amber-600 text-white cursor-pointer" 
                                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Perbarui
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
            {/* PAGINATION */}
            <div className="flex justify-end items-center gap-3">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border rounded-lg disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-600">
                    {page} dari {totalPages}
                </span>

                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border rounded-lg disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <ModalFoto
                open={openFoto}
                foto={fotoAktif}
                nama={namaAktif}
                onClose={() => setOpenFoto(false)}
            />

            <TambahSiswaModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                rombelList={rombelList || []}
                editId={editId}
                initialData={editInitial}
                onSuccess={(msg) => showToast(msg, "success")}
                onError={(msg) => showToast(msg, "error")}
                baseUrl="/kelas-binaan/siswa"
            />

            <Toast
                open={toast.open}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
