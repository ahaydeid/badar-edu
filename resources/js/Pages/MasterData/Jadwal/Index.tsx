import { useState, useMemo, useEffect } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import ClassCard from "./components/ClassCard";
import SubjectSidebar from "./components/SubjectSidebar";
import { Filter, Info, Pencil, Save, X } from "lucide-react";
import Toast from "@/Components/ui/Toast";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

export default function Index() {
    const { kelas, jadwal, mapel, hari, jam, activeSemester, flash } = usePage<any>().props;

    const [activeTingkat, setActiveTingkat] = useState(10);
    
    // Drag & Drop States
    const [isEditMode, setIsEditMode] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<any[]>([]);
    const [toast, setToast] = useState({ open: false, message: "", type: "success" as any });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setToast({ open: true, message: flash.success, type: "success" });
        }
        if (flash?.error) {
            setToast({ open: true, message: flash.error, type: "error" });
        }
    }, [flash]);

    const filteredKelas = useMemo(() => {
        return kelas.filter((k: any) => k.tingkat == activeTingkat);
    }, [kelas, activeTingkat]);

    const tingkats = [10, 11, 12];

    const handleSave = () => {
        if (pendingChanges.length === 0) {
            setIsEditMode(false);
            return;
        }

        // Show confirmation dialog
        setIsConfirmOpen(true);
    };

    const confirmSave = () => {
        console.log('Saving changes:', pendingChanges);

        router.post('/master-data/jadwal-ajar/bulk-sync', {
            changes: pendingChanges
        }, {
            onSuccess: () => {
                console.log('Save successful!');
                setIsEditMode(false);
                setPendingChanges([]);
                setIsConfirmOpen(false);
            },
            onError: (errors) => {
                console.error('Save failed:', errors);
                alert('Gagal menyimpan jadwal: ' + JSON.stringify(errors));
                setIsConfirmOpen(false);
            }
        });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setPendingChanges([]);
    };

    const updatePendingChanges = (change: any) => {
        setPendingChanges(prev => {
            // Find if there's already a change for this specific slot (hari, jam, kelas)
            const index = prev.findIndex(p => 
                p.hari_id === change.hari_id && 
                p.jam_id === change.jam_id && 
                p.kelas_id === change.kelas_id
            );

            if (index !== -1) {
                const newChanges = [...prev];
                newChanges[index] = change;
                return newChanges;
            }
            return [...prev, change];
        });
    };

    const removePendingChange = (hariId: number, jamId: number, kelasId: number) => {
        setPendingChanges(prev => 
            prev.filter(p => 
                !(p.hari_id === hariId && p.jam_id === jamId && p.kelas_id === kelasId)
            )
        );
    };

    return (
        <div className="h-screen bg-gray-50/50 overflow-hidden">
            <Head title="Master Jadwal" />

            <Toast 
                open={toast.open} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, open: false })}
            />

            {/* Left Column - Main Content */}
            <div className="h-full overflow-y-auto mr-96">
                <div className="p-6">
                    {/* Header Section */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Master Jadwal</h1>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <span className="px-2.5 py-0.5 rounded-full border border-gray-300 bg-gray-100 text-gray-700 font-medium">
                                {activeSemester?.nama || "Semester Aktif"}
                            </span>
                            <span>•</span>
                            <span>Tahun Ajaran {activeSemester?.tahun_ajaran_dari}/{activeSemester?.tahun_ajaran_sampai}</span>
                        </div>
                    </div>

                    {/* Tabs Navigation & Edit Button */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        {/* Tabs Tingkat - Kiri */}
                        <div className="flex items-center gap-1">
                            {tingkats.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTingkat(t)}
                                    className={`px-6 py-2 text-sm font-bold transition-all ${
                                        activeTingkat === t
                                            ? "text-sky-600 border-b-2 border-sky-600"
                                            : "text-gray-500 hover:text-gray-900 border-b-2 border-transparent"
                                    }`}
                                    disabled={isEditMode}
                                >
                                    Tingkat {t}
                                </button>
                            ))}
                        </div>

                        {/* Edit Button - Kanan */}
                        <div className="flex items-center gap-3">
                            {!isEditMode ? (
                                <button 
                                    onClick={() => setIsEditMode(true)}
                                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-4 py-2.5 rounded text-sm font-bold text-white cursor-pointer hover:shadow-sm transition-all"
                                >
                                    <Pencil className="w-4 h-4 text-white" />
                                    Edit Jadwal
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                        Batal
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="flex items-center gap-2 bg-sky-600 px-6 py-2.5 rounded text-sm font-bold text-white hover:bg-sky-700 transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        Simpan {pendingChanges.length > 0 && `(${pendingChanges.length})`}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Class Cards */}
                    {filteredKelas.length === 0 ? (
                        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Filter className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Tidak Ada Kelas</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">
                                Tidak ditemukan kelas untuk tingkat {activeTingkat}.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredKelas.map((k: any) => (
                                <ClassCard
                                    key={k.id}
                                    kelas={k}
                                    jadwal={jadwal}
                                    hari={hari}
                                    jam={jam}
                                    isEditMode={isEditMode}
                                    pendingChanges={pendingChanges}
                                    onDropChange={updatePendingChanges}
                                    onRemovePending={removePendingChange}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex items-start gap-3 p-4 bg-gray-50 border border-sky-100 rounded-lg">
                        <Info className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-700 leading-relaxed">
                            <p className="font-bold mb-1">Panduan Pengaturan Jadwal:</p>
                            <p>Klik pada card kelas untuk melihat detail jadwal harian. Anda dapat memfilter jadwal berdasarkan hari menggunakan tab di dalam card tersebut. Untuk menambah jadwal baru, silakan gunakan fitur tambah di submenu berikutnya (Fitur Tambah akan segera rilis).</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Subject Sidebar (Full Height) */}
            <SubjectSidebar 
                mapel={mapel}
                activeTingkat={activeTingkat}
                isEditMode={isEditMode}
            />

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmSave}
                title="Simpan Perubahan Jadwal"
                message={`Anda akan menyimpan ${pendingChanges.length} perubahan jadwal. Pastikan semua perubahan sudah benar sebelum melanjutkan.`}
                confirmText="Ya, Simpan"
                cancelText="Batal"
                variant="primary"
            />
        </div>
    );
}
