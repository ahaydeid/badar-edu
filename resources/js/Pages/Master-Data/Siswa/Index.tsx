import { useState, useMemo } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import AppLayout from "@/Layouts/AppLayout";
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

/* ===================== TYPES ===================== */

type StudentRow = {
    id: number;
    nama: string;
    foto: string | null;
    nipd: string | null;
    jk: "L" | "P" | null;
    nisn: string | null;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    nik: string | null;
    agama: string | null;
    alamat: string | null;
    rt: string | null;
    rw: string | null;
    dusun: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    kode_pos: string | null;
    jenis_tinggal: string | null;
    alat_transportasi: string | null;
    telepon: string | null;
    hp: string | null;
    email: string | null;
    skhun: string | null;

    penerima_kps: string;
    nomor_kps: string | null;

    ayah_nama: string | null;
    ayah_tahun_lahir: number | null;
    ayah_pendidikan: string | null;
    ayah_pekerjaan: string | null;
    ayah_penghasilan: string | null;
    ayah_nik: string | null;

    ibu_nama: string | null;
    ibu_tahun_lahir: number | null;
    ibu_pendidikan: string | null;
    ibu_pekerjaan: string | null;
    ibu_penghasilan: string | null;
    ibu_nik: string | null;

    wali_nama: string | null;
    wali_tahun_lahir: number | null;
    wali_pendidikan: string | null;
    wali_pekerjaan: string | null;
    wali_penghasilan: string | null;
    wali_nik: string | null;

    rombel_id: number | null;
    rombel_nama: string | null;
};

type PageProps = {
    students: StudentRow[];
    rombelList: {
        id: number;
        nama: string;
    }[];
};

/* ===================== PAGE ===================== */

export default function Index() {
    const { students, rombelList } = usePage<PageProps & InertiaPageProps>()
        .props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [isTambahOpen, setIsTambahOpen] = useState(false);

    /* ===================== FILTER ===================== */
    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return students.filter(
            (r) =>
                (r.nama ?? "").toLowerCase().includes(q) ||
                (r.rombel_nama ?? "").toLowerCase().includes(q)
        );
    }, [students, searchTerm]);

    /* ===================== PAGINATION ===================== */
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);

    const numbered = paginated.map((r, i) => ({
        ...r,
        no: start + i + 1,
    }));

    return (
        <AppLayout title="Master Data Siswa">
            <div className="w-full space-y-6">
                {/* HEADER */}
                <div className="space-y-4">
                    <div className="flex items-center text-sm gap-2 flex-wrap">
                        <button
                            onClick={() => setIsTambahOpen(true)}
                            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                        >
                            <UserPlus className="w-4 h-4" />
                            Tambah Siswa
                        </button>

                        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">
                            <Upload className="w-4 h-4" />
                            Import
                        </button>

                        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">
                            <Download className="w-4 h-4" />
                            Export
                        </button>

                        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 rounded">
                            <FileSpreadsheet className="w-4 h-4" />
                            Unduh Template
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

                {/* TABLE */}
                <SiswaTable data={numbered} loading={false} />

                {/* PAGINATION */}
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

            {/* MODAL */}
            <TambahSiswaModal
                open={isTambahOpen}
                onClose={() => setIsTambahOpen(false)}
                rombelList={rombelList}
            />
        </AppLayout>
    );
}
