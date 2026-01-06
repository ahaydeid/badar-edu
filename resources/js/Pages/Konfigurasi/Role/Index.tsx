import { useMemo, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import RoleTable from "./components/RoleTable";
import RoleModal from "./components/RoleModal";
import Toast from "@/Components/ui/Toast";

export default function Index() {
    const { roles, flash, allPermissions } = usePage<any>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Toast State
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
        return roles.filter(
            (r: any) =>
                (r.display_name ?? "").toLowerCase().includes(q) ||
                (r.name ?? "").toLowerCase().includes(q) ||
                (r.description ?? "").toLowerCase().includes(q)
        );
    }, [roles, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const numbered = paginated.map((r: any, i: number) => ({
        ...r,
        no: start + i + 1,
    }));

    return (
        <>
            <Toast 
                open={toast.open} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, open: false })}
            />

            <RoleTable
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
                onAdd={() => setIsModalOpen(true)}
            />

            <RoleModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}
