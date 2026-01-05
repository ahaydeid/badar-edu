import { useMemo, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import SemesterTable from "./components/SemesterTable";
import SemesterModal from "./components/SemesterModal";
import Toast from "@/Components/ui/Toast";

export default function Index() {
    const { semester, flash } = usePage<any>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState<any>(null);
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
        return semester.filter(
            (s: any) =>
                s.nama.toLowerCase().includes(q) ||
                s.tipe.toLowerCase().includes(q)
        );
    }, [semester, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const numbered = paginated.map((s: any, i: number) => ({
        ...s,
        no: start + i + 1,
    }));

    const handleAdd = () => {
        setSelectedSemester(null);
        setIsModalOpen(true);
    };

    const handleEdit = (semester: any) => {
        setSelectedSemester(semester);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSemester(null);
    };

    return (
        <>
            <Toast 
                open={toast.open} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, open: false })}
            />

            <SemesterModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                semester={selectedSemester}
            />

            <SemesterTable
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
        </>
    );
}
