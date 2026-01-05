import { useMemo, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import Toast from "@/Components/ui/Toast";
import { useUiFeedback } from "@/hooks/useUiFeedback";
import MapelTable from "./components/MapelTable";
import MapelModal from "./components/MapelModal";

type PageProps = {
    mapel: any[];
    gurus: any[];
    jurusans: any[];
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Index() {
    const { props } = usePage<PageProps & InertiaPageProps>();
    const { mapel, gurus, jurusans } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMapel, setSelectedMapel] = useState<any>(null);

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
        return mapel.filter(
            (m: any) =>
                m.nama.toLowerCase().includes(q) ||
                (m.kode_mapel && m.kode_mapel.toLowerCase().includes(q))
        );
    }, [mapel, searchTerm]);

    const handleAdd = () => {
        setSelectedMapel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (m: any) => {
        setSelectedMapel(m);
        setIsModalOpen(true);
    };

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const numbered = paginated.map((m: any, i: number) => ({
        ...m,
        no: start + i + 1,
    }));

    return (
        <>
            <Toast open={toast.open} message={toast.message} type={toast.type} />
            <MapelTable
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

            <MapelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mapel={selectedMapel}
                gurus={gurus}
                jurusans={jurusans}
            />
        </>
    );
}
