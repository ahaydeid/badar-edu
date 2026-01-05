import { useMemo, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import KelasTable from "./components/KelasTable";
import KelasModal from "./components/KelasModal";
import Toast from "@/Components/ui/Toast";

export default function Index() {
    const { kelas, jurusans, gurus, flash } = usePage<any>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKelas, setSelectedKelas] = useState<any>(null);
    const [toast, setToast] = useState({ open: false, message: "", type: "success" as any });

    useEffect(() => {
        if (flash?.success) {
            setToast({ open: true, message: flash.success, type: "success" });
        }
        if (flash?.error) {
            setToast({ open: true, message: flash.error, type: "error" });
        }
    }, [flash]);

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return kelas.filter(
            (k: any) =>
                k.nama.toLowerCase().includes(q) ||
                String(k.tingkat).includes(q) ||
                k.jurusan?.nama.toLowerCase().includes(q) ||
                k.wali?.nama.toLowerCase().includes(q)
        );
    }, [kelas, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const numbered = paginated.map((k: any, i: number) => ({
        ...k,
        no: start + i + 1,
    }));

    const handleAdd = () => {
        setSelectedKelas(null);
        setIsModalOpen(true);
    };

    const handleEdit = (kelas: any) => {
        setSelectedKelas(kelas);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedKelas(null);
    };

    return (
        <>
            <Toast 
                open={toast.open} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, open: false })}
            />

            <KelasTable
                data={numbered}
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                searchTerm={searchTerm}
                onSearchChange={(v) => {
                    setSearchTerm(v);
                    setPage(1);
                }}
                onRowsChange={(v) => {
                    setRowsPerPage(v);
                    setPage(1);
                }}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                onAdd={handleAdd}
                onEdit={handleEdit}
            />

            <KelasModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                kelas={selectedKelas}
                jurusans={jurusans}
                gurus={gurus}
            />
        </>
    );
}
