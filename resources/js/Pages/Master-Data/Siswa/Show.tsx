import React, { useState } from "react";
import { ArrowLeft, Download, User, Pencil, Trash2 } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import ModalFoto from "./components/ModalFoto";

/* ===================== TYPES ===================== */

interface DetailProps {
    label: string;
    value: string | number | null | undefined;
}

type StudentDetail = {
    [key: string]: any;
};

/* ===================== PAGE ===================== */

export default function SiswaDetailPage() {
    const { student } = usePage<InertiaPageProps & { student: StudentDetail }>()
        .props;

    const [openFoto, setOpenFoto] = useState(false);

    function formatDate(dateString: string | null | undefined) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("id-ID", { month: "long" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    return (
        <>
            <div className="w-full max-w-7xl mx-auto pb-6 px-2 space-y-10">
                {/* BACK BUTTON */}
                <Link
                    href="/master-data/siswa"
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </Link>

                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        {/* FOTO (CLICKABLE) */}
                        <button
                            onClick={() => setOpenFoto(true)}
                            className="w-20 h-20 rounded-full bg-gray-200 border border-gray-100 overflow-hidden flex items-center justify-center hover:outline-none hover:ring-2 hover:ring-sky-400"
                            title="Lihat foto"
                        >
                            {student.foto ? (
                                <img
                                    src={`/storage/${student.foto}`}
                                    alt={student.nama}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-gray-500" />
                            )}
                        </button>

                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                                {student.nama}
                            </h1>
                            <p className="text-sm text-slate-500">
                                NISN: {student.nisn ?? "-"}
                            </p>
                        </div>
                    </div>

                    <button className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-sky-600 text-white hover:bg-sky-700">
                        <Download className="w-4 h-4" />
                        Unduh Data
                    </button>
                </div>

                {/* CONTENT */}
                <div className="columns-1 md:columns-2 gap-3">
                    {/* DATA PRIBADI */}
                    <DataCard title="Data Pribadi">
                        <DetailItem label="Nama" value={student.nama} />
                        <DetailItem label="NIPD" value={student.nipd} />
                        <DetailItem label="NISN" value={student.nisn} />
                        <DetailItem
                            label="Jenis Kelamin"
                            value={
                                student.jk === "L"
                                    ? "Laki-laki"
                                    : student.jk === "P"
                                    ? "Perempuan"
                                    : "-"
                            }
                        />
                        <DetailItem
                            label="Tempat Lahir"
                            value={student.tempat_lahir}
                        />
                        <DetailItem
                            label="Tanggal Lahir"
                            value={formatDate(student.tanggal_lahir)}
                        />
                        <DetailItem label="Agama" value={student.agama} />
                        <DetailItem
                            label="Jenis Tinggal"
                            value={student.jenis_tinggal}
                        />
                        <DetailItem
                            label="Transportasi"
                            value={student.alat_transportasi}
                        />
                        <DetailItem label="Telepon" value={student.telepon} />
                        <DetailItem label="HP" value={student.hp} />
                        <DetailItem label="Email" value={student.email} />
                        <DetailItem label="SKHUN" value={student.skhun} />
                        <DetailItem label="Anak ke-" value={student.anak_ke} />
                    </DataCard>

                    {/* IDENTITAS */}
                    <DataCard title="Identitas Kependudukan">
                        <DetailItem label="NIK" value={student.nik} />
                        <DetailItem label="No KK" value={student.no_kk} />
                        <DetailItem
                            label="No Akta Lahir"
                            value={student.no_reg_akta}
                        />
                    </DataCard>

                    {/* ALAMAT */}
                    <DataCard title="Alamat">
                        <DetailItem label="Alamat" value={student.alamat} />
                        <DetailItem label="RT" value={student.rt} />
                        <DetailItem label="RW" value={student.rw} />
                        <DetailItem label="Dusun" value={student.dusun} />
                        <DetailItem
                            label="Kelurahan"
                            value={student.kelurahan}
                        />
                        <DetailItem
                            label="Kecamatan"
                            value={student.kecamatan}
                        />
                        <DetailItem label="Kode Pos" value={student.kode_pos} />
                        <DetailItem
                            label="Jarak ke Sekolah"
                            value={student.jarak_rumah}
                        />
                        <DetailItem label="Latitude" value={student.lintang} />
                        <DetailItem label="Longitude" value={student.bujur} />

                        <div className="col-span-2 mt-4">
                            <iframe
                                className="w-full h-64 rounded-xl border border-slate-300"
                                src={`https://www.google.com/maps?q=${student.lintang},${student.bujur}&hl=id&z=15&output=embed`}
                                loading="lazy"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </DataCard>

                    {/* AYAH */}
                    <DataCard title="Data Ayah">
                        <DetailItem
                            label="Nama Ayah"
                            value={student.ayah_nama}
                        />
                        <DetailItem
                            label="Tahun Lahir"
                            value={student.ayah_tahun_lahir}
                        />
                        <DetailItem
                            label="Pendidikan"
                            value={student.ayah_pendidikan}
                        />
                        <DetailItem
                            label="Pekerjaan"
                            value={student.ayah_pekerjaan}
                        />
                        <DetailItem
                            label="Penghasilan"
                            value={student.ayah_penghasilan}
                        />
                        <DetailItem label="NIK Ayah" value={student.ayah_nik} />
                    </DataCard>

                    {/* IBU */}
                    <DataCard title="Data Ibu">
                        <DetailItem label="Nama Ibu" value={student.ibu_nama} />
                        <DetailItem
                            label="Tahun Lahir"
                            value={student.ibu_tahun_lahir}
                        />
                        <DetailItem
                            label="Pendidikan"
                            value={student.ibu_pendidikan}
                        />
                        <DetailItem
                            label="Pekerjaan"
                            value={student.ibu_pekerjaan}
                        />
                        <DetailItem
                            label="Penghasilan"
                            value={student.ibu_penghasilan}
                        />
                        <DetailItem label="NIK Ibu" value={student.ibu_nik} />
                    </DataCard>

                    {/* WALI */}
                    <DataCard title="Data Wali">
                        <DetailItem
                            label="Nama Wali"
                            value={student.wali_nama}
                        />
                        <DetailItem
                            label="Tahun Lahir"
                            value={student.wali_tahun_lahir}
                        />
                        <DetailItem
                            label="Pendidikan"
                            value={student.wali_pendidikan}
                        />
                        <DetailItem
                            label="Pekerjaan"
                            value={student.wali_pekerjaan}
                        />
                        <DetailItem
                            label="Penghasilan"
                            value={student.wali_penghasilan}
                        />
                        <DetailItem label="NIK Wali" value={student.wali_nik} />
                    </DataCard>

                    {/* AKADEMIK */}
                    <DataCard title="Data Akademik">
                        <DetailItem
                            label="Rombel Saat Ini"
                            value={student.rombel_nama}
                        />
                        <DetailItem
                            label="No Peserta UN"
                            value={student.no_peserta_un}
                        />
                        <DetailItem
                            label="No Seri Ijazah"
                            value={student.no_seri_ijazah}
                        />
                    </DataCard>

                    {/* BANTUAN */}
                    <DataCard title="Bantuan Pemerintah">
                        <DetailItem
                            label="Penerima KPS"
                            value={student.penerima_kps}
                        />
                        <DetailItem label="No KPS" value={student.no_kps} />
                        <DetailItem
                            label="Penerima KIP"
                            value={student.penerima_kip}
                        />
                        <DetailItem
                            label="Nomor KIP"
                            value={student.nomor_kip}
                        />
                        <DetailItem
                            label="Nama di KIP"
                            value={student.nama_di_kip}
                        />
                        <DetailItem
                            label="Nomor KKS"
                            value={student.nomor_kks}
                        />
                        <DetailItem
                            label="Layak PIP"
                            value={student.layak_pip}
                        />
                        <DetailItem
                            label="Alasan Layak PIP"
                            value={student.alasan_layak_pip}
                        />
                    </DataCard>

                    {/* KESEHATAN */}
                    <DataCard title="Kesehatan & Fisik">
                        <DetailItem
                            label="Kebutuhan Khusus"
                            value={student.kebutuhan_khusus}
                        />
                        <DetailItem
                            label="Berat Badan"
                            value={student.berat_badan}
                        />
                        <DetailItem
                            label="Tinggi Badan"
                            value={student.tinggi_badan}
                        />
                        <DetailItem
                            label="Lingkar Kepala"
                            value={student.lingkar_kepala}
                        />
                        <DetailItem
                            label="Jumlah Saudara Kandung"
                            value={student.jumlah_saudara}
                        />
                    </DataCard>

                    {/* BANK */}
                    <DataCard title="Data Perbankan">
                        <DetailItem label="Bank" value={student.bank} />
                        <DetailItem
                            label="Nomor Rekening"
                            value={student.bank_rekening}
                        />
                        <DetailItem
                            label="Atas Nama"
                            value={student.bank_atas_nama}
                        />
                    </DataCard>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 pt-2">
                    <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-amber-400 hover:bg-amber-500">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>

                    <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-rose-600 text-white hover:bg-rose-700">
                        <Trash2 className="w-4 h-4" />
                        Hapus
                    </button>
                </div>
            </div>

            {/* MODAL FOTO */}
            {openFoto && (
                <ModalFoto
                    open={openFoto}
                    foto={student.foto}
                    nama={student.nama}
                    onClose={() => setOpenFoto(false)}
                />
            )}
        </>
    );
}

/* ===================== COMPONENTS ===================== */

const DetailItem = ({ label, value }: DetailProps) => (
    <div className="space-y-1">
        <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            {label}
        </div>
        <div className="text-lg font-medium text-slate-900">{value ?? "-"}</div>
    </div>
);

function DataCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-3 break-inside-avoid rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-sky-600 mb-4">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {children}
            </div>
        </div>
    );
}
