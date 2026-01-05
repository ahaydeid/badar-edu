// resources/js/Pages/Master-Data/Guru/Index.tsx

import { useState, useMemo, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import Toast from "@/Components/ui/Toast";
import { useUiFeedback } from "@/hooks/useUiFeedback";
import {
    UserPlus,
    Upload,
    Download,
    FileSpreadsheet,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import GuruTable from "./components/GuruTable";
import TambahGuru from "./components/TambahGuru";

type GuruRow = any;

type PageProps = {
    guru: GuruRow[];
    canEdit: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Index() {
    const { props } = usePage<PageProps & InertiaPageProps>();
    const { guru, canEdit } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [openForm, setOpenForm] = useState(false);

    const [editId, setEditId] = useState<number | null>(null);
    const [editInitial, setEditInitial] = useState<any>(null);

    // Toast Handling
    const { toast, showToast } = useUiFeedback();

    useEffect(() => {
        if (props.flash?.success) {
            showToast(props.flash.success, 'success');
        }
        if (props.flash?.error) {
            showToast(props.flash.error, 'error');
        }
    }, [props.flash]);

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return guru.filter(
            (r) =>
                (r.nama ?? "").toLowerCase().includes(q) ||
                (r.nip ?? "").toLowerCase().includes(q)
        );
    }, [guru, searchTerm]);

    async function handleOpenEdit(id: number) {
        const res = await fetch(`/master-data/guru/${id}/edit`, {
            headers: { Accept: "application/json" },
        });

        if (!res.ok) return;

        const payload = await res.json();
        setEditId(id);
        setEditInitial(payload);
        setOpenForm(true);
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const numbered = paginated.map((r, i) => ({
        ...r,
        no: start + i + 1,
    }));

    return (
        <>
            <Toast open={toast.open} message={toast.message} type={toast.type} />
            <div className="w-full space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center text-sm gap-2 flex-wrap">
                        <button
                            onClick={() => {
                                setEditId(null);
                                setEditInitial(null);
                                setOpenForm(true);
                            }}
                            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                        >
                            <UserPlus className="w-4 h-4" />
                            Tambah Guru
                        </button>

                        <button className="flex cursor-pointer items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">
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
                            Data Guru
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
                                placeholder="Cari nama / NIP..."
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

                <GuruTable
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

            <TambahGuru
                open={openForm}
                onClose={() => setOpenForm(false)}
                editId={editId}
                initialData={editInitial}
            />
        </>
    );
}
