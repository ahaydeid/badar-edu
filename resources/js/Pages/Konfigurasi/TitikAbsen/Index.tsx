import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { 
    Plus, 
    Map as MapIcon, 
} from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import TitikAbsenCard from "./components/TitikAbsenCard";
import TitikAbsenModal from "./components/TitikAbsenModal";

interface Location {
    id: number;
    nama: string;
    latitude: number;
    longitude: number;
    radius: number;
    is_active: boolean;
}

export default function Index() {
    const { locations } = usePage<any>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<Location | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
        open: false,
        message: "",
        type: "success",
    });

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ open: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
    };

    // ConfirmDialog State
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({
        open: false,
        id: null,
    });

    const [isDeleting, setIsDeleting] = useState(false);

    const openModal = (location?: Location) => {
        setEditData(location || null);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (confirmDelete.id) {
            setIsDeleting(true);
            router.delete(`/konfigurasi/titik-absen/${confirmDelete.id}`, {
                onSuccess: () => {
                    setConfirmDelete({ open: false, id: null });
                    showToast("Lokasi berhasil dihapus");
                },
                onError: () => showToast("Gagal menghapus lokasi", "error"),
                onFinish: () => setIsDeleting(false)
            });
        }
    };

    return (
        <div className="p-6">
            <Head title="Konfigurasi Titik Absen" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        Konfigurasi Titik Absen
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola "Titik 0" lokasi sekolah untuk presensi guru.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 cursor-pointer py-2 rounded font-semibold hover:shadow shadow-sky-200 transition-all flex items-center gap-2 active:scale-95 text-sm"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Lokasi
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((loc: Location) => (
                    <TitikAbsenCard 
                        key={loc.id} 
                        loc={loc} 
                        onEdit={openModal} 
                        onDelete={(id) => setConfirmDelete({ open: true, id })} 
                    />
                ))}

                {locations.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 rounded border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <MapIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Belum ada titik absen yang terdaftar.</p>
                        <button onClick={() => openModal()} className="mt-4 text-sky-600 cursor-pointer hover:underline">Tambah Titik Pertama</button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <TitikAbsenModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                editData={editData} 
                showToast={showToast} 
            />

            {/* Toast & ConfirmDialog */}
            <Toast {...toast} />
            <ConfirmDialog
                open={confirmDelete.open}
                variant="danger"
                title="Hapus Lokasi"
                message="Apakah Anda yakin ingin menghapus lokasi ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Ya, Hapus"
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={handleDelete}
                loading={isDeleting}
            />
        </div>
    );
}
