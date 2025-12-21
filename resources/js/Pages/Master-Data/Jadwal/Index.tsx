import { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import JadwalTable from "./components/JadwalTable";

export default function Index() {
    const { jadwal } = usePage<any>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return jadwal.filter(
            (j: any) =>
                j.kelas?.nama.toLowerCase().includes(q) ||
                j.guru?.nama.toLowerCase().includes(q) ||
                j.mapel?.nama.toLowerCase().includes(q)
        );
    }, [jadwal, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    const numbered = paginated.map((j: any, i: number) => ({
        ...j,
        no: start + i + 1,
    }));

    return (
        <>
            <JadwalTable
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
            />
        </>
    );
}
