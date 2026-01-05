// resources/js/Pages/Master-Data/Siswa/Index.tsx

import { useState, useMemo } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps, router } from "@inertiajs/core";
import {
    UserPlus,
    Upload,
    Download,
    FileSpreadsheet,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import SiswaTable from "./components/SiswaTable";
import TambahSiswaModal from "./components/TambahSiswa";
import ImportSiswaModal from "./components/ImportSiswaModal";
import Toast from "@/Components/ui/Toast";
import { useUiFeedback } from "@/hooks/useUiFeedback";

type StudentRow = any;

type PageProps = {
    students: StudentRow[];
    rombelList: { id: number; nama: string }[];
    canEdit: boolean;
};

export default function Index() {
    const { students, rombelList, canEdit } = usePage<PageProps & InertiaPageProps>()
        .props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editInitial, setEditInitial] = useState<any>(null);
    const { toast, showToast } = useUiFeedback();

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return students.filter(
            (r) =>
                (r.nama ?? "").toLowerCase().includes(q) ||
                (r.rombel_nama ?? "").toLowerCase().includes(q)
        );
    }, [students, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);

    const numbered = paginated.map((r, i) => ({ ...r, no: start + i + 1 }));

    async function handleOpenCreate() {
        setEditId(null);
        setEditInitial(null);
        setIsModalOpen(true);
    }

    async function handleOpenEdit(id: number) {
        const res = await fetch(`/master-data/siswa/${id}/edit`, {
            headers: { Accept: "application/json" },
        });

        if (!res.ok) return;

        const payload = await res.json();
        setEditId(id);
        setEditInitial(payload);
        setIsModalOpen(true);
    }

    return (
        <>
            <div className="w-full space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center text-sm gap-2 flex-wrap">
                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                        >
                            <UserPlus className="w-4 h-4" />
                            Tambah Siswa
                        </button>

                        <button
                            onClick={() => setImportOpen(true)}
                            className="flex items-center gap-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                        >
                            <Upload className="w-4 h-4" />
                            Import
                        </button>

                        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-xl font-semibold text-gray-800">
                            Data Siswa
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
                                placeholder="Cari nama / rombel..."
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

                <SiswaTable
                    data={numbered}
                    loading={false}
                    onEdit={handleOpenEdit}
                    canEdit={canEdit}
                />

                <div className="flex justify-end items-center gap-3">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="text-sm text-gray-600">
                        {page} dari {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <TambahSiswaModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                rombelList={rombelList}
                editId={editId}
                initialData={editInitial}
                onSuccess={(msg) => showToast(msg, "success")}
                onError={(msg) => showToast(msg, "error")}
            />

            <ImportSiswaModal
                open={importOpen}
                onClose={() => setImportOpen(false)}
                onImported={() => {
                    showToast("Import data siswa berhasil", "success");
                    router.reload({ only: ["students"] });
                }}
            />

            <Toast
                open={toast.open}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}
