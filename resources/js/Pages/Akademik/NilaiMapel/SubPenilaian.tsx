import { Head, useForm, router, usePage } from "@inertiajs/react";
import { ArrowLeft, Plus, X, Save, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import TambahPenilaianModal from "./components/TambahPenilaianModal";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import { useUiFeedback } from "@/hooks/useUiFeedback";

type Siswa = {
    id: number;
    nama: string;
    nilai?: number | null;
};

type SubPenilaian = {
    id: number;
    nama: string;
    status: 'proses' | 'selesai';
    siswa: Siswa[];
};

type Props = {
    kelas: string;
    penilaian: string;
    penilaianId: number;
    subPenilaians: SubPenilaian[];
}

export default function SubPenilaian({ kelas, penilaian, penilaianId, subPenilaians }: Props) {
    
    // State for Modals
    const [openTambahSub, setOpenTambahSub] = useState(false);
    
    // State for "Input Nilai"
    const [activeSub, setActiveSub] = useState<SubPenilaian | null>(null);
    const [isInputModalOpen, setIsInputModalOpen] = useState(false);
    
    // Toast Handling
    const { toast, showToast } = useUiFeedback();
    const { props } = usePage<any>();

    useEffect(() => {
        if (props.flash?.success) {
            showToast(props.flash.success, 'success');
        }
        if (props.flash?.error) {
            showToast(props.flash.error, 'error');
        }
    }, [props.flash]);

    // Confirm Dialog State
    const [confirmConfig, setConfirmConfig] = useState<{
        open: boolean;
        title: string;
        message: string;
        action: 'save' | 'finish' | null;
        variant?: 'primary' | 'danger';
        confirmText?: string;
    }>({
        open: false,
        title: '',
        message: '',
        action: null,
        variant: 'primary',
        confirmText: 'Ya'
    });

    // Form for Grade Input
    const { data, setData, post, processing, reset, clearErrors } = useForm({
        sub_penilaian_id: 0,
        siswa_data: [] as { siswa_id: number; nilai: number | string }[]
    });

    const openInputModal = (sub: SubPenilaian) => {
        setActiveSub(sub);
        // Prepare data for form
        const mappedData = sub.siswa.map(s => ({
            siswa_id: s.id,
            nilai: s.nilai ?? ''
        }));
        
        setData({
            sub_penilaian_id: sub.id,
            siswa_data: mappedData
        });
        clearErrors();
        setIsInputModalOpen(true);
    };

    const handleNilaiChange = (index: number, val: string) => {
        const newData = [...data.siswa_data];
        newData[index].nilai = val;
        setData('siswa_data', newData);
    };

    const triggerSave = () => {
        setConfirmConfig({
            open: true,
            title: 'Simpan Perubahan?',
            message: 'Apakah anda yakin ingin menyimpan perubahan nilai ini?',
            action: 'save',
            variant: 'primary',
            confirmText: 'Simpan'
        });
    };

    const triggerFinish = () => {
        setConfirmConfig({
            open: true,
            title: 'Selesaikan Penilaian?',
            message: 'Apakah anda yakin ingin menyelesaikan penilaian ini? Data tidak bisa diubah lagi setelah selesai.',
            action: 'finish',
            variant: 'danger', // Use danger/red to emphasize irreversible
            confirmText: 'Selesaikan'
        });
    };

    const handleConfirm = () => {
        if (confirmConfig.action === 'save') {
             post('/penilaian/nilai', {
                onSuccess: () => {
                    setIsInputModalOpen(false);
                    // reset(); // Don't reset immediately if we want to re-open? Actually closing modal implies reset is fine.
                    reset();
                    setConfirmConfig(prev => ({ ...prev, open: false }));
                },
                onError: () => setConfirmConfig(prev => ({ ...prev, open: false })),
                preserveScroll: true
            });
        } else if (confirmConfig.action === 'finish') {
             router.post('/penilaian/finish', {
                sub_penilaian_id: activeSub?.id
             }, {
                onSuccess: () => {
                     setIsInputModalOpen(false);
                     setConfirmConfig(prev => ({ ...prev, open: false }));
                },
                onError: () => setConfirmConfig(prev => ({ ...prev, open: false }))
             });
        }
    };

    return (
        <>
            <Head title={`Sub Penilaian - ${penilaian}`} />
            <Toast open={toast.open} message={toast.message} type={toast.type} />

            <div className="max-w-7xl px-4 space-y-6">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{penilaian}</h1>
                        <p className="text-sm text-gray-500">{kelas}</p>
                    </div>

                    <button
                        onClick={() => setOpenTambahSub(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Sub Penilaian
                    </button>
                </div>

                {/* LIST SUB PENILAIAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {subPenilaians.map((s) => {
                        const total = s.siswa.length;
                        const dinilai = s.siswa.filter(
                            (x) => x.nilai !== null && x.nilai !== undefined
                        ).length;
                        const belum = total - dinilai;
                        const selesai = s.status === 'selesai';

                        return (
                            <button
                                key={s.id}
                                onClick={() => openInputModal(s)}
                                className="text-left block w-full rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition shadow-sm hover:shadow-md"
                            >
                                {/* JUDUL */}
                                <div className="text-base font-semibold text-gray-800">
                                    {s.nama}
                                </div>

                                {/* META */}
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                    <span>{total} siswa</span>

                                    <span className="flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                        Dinilai {dinilai}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                        Belum {belum}
                                    </span>
                                </div>

                                {/* STATUS */}
                                <div className="mt-3">
                                    {selesai ? (
                                        <span className="inline-flex items-center bg-green-400 px-2 py-0.5 text-xs font-medium text-white">
                                            Selesai
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center bg-yellow-400 px-2 py-0.5 text-xs font-medium text-white">
                                            Dalam Proses
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                     {subPenilaians.length === 0 && (
                        <div className="col-span-full py-10 text-center text-sm text-gray-500">
                            Belum ada sub penilaian.
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL INPUT NILAI */}
            {isInputModalOpen && activeSub && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg bg-white border border-gray-200 shadow-xl">
                        {/* HEADER MODAL */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                            <div>
                                <div className="text-lg font-semibold text-gray-800">
                                    {activeSub.nama}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {kelas}
                                </div>
                            </div>
                            <button
                                onClick={() => setIsInputModalOpen(false)}
                                className="rounded-full p-2 hover:bg-gray-100 transition"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* BODY - SCROLLABLE */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 w-16 text-center">No</th>
                                            <th className="px-4 py-3">Nama Siswa</th>
                                            <th className="px-4 py-3 w-32 text-center">Nilai (0-100)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {data.siswa_data.map((item, i) => {
                                            // Find name from activeSub to display since form data only has ID
                                            const studentName = activeSub.siswa.find(s => s.id === item.siswa_id)?.nama || '-';
                                            return (
                                                <tr key={item.siswa_id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-center text-gray-500">
                                                        {i + 1}
                                                    </td>
                                                    <td className="px-4 py-2 font-medium text-gray-900">
                                                        {studentName}
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={item.nilai}
                                                            onChange={(e) => handleNilaiChange(i, e.target.value)}
                                                            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                            placeholder="0"
                                                            disabled={activeSub?.status === 'selesai'}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
                            {!activeSub || activeSub.status !== 'selesai' ? (
                                <>
                                    <button
                                        onClick={triggerSave}
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm disabled:opacity-70 transition"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                    
                                    <button
                                        onClick={triggerFinish}
                                        disabled={processing} 
                                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 shadow-sm disabled:opacity-70 transition"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Selesaikan
                                    </button>
                                </>
                            ) : (
                                <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Penilaian telah diselesaikan
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <TambahPenilaianModal
                open={openTambahSub}
                mode="sub"
                penilaianId={penilaianId}
                onClose={() => setOpenTambahSub(false)}
            />

            <ConfirmDialog
                 open={confirmConfig.open}
                 title={confirmConfig.title}
                 message={confirmConfig.message}
                 confirmText={confirmConfig.confirmText}
                 cancelText="Batal"
                 loading={processing}
                 variant={confirmConfig.variant}
                 onConfirm={handleConfirm}
                 onClose={() => setConfirmConfig(prev => ({ ...prev, open: false }))}
            />
        </>
    );
}
