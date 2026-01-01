import { Fragment } from "react";
import { User, MapPin, School} from "lucide-react";

type Pendaftar = {
    id: number;
    no_pendaftaran: string;
    nama_lengkap: string;
    nisn: string;
    nik: string;
    jenis_kelamin: "L" | "P";
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    no_hp_siswa: string;
    alamat_jalan: string;
    rt_rw: string;
    desa_kelurahan: string;
    kecamatan: string;
    kota_kabupaten: string;
    provinsi: string;
    asal_sekolah: string;
    jurusan?: { kode: string; nama: string };
};

type Props = {
    open: boolean;
    data: Pendaftar | null;
    onClose: () => void;
};

export default function SiswaBaruDetailModal({ open, data, onClose }: Props) {
    if (!open || !data) return null;

    const sections = [
        {
            title: "Biodata Dasar",
            icon: <User size={16} className="text-sky-500" />,
            fields: [
                { label: "Nama Lengkap", value: data.nama_lengkap },
                { label: "NISN", value: data.nisn || "-" },
                { label: "NIK", value: data.nik || "-" },
                { label: "Jenis Kelamin", value: data.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan" },
                { label: "Tempat/Tgl Lahir", value: `${data.tempat_lahir || "-"}, ${data.tanggal_lahir || "-"}` },
                { label: "Agama", value: data.agama || "-" },
            ],
        },
        {
            title: "Kontak & Alamat",
            icon: <MapPin size={16} className="text-sky-500" />,
            fields: [
                { label: "HP Siswa", value: data.no_hp_siswa || "-" },
                { label: "Alamat", value: data.alamat_jalan || "-" },
                { label: "RT/RW", value: data.rt_rw || "-" },
                { label: "Desa/Kel", value: data.desa_kelurahan || "-" },
                { label: "Kecamatan", value: data.kecamatan || "-" },
                { label: "Kota/Kab", value: data.kota_kabupaten || "-" },
            ],
        },
        {
            title: "Akademik",
            icon: <School size={16} className="text-sky-500" />,
            fields: [
                { label: "Asal Sekolah", value: data.asal_sekolah || "-" },
                { label: "Pilihan Jurusan", value: data.jurusan?.kode || "-" },
                { label: "No Pendaftaran", value: data.no_pendaftaran },
            ],
        },
    ];

    return (
        <Fragment>
            <div className="fixed inset-0 z-9999 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
                <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl pointer-events-auto overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Detail Calon Siswa</h2>
                            <p className="text-xs text-gray-500 font-mono">{data.no_pendaftaran}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {sections.map((section, idx) => (
                                <div key={idx} className={`${idx === 2 ? "md:col-span-2" : ""}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        {section.icon}
                                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                            {section.title}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {section.fields.map((f, fidx) => (
                                            <div key={fidx}>
                                                <dt className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                                                    {f.label}
                                                </dt>
                                                <dd className="text-sm font-medium text-gray-700 mt-0.5">
                                                    {f.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </div>
                                    {idx < 2 && <div className="mt-8 border-b border-gray-100 md:hidden" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <button
                            onClick={onClose}
                            className="rounded cursor-pointer border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
