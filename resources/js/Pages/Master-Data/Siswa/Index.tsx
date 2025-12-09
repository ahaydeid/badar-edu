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

type StudentRow = {
    id: number;
    nama: string;
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
    no_kps: string | null;

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

    rombel_saat_ini: number | null;
    no_peserta_un: string | null;
    no_seri_ijazah: string | null;
    penerima_kip: string;
    nomor_kip: string | null;
    nama_di_kip: string | null;
    nomor_kks: string | null;
    no_reg_akta: string | null;
    bank: string | null;
    bank_rekening: string | null;
    bank_atas_nama: string | null;
    layak_pip: string;
    alasan_layak_pip: string | null;
    kebutuhan_khusus: string | null;
    sekolah_asal: string | null;
    anak_ke: number | null;
    lintang: string | null;
    bujur: string | null;
    no_kk: string | null;
    berat_badan: number | null;
    tinggi_badan: number | null;
    lingkar_kepala: number | null;
    jumlah_saudara: number | null;
    jarak_rumah: number | string | null;
};

export default function Index() {
    // Ambil props dari Inertia dengan tipe aman
    const { students } = usePage<
        { students: StudentRow[] } & InertiaPageProps
    >().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    // FILTER
    const filtered = useMemo(() => {
        return students.filter((r) =>
            (r.nama ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    // PAGINATION
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);

    // NOMOR URUT
    const numbered = paginated.map((r, i) => ({
        ...r,
        no: start + i + 1,
    }));

    return (
        <AppLayout title="Master Data Siswa">   
            <div className="w-full space-y-6">
                {/* HEADER */}
                <div className="space-y-4">
                    {/* ACTION BUTTONS */}
                    <div className="flex items-center text-sm gap-2 flex-wrap">
                        <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded">
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

                    {/* TITLE + FILTER */}
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
                                placeholder="Cari nama..."
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
        </AppLayout>
    );
}
