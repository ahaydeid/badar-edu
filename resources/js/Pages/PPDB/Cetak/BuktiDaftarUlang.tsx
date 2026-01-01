
import { Head } from "@inertiajs/react";
import { useEffect } from "react";

type Props = {
    pendaftar: {
        no_pendaftaran: string;
        nama: string;
        jurusan: string;
        asal_sekolah: string;
        alamat: string;
        tanggal_daftar: string;
    };
    schoolProfile: {
        school_name?: string;
        school_address?: string;
        school_phone?: string;
        school_logo?: string;
    };
    committeeName: string;
};

export default function BuktiDaftarUlang({ pendaftar, schoolProfile, committeeName }: Props) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="bg-white p-8 text-black max-w-2xl mx-auto font-serif print:max-w-none print:mx-0">
            <Head title={`Bukti Daftar Ulang - ${pendaftar.nama}`} />
            
            <style>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                    }
                    /* Add padding to the container instead since body margin might be ignored or tricky */
                    .print-container {
                        padding: 2cm;
                    }
                }
            `}</style>

            <div className="print-container">
            {/* KOP SURAT */}
            <div className="flex items-center gap-4 border-b-2 border-black pb-4 mb-6">
                <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                    {schoolProfile?.school_logo ? (
                         <img src={schoolProfile.school_logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                         <div className="w-full h-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-gray-400">LOGO</div>
                    )}
                </div>
                <div className="text-center flex-1">
                    <h1 className="text-xl font-bold uppercase tracking-wide">{schoolProfile?.school_name || "Nama Sekolah"}</h1>
                    <p className="text-sm">{schoolProfile?.school_address || "Alamat Sekolah"}</p>
                    <p className="text-sm">{schoolProfile?.school_phone || "Telepon"}</p>
                </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-lg font-bold underline">BUKTI DAFTAR ULANG SISWA BARU</h2>
                <p>Tahun Ajaran 2025/2026</p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed mb-8">
                <p>
                    Telah diterima daftar ulang peserta didik baru dengan rincian sebagai berikut:
                </p>

                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="w-40 py-1 font-semibold">No Pendaftaran</td>
                            <td className="w-4">:</td>
                            <td>{pendaftar.no_pendaftaran}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-semibold">Nama Lengkap</td>
                            <td>:</td>
                            <td>{pendaftar.nama}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-semibold">Asal Sekolah</td>
                            <td>:</td>
                            <td>{pendaftar.asal_sekolah}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-semibold">Jurusan Diterima</td>
                            <td>:</td>
                            <td>{pendaftar.jurusan}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-semibold">Tanggal Daftar</td>
                            <td>:</td>
                            <td>{pendaftar.tanggal_daftar}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="border border-black p-4 mb-8 text-xs">
                <strong>Catatan:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Kartu ini adalah bukti sah bahwa siswa telah melakukan daftar ulang.</li>
                    <li>Simpan kartu ini dengan baik untuk keperluan administrasi selanjutnya.</li>
                    <li>Harap membawa kartu ini saat hari pertama masuk sekolah.</li>
                </ul>
            </div>

            {/* TTD AREA */}
            <div className="flex justify-end mt-12">
                <div className="text-center w-48">
                    <p className="mb-16">Badar, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold border-b border-black inline-block min-w-[120px]">
                        {committeeName}
                    </p>
                </div>
            </div>
            </div>
        </div>
    );
}

BuktiDaftarUlang.layout = (page: React.ReactNode) => page;
