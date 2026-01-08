import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, User, X, GripVertical } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import { router } from "@inertiajs/react";

type Props = {
    kelas: any;
    jadwal: any[];
    hari: any[];
    jam: any[];
    isEditMode: boolean;
    pendingChanges: any[];
    onDropChange: (change: any) => void;
    onRemovePending: (hariId: number, jamId: number, kelasId: number) => void;
};

export default function ClassCard({ kelas, jadwal, hari, jam, isEditMode, pendingChanges, onDropChange, onRemovePending }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeDay, setActiveDay] = useState(hari[0]?.id || 1);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedJadwal, setSelectedJadwal] = useState<number | null>(null);

    // Get schedules for this class
    const classJadwal = jadwal.filter((j) => j.kelas_id === kelas.id);

    // Find pending changes for this specific class
    const classPendingChanges = pendingChanges.filter(p => p.kelas_id === kelas.id);

    const handleDelete = (id: number) => {
        if (isEditMode) return;
        setSelectedJadwal(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (selectedJadwal) {
            router.delete(`/master-data/jadwal-ajar/${selectedJadwal}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setSelectedJadwal(null);
                },
                onError: (errors) => {
                    console.error('Delete failed:', errors);
                    setIsConfirmOpen(false);
                }
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        (e.currentTarget as HTMLElement).classList.add("bg-sky-50", "border-sky-400");
    };

    const handleDragLeave = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).classList.remove("bg-sky-50", "border-sky-400");
    };

    const handleDrop = (e: React.DragEvent, jamId: number) => {
        if (!isEditMode) return;
        e.preventDefault();
        (e.currentTarget as HTMLElement).classList.remove("bg-sky-50", "border-sky-400");
        
        const mapelData = e.dataTransfer.getData("mapel");
        if (!mapelData) return;

        const mapel = JSON.parse(mapelData);
        
        onDropChange({
            hari_id: activeDay,
            jam_id: jamId,
            kelas_id: kelas.id,
            mapel_id: mapel.id,
            guru_id: mapel.guru.id,
            // Temporary data for display
            mapel_nama: mapel.nama,
            guru_nama: mapel.guru.nama,
            warna: mapel.warna_hex_mapel
        });
    };

    return (
        <div className={`bg-white border rounded-lg transition-all overflow-hidden ${isExpanded ? "shadow border-gray-200" : "border-gray-100 hover:border-gray-300"}`}>
            {/* Class Header */}
            <div
                className={`p-4 cursor-pointer flex items-center justify-between transition-colors ${
                    isExpanded ? "bg-sky-50/50" : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-15 h-12 bg-sky-600 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0 px-2">
                        <span className="font-black text-xs text-center leading-tight uppercase tracking-tighter">
                            {kelas.nama}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{kelas.nama}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Wali: {kelas.wali?.nama || "Belum ditentukan"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Jam</span>
                        <span className="text-lg font-black text-sky-600 leading-tight">{classJadwal.length}</span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-gray-100">
                    {/* Day Selector */}
                    <div className="flex items-center gap-1 p-3 bg-gray-50/50 overflow-x-auto no-scrollbar border-b border-gray-100">
                        {hari.map((h) => (
                            <button
                                key={h.id}
                                onClick={() => setActiveDay(h.id)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                                    activeDay === h.id
                                        ? "bg-sky-600 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                                disabled={isEditMode && pendingChanges.length > 0 && activeDay !== h.id && false}
                            >
                                {h.nama}
                            </button>
                        ))}
                    </div>

                    {/* Schedule Grid */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {jam.map((j) => {
                            // Find existing schedule
                            const existing = classJadwal.find(
                                (item) => item.hari_id === activeDay && item.jam_id === j.id
                            );

                            // Find pending change
                            const pending = classPendingChanges.find(
                                (p) => p.hari_id === activeDay && p.jam_id === j.id
                            );

                            const displayItem = pending || existing;
                            const isPending = !!pending;

                            return (
                                <div
                                    key={j.id}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, j.id)}
                                    className={`relative p-3 rounded-lg border transition-all flex flex-col gap-2 min-h-[90px] ${
                                        isPending 
                                            ? "bg-amber-50 border-amber-300 ring-2 ring-amber-500/10 shadow-sm" 
                                            : displayItem
                                                ? "bg-white border-gray-100 hover:border-sky-200"
                                                : isEditMode
                                                    ? "bg-gray-50 border-dashed border-gray-300 hover:bg-sky-50 hover:border-sky-400"
                                                    : "bg-gray-50/50 border-gray-100 opacity-60"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                            <Clock className="w-3 h-3" />
                                            {j.nama} ({j.jam_mulai.substring(0, 5)} - {j.jam_selesai.substring(0, 5)})
                                        </div>
                                        {isEditMode && (
                                            <GripVertical className="w-3.5 h-3.5 text-gray-300 animate-pulse" />
                                        )}
                                        {!isEditMode && existing && (
                                            <button
                                                onClick={() => handleDelete(existing.id)}
                                                className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                        {isEditMode && displayItem && (
                                            <button
                                                onClick={() => {
                                                    if (isPending) {
                                                        onRemovePending(activeDay, j.id, kelas.id);
                                                    }
                                                }}
                                                className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                title="Batalkan perubahan"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>

                                    {displayItem ? (
                                        <div className="flex-1">
                                            <div className="flex items-start gap-2">
                                                <div
                                                    className="w-1.5 h-8 rounded-full flex-shrink-0 mt-0.5"
                                                    style={{ backgroundColor: isPending ? displayItem.warna : (displayItem.mapel?.warna_hex_mapel || "#0ea5e9") }}
                                                ></div>
                                                <div className="overflow-hidden">
                                                    <div className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
                                                        {displayItem.mapel_nama || displayItem.mapel?.nama}
                                                        {isPending && (
                                                            <span className="text-[9px] bg-amber-200 text-amber-800 px-1 rounded">Edit</span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 flex items-center gap-1 truncate mt-0.5">
                                                        <User className="w-2.5 h-2.5" />
                                                        {displayItem.guru_nama || displayItem.guru?.nama}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                            <span className="text-[10px] text-gray-300 font-medium italic">
                                                {isEditMode ? "Tarik mapel ke sini" : "Kosong"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Jadwal"
                message="Apakah Anda yakin ingin menghapus jadwal ini? Data yang dihapus tidak dapat dikembalikan."
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="danger"
            />
        </div>
    );
}
