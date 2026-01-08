import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    Plus, 
    Map as MapIcon,
} from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import TitikAbsenModal from "./components/TitikAbsenModal";

// Fix Leaflet default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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

    const location = locations[0] || null;
    const hasLocation = location !== null;

    return (
        <div className="px-6 pb-6">
            <Head title="Konfigurasi Titik Absen" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        Konfigurasi Titik Absen
                    </h1>
                </div>
                
                {/* Conditional Add Button */}
                {!hasLocation && (
                    <button
                        onClick={() => openModal()}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 cursor-pointer py-2 rounded font-semibold hover:shadow shadow-sky-200 transition-all flex items-center gap-2 active:scale-95 text-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Lokasi
                    </button>
                )}
            </div>

            {/* Full-Screen Map or Empty State */}
            {hasLocation ? (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Map Side (Left) */}
                    <div className="flex-1 lg:w-3/4 h-[550px] rounded overflow-hidden border-2 border-slate-200">
                        <MapContainer 
                            center={[location.latitude, location.longitude]} 
                            zoom={18} 
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            {/* School Marker */}
                            <Marker position={[location.latitude, location.longitude]}>
                                <Popup>
                                    <div className="text-center">
                                        <strong>{location.nama}</strong>
                                        <br />
                                        <span className="text-xs text-gray-600">
                                            {Number(location.latitude).toFixed(6)}, {Number(location.longitude).toFixed(6)}
                                        </span>
                                    </div>
                                </Popup>
                            </Marker>
                            
                            {/* Radius Circle - No border, just faint background */}
                            <Circle 
                                center={[location.latitude, location.longitude]} 
                                radius={location.radius}
                                pathOptions={{ 
                                    fillColor: '#38a9f4ff', 
                                    fillOpacity: 0.35,
                                    stroke: false
                                }}
                            />
                        </MapContainer>
                    </div>

                    {/* Info Side (Right) */}
                    <div className="lg:w-1/4 flex flex-col gap-4">
                        <div className="bg-white rounded border border-slate-200 p-6 flex-1 shadow-sm">
                            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                                <MapIcon className="w-5 h-5 text-sky-600" />
                                Detail Lokasi
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Lokasi</p>
                                    <p className="font-bold text-slate-700">{location.nama}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Koordinat</p>
                                    <p className="font-mono text-xs text-slate-700">
                                        {Number(location.latitude).toFixed(6)}, {Number(location.longitude).toFixed(6)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Radius Jangkauan</p>
                                    <p className="font-bold text-slate-700">{location.radius} meter</p>
                                </div>

                                <div className="pt-4 flex flex-col gap-2">
                                    <button
                                        onClick={() => openModal(location)}
                                        className="w-full px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold transition-all cursor-pointer flex justify-center items-center gap-2"
                                    >
                                        Edit Lokasi
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete({ open: true, id: location.id })}
                                        className="w-full px-4 py-2.5 text-white bg-red-600 hover:bg-red-50 rounded font-bold transition-all cursor-pointer flex justify-center items-center gap-2"
                                    >
                                        Hapus Titik
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className={`p-4 rounded border ${location.is_active ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold">Status Presensi</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${location.is_active ? 'bg-emerald-200' : 'bg-slate-200'}`}>
                                    {location.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            <p className="text-[11px] mt-1 opacity-80">
                                {location.is_active 
                                    ? 'Titik ini digunakan sebagai referensi presensi.' 
                                    : 'Titik ini tidak digunakan untuk validasi lokasi.'}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="py-20 bg-slate-50 rounded border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <MapIcon className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">Belum ada titik absen yang terdaftar.</p>
                    <button 
                        onClick={() => openModal()} 
                        className="mt-4 text-sky-600 cursor-pointer hover:underline"
                    >
                        Tambah Titik Pertama
                    </button>
                </div>
            )}

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
