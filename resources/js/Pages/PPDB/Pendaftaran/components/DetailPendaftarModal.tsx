
import { Fragment, useState } from "react";
import { X, Check, Download, FileText, Printer, Loader2 } from "lucide-react";
import { router } from "@inertiajs/react";
import Toast from "@/Components/ui/Toast";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

type Pendaftar = {
    id: number;
    no_pendaftaran: string;
    nama: string;
    nik: string;
    asalSekolah: string;
    jurusan: string;
    gelombang: string;
    tanggalDaftar: string;
    status: string;
    jenis_kelamin?: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    agama?: string;
    no_hp_siswa?: string;
    nama_ayah?: string;
    pekerjaan_ayah?: string;
    nama_ibu?: string;
    alamat_jalan?: string;
};

type Props = {
    open: boolean;
    data: Pendaftar | null;
    onClose: () => void;
    onSuccess?: (message: string, type: "success" | "error") => void;
    mode?: 'verification' | 'selection';
};

export default function DetailPendaftarModal({ open, data, onClose, onSuccess, mode = 'verification' }: Props) {
    const [verifying, setVerifying] = useState(false);
    const [confirmState, setConfirmState] = useState<{
        open: boolean;
        title: string;
        message: string;
        status: string;
        variant: "primary" | "danger" | "warning";
    }>({
        open: false,
        title: "",
        message: "",
        status: "",
        variant: "primary"
    });

    // Note Modal State
    const [noteModal, setNoteModal] = useState({
        open: false,
        type: 'return' as 'return' | 'reject',
        note: ''
    });

    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        type: "success" as "success" | "error"
    });

    const showToast = (message: string, type: "success" | "error") => {
        setToastState({ open: true, message, type });
        setTimeout(() => setToastState(p => ({ ...p, open: false })), 3000);
        if (onSuccess) {
            onSuccess(message, type);
        }
    };

    if (!open || !data) return null;

    const handlePrint = () => {
        let url = '';
        try {
            // @ts-ignore
            if (typeof window.route === 'function') {
                // @ts-ignore
                url = window.route('ppdb.pendaftaran.cetak', data.id);
            } else {
                url = `/ppdb/cetak/${data.id}`;
            }
            window.open(url, '_blank');
        } catch (e) {
            url = `/ppdb/cetak/${data.id}`;
            window.open(url, '_blank');
        }
    };

    const submitStatusUpdate = (status: string, note: string = '') => {
        setVerifying(true);
        setNoteModal(prev => ({ ...prev, open: false })); 
        setConfirmState(prev => ({ ...prev, open: false })); 

        let url = '';
        try {
            // @ts-ignore
            if (typeof window.route === 'function') {
                // @ts-ignore
                url = window.route('ppdb.verifikasi.update', data.id);
            } else {
                url = `/ppdb/verifikasi/${data.id}/status`;
            }
        } catch (error) {
            url = `/ppdb/verifikasi/${data.id}/status`;
        }

        router.put(url, {
            status: status,
            catatan: note
        }, {
            onSuccess: () => {
                showToast("Status pendaftar berhasil diperbarui", "success");
                setTimeout(() => {
                    onClose();
                }, 2000);
            },
            onError: (errors) => {
                console.error(errors);
                showToast("Gagal memperbarui status", "error");
            },
            onFinish: () => setVerifying(false)
        });
    };

    return (
        <Fragment>
            <Toast 
                open={toastState.open} 
                message={toastState.message} 
                type={toastState.type} 
            />
            {/* CONFIRMATION DIALOG */}
            <ConfirmDialog 
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={() => submitStatusUpdate(confirmState.status)}
                onClose={() => setConfirmState(prev => ({ ...prev, open: false }))}
                confirmText="Ya, Simpan"
                cancelText="Batal"
                variant={confirmState.variant}
            />

            {/* NOTE MODAL (RETURN / REJECT) */}
            {noteModal.open && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNoteModal(prev => ({ ...prev, open: false }))}></div>
                    <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">
                            {noteModal.type === 'return' ? 'Kembalikan Berkas' : 'Tolak Pendaftaran'}
                        </h3>
                        <p className="mb-4 text-sm text-gray-500">
                            {noteModal.type === 'return' 
                                ? 'Berikan catatan perbaikan untuk calon siswa. Status akan menjadi "Perlu Perbaikan".'
                                : 'Berikan alasan penolakan. Status akan menjadi "Ditolak".'
                            }
                        </p>
                        <textarea
                            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            rows={4}
                            placeholder={noteModal.type === 'return' ? "Contoh: Foto tidak jelas, KK buram..." : "Alasan penolakan..."}
                            value={noteModal.note}
                            onChange={(e) => setNoteModal(prev => ({ ...prev, note: e.target.value }))}
                        ></textarea>
                        <div className="mt-6 flex justify-end gap-3">
                            <button 
                                onClick={() => setNoteModal(prev => ({ ...prev, open: false }))}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 from-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => submitStatusUpdate(
                                    noteModal.type === 'return' ? 'Perlu Perbaikan' : 'Ditolak',
                                    noteModal.note
                                )}
                                disabled={!noteModal.note.trim() || verifying}
                                 className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                                    noteModal.type === 'return' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-rose-600 hover:bg-rose-700'
                                } disabled:opacity-50`}
                            >
                                {verifying ? 'Memproses...' : (noteModal.type === 'return' ? 'Kirim Perbaikan' : 'Tolak Permanen')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl">
                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Detail Pendaftar
                            </h2>
                            <p className="text-sm text-gray-500">
                                {data.no_pendaftaran}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* CONTENT - SCROLLABLE */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* KOLOM KIRI: Identitas Utama */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="text-center">
                                    <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-50">
                                         <img 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(data.nama)}&size=128`} 
                                            alt={data.nama}
                                            className="h-full w-full object-cover"
                                         />
                                    </div>
                                    <h3 className="mt-4 text-lg font-bold text-gray-900">{data.nama}</h3>
                                    <div className="text-sm text-gray-500">{data.asalSekolah}</div>
                                    <div className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        Pilihan: {data.jurusan}
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm">
                                    <div>
                                        <div className="text-xs text-gray-400">NIK</div>
                                        <div className="font-medium text-gray-700">{data.nik}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Tempat, Tanggal Lahir</div>
                                        <div className="font-medium text-gray-700">
                                            {data.tempat_lahir}, {data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Jenis Kelamin</div>
                                        <div className="font-medium text-gray-700">
                                            {data.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Agama</div>
                                        <div className="font-medium text-gray-700">{data.agama || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Status Pendaftaran</div>
                                        <div className={`font-medium ${
                                            data.status === 'Terverifikasi' ? 'text-green-600' : 
                                            data.status === 'Ditolak' ? 'text-red-600' : 
                                            'text-gray-700'
                                        }`}>{data.status}</div>
                                    </div>
                                </div>
                            </div>

                            {/* KOLOM KANAN: Detail & Dokumen */}
                            <div className="md:col-span-2 space-y-8">
                                {/* DATA ORANG TUA */}
                                <div>
                                    <h4 className="flex items-center gap-2 border-b border-gray-100 pb-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                                        Data Pendukung
                                    </h4>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-xs text-gray-400">Nama Ayah</div>
                                            <div className="font-medium text-gray-800">{data.nama_ayah || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Pekerjaan Ayah</div>
                                            <div className="font-medium text-gray-800">{data.pekerjaan_ayah || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Nama Ibu</div>
                                            <div className="font-medium text-gray-800">{data.nama_ibu || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">No. Telepon Siswa</div>
                                            <div className="font-medium text-gray-800">{data.no_hp_siswa || '-'}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs text-gray-400">Alamat Rumah</div>
                                            <div className="font-medium text-gray-800">{data.alamat_jalan || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* BERKAS PERSYARATAN */}
                                <div>
                                    <h4 className="flex items-center gap-2 border-b border-gray-100 pb-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                                        Berkas Persyaratan
                                    </h4>
                                    <div className="mt-4 space-y-3">
                                        {[
                                            "Kartu Keluarga (KK)",
                                            "Akta Kelahiran",
                                            "Ijazah / SKL SMP",
                                            "Pas Foto 3x4"
                                        ].map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600">
                                                        <FileText size={16} />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{doc}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200">
                                                        <Download size={14} /> Unduh
                                                    </button>
                                                    <button className="flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs text-green-700 border border-green-200 hover:bg-green-100">
                                                        <Check size={14} /> Valid
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 bg-white px-4 py-2 rounded-md shadow-sm transition-colors"
                        >
                            <Printer size={16} /> Cetak Bukti Pendaftaran
                        </button>
                        
                        <div className="flex gap-3">
                             <button 
                                onClick={onClose}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                             >
                                 Tutup
                             </button>
                             {/* ACTION BUTTONS FOR ADMINISTRATIVE VERIFICATION */}
                             {mode === 'verification' && (data.status === 'Menunggu Verifikasi' || data.status === 'Perlu Perbaikan') && (
                                <>
                                    <button 
                                        onClick={() => setNoteModal({ open: true, type: 'reject', note: '' })}
                                        disabled={verifying}
                                        className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 shadow-sm"
                                    >
                                        Tolak
                                    </button>
                                    <button 
                                        onClick={() => setNoteModal({ open: true, type: 'return', note: '' })}
                                        disabled={verifying}
                                        className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 shadow-sm"
                                    >
                                        Kembalikan (Revisi)
                                    </button>
                                     <button 
                                        onClick={() => setConfirmState({
                                            open: true,
                                            title: "Verifikasi Berkas",
                                            message: `Apakah Anda yakin berkas ${data.nama} sudah valid? Status akan berubah menjadi "Terverifikasi".`,
                                            status: "Terverifikasi",
                                            variant: "primary"
                                        })}
                                        disabled={verifying}
                                        className="flex items-center gap-2 rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {verifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            "Verifikasi Berkas"
                                        )}
                                    </button>
                                </>
                             )}

                             {/* ACTION BUTTONS FOR SELECTION PHASE */}
                             {mode === 'selection' && (
                                <>
                                    <button 
                                        onClick={() => setConfirmState({
                                            open: true,
                                            title: "Pilih sebagai Cadangan?",
                                            message: `Apakah Anda yakin ingin memasukkan ${data.nama} ke dalam daftar Cadangan?`,
                                            status: "Cadangan",
                                            variant: "warning"
                                        })}
                                        disabled={verifying}
                                        className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 shadow-sm"
                                    >
                                        Cadangan
                                    </button>
                                    <button 
                                        onClick={() => setConfirmState({
                                            open: true,
                                            title: "Terima Siswa?",
                                            message: `Apakah Anda yakin ingin MENERIMA ${data.nama} sebagai siswa baru?`,
                                            status: "Diterima",
                                            variant: "primary"
                                        })}
                                        disabled={verifying}
                                        className="flex items-center gap-2 rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {verifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            "Terima Siswa"
                                        )}
                                    </button>
                                </>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
