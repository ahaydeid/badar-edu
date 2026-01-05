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

type GuruDetail = {
    [key: string]: any;
};

/* ===================== PAGE ===================== */

export default function GuruDetailPage() {
    const { guru } = usePage<InertiaPageProps & { guru: GuruDetail }>().props;

    const [openFoto, setOpenFoto] = useState(false);

    function formatDate(dateString: string | null | undefined) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("id-ID", { month: "long" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    // ===================== NAMA & GELAR =====================
    const gelarDepan = guru.gelar_depan
        ? guru.gelar_depan.endsWith(".")
            ? guru.gelar_depan
            : `${guru.gelar_depan}.`
        : "";

    const gelarBelakang = guru.gelar_belakang
        ? guru.gelar_belakang.startsWith(",")
            ? guru.gelar_belakang
            : `, ${guru.gelar_belakang}`
        : "";

    const namaLengkap = `${gelarDepan} ${guru.nama}${gelarBelakang}`.trim();

    return (
        <>
            <div className="w-full max-w-7xl mx-auto pb-6 px-2 space-y-10">
                {/* BACK BUTTON */}
                <Link
                    href="/master-data/guru"
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </Link>

                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        {/* FOTO */}
                        <button
                            onClick={() => setOpenFoto(true)}
                            className="w-20 h-20 rounded-full bg-gray-200 border border-gray-100 overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-sky-400"
                        >
                            {guru.foto ? (
                                <img
                                    src={`/storage/${guru.foto}`}
                                    alt={guru.nama}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-gray-500" />
                            )}
                        </button>

                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                                {namaLengkap}
                            </h1>
                            <p className="text-sm text-slate-500">
                                NIP: {guru.nip ?? "-"}
                            </p>
                        </div>
                    </div>

                    <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-sky-600 text-white hover:bg-sky-700">
                        <Download className="w-4 h-4" />
                        Unduh Data
                    </button>
                </div>

                {/* CONTENT */}
                <div className="columns-1 md:columns-2 gap-3">
                    {/* DATA PRIBADI */}
                    <DataCard title="Data Pribadi">
                        <DetailItem label="Nama" value={guru.nama} />
                        <DetailItem label="NIP" value={guru.nip} />
                        <DetailItem label="NIK" value={guru.nik} />
                        <DetailItem label="NUPTK" value={guru.nuptk} />
                        <DetailItem
                            label="Jenis Kelamin"
                            value={
                                guru.jk === "L"
                                    ? "Laki-laki"
                                    : guru.jk === "P"
                                    ? "Perempuan"
                                    : "-"
                            }
                        />
                        <DetailItem
                            label="Tempat Lahir"
                            value={guru.tempat_lahir}
                        />
                        <DetailItem
                            label="Tanggal Lahir"
                            value={formatDate(guru.tanggal_lahir)}
                        />
                        <DetailItem
                            label="Status Kepegawaian"
                            value={guru.status_kepegawaian}
                        />
                        <DetailItem label="Jenis PTK" value={guru.jenis_ptk} />
                    </DataCard>

                    {/* PENDIDIKAN */}
                    <DataCard title="Pendidikan">
                        <DetailItem
                            label="Gelar Depan"
                            value={gelarDepan || "-"}
                        />
                        <DetailItem
                            label="Gelar Belakang"
                            value={guru.gelar_belakang}
                        />
                        <DetailItem label="Jenjang" value={guru.jenjang} />
                        <DetailItem label="Prodi" value={guru.prodi} />
                        <DetailItem
                            label="Sertifikasi"
                            value={guru.sertifikasi}
                        />
                    </DataCard>

                    {/* KEPEGAWAIAN */}
                    <DataCard title="Kepegawaian">
                        <DetailItem
                            label="TMT Kerja"
                            value={formatDate(guru.tmt_kerja)}
                        />
                        <DetailItem
                            label="Tugas Tambahan"
                            value={guru.tugas_tambahan}
                        />
                        <DetailItem
                            label="Jam Tugas Tambahan"
                            value={guru.jam_tugas_tambahan}
                        />
                    </DataCard>

                    {/* MENGAJAR */}
                    <DataCard title="Mengajar">
                        <DetailItem
                            label="Mata Pelajaran"
                            value={guru.mengajar}
                        />
                        <DetailItem label="JJM" value={guru.jjm} />
                        <DetailItem label="Total JJM" value={guru.total_jjm} />
                    </DataCard>

                    {/* KOMPETENSI */}
                    <DataCard title="Kompetensi">
                        <DetailItem
                            label="Kompetensi"
                            value={guru.kompetensi}
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
                    foto={guru.foto}
                    nama={namaLengkap}
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
