import { X, Save, CheckCircle } from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

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
    open: boolean;
    onClose: () => void;
    activeSub: SubPenilaian;
    kelas: string;
};

export default function NilaiInputModal({ open, onClose, activeSub, kelas }: Props) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'save' | 'finish' | null>(null);

    const { data, setData, post, processing, reset, clearErrors } = useForm({
        sub_penilaian_id: activeSub.id,
        siswa_data: (activeSub.siswa || []).map(s => ({
            siswa_id: s.id,
            nilai: s.nilai ?? ''
        }))
    });

    useEffect(() => {
        if (open) {
            setData({
                sub_penilaian_id: activeSub.id,
                siswa_data: (activeSub.siswa || []).map(s => ({
                    siswa_id: s.id,
                    nilai: s.nilai ?? ''
                }))
            });
            clearErrors();
        }
    }, [open, activeSub]);

    const handleNilaiChange = (index: number, val: string) => {
        const newData = [...data.siswa_data];
        newData[index].nilai = val;
        setData('siswa_data', newData);
    };

    const triggerSave = () => {
        setConfirmAction('save');
        setIsConfirmOpen(true);
    };

    const triggerFinish = () => {
        setConfirmAction('finish');
        setIsConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (confirmAction === 'save') {
             post('/penilaian/nilai', {
                onSuccess: () => {
                    onClose();
                    reset();
                    setIsConfirmOpen(false);
                },
                onError: () => setIsConfirmOpen(false),
                preserveScroll: true
            });
        } else if (confirmAction === 'finish') {
             router.post('/penilaian/finish', {
                sub_penilaian_id: activeSub.id
             }, {
                onSuccess: () => {
                     onClose();
                     setIsConfirmOpen(false);
                },
                onError: () => setIsConfirmOpen(false)
             });
        }
    };

    if (!open) return null;

    return (
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
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100 transition"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* BODY - SCROLLABLE */}
                <div className="flex-1 overflow-y-auto p-6 text-sm">
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 w-16 text-center">No</th>
                                    <th className="px-4 py-3">Nama Siswa</th>
                                    <th className="px-4 py-3 w-32 text-center">Nilai (0-100)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.siswa_data.map((item, i) => {
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
                    {activeSub.status !== 'selesai' ? (
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

            <ConfirmDialog
                open={isConfirmOpen}
                title={confirmAction === 'save' ? 'Simpan Perubahan?' : 'Selesaikan Penilaian?'}
                message={confirmAction === 'save' 
                    ? 'Apakah anda yakin ingin menyimpan perubahan nilai ini?' 
                    : 'Apakah anda yakin ingin menyelesaikan penilaian ini? Data tidak bisa diubah lagi setelah selesai.'}
                confirmText={confirmAction === 'save' ? 'Simpan' : 'Selesaikan'}
                cancelText="Batal"
                loading={processing}
                variant={confirmAction === 'finish' ? 'danger' : 'primary'}
                onConfirm={handleConfirm}
                onClose={() => setIsConfirmOpen(false)}
            />
        </div>
    );
}
