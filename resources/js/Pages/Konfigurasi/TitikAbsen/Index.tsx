import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    Plus, 
    Map as MapIcon,
    Edit,
    Trash2,
    MapPin,
    Ruler,
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
        <div className="p-6">
            <Head title="Konfigurasi Titik Absen" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        Konfigurasi Titik Absen
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {hasLocation 
                            ? 'Kelola "Titik 0" lokasi sekolah untuk presensi guru.' 
                            : 'Tambahkan "Titik 0" lokasi sekolah untuk mengaktifkan presensi berbasis lokasi.'}
                    </p>
                </div>
                
                {/* Conditional Add Button - Only show if no location exists */}
                {!hasLocation && (
                    <button
                        onClick={() => openModal()}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-6 cursor-pointer py-3 rounded-lg font-semibold hover:shadow-lg shadow-sky-200 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Titik Absen
                    </button>
                )}
            </div>

            {/* Full-Screen Map or Empty State */}
            {hasLocation ? (
                <div className="space-y-6">
                    {/* Alert: Single Location Policy */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-blue-800">
                            <strong>ℹ️ Kebijakan:</strong> Hanya 1 titik absen yang dapat aktif pada satu waktu. 
                            Ini memastikan konsistensi dalam validasi presensi berbasis lokasi.
                        </p>
                    </div>

                    {/* Full-Screen Map */}
                    <div className="h-[600px] rounded-xl overflow-hidden border-4 border-sky-200 shadow-2xl">
                        <MapContainer 
                            center={[location.latitude, location.longitude]} 
                            zoom={16} 
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
                                        <strong className="text-lg">{location.nama}</strong>
                                        <br />
                                        <span className="text-xs text-gray-600">
                                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                        </span>
                                        <br />
                                        <span className="text-xs text-blue-600 font-semibold">
                                            Radius: {location.radius}m
                                        </span>
                                    </div>
                                </Popup>
                            </Marker>
                            
                            {/* Radius Circle */}
                            <Circle 
                                center={[location.latitude, location.longitude]} 
                                radius={location.radius}
                                pathOptions={{ 
                                    color: '#0ea5e9', 
                                    fillColor: '#0ea5e9', 
                                    fillOpacity: 0.15,
                                    weight: 3
                                }}
                            />
                        </MapContainer>
                    </div>

                    {/* Info Card Below Map */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Nama Lokasi */}
                            <div className="flex items-start gap-3">
                                <div className="bg-sky-100 p-2 rounded-lg">
                                    <MapPin className="w-5 h-5 text-sky-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nama Lokasi</p>
                                    <p className="font-bold text-lg text-gray-800">{location.nama}</p>
                                </div>
                            </div>

                            {/* Koordinat */}
                            <div className="flex items-start gap-3">
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <MapIcon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Koordinat</p>
                                    <p className="font-mono text-sm text-gray-800">
                                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </p>
                                </div>
                            </div>

                            {/* Radius */}
                            <div className="flex items-start gap-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <Ruler className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Radius Jangkauan</p>
                                    <p className="font-bold text-lg text-gray-800">{location.radius} meter</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 md:justify-end">
                                <button
                                    onClick={() => openModal(location)}
                                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-all cursor-pointer active:scale-95"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => setConfirmDelete({ open: true, id: location.id })}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all cursor-pointer active:scale-95"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Hapus
                                </button>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                location.is_active 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}>
                                {location.is_active ? '✓ Aktif' : '○ Tidak Aktif'}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="h-[600px] bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl border-4 border-dashed border-sky-300 flex flex-col items-center justify-center shadow-inner">
                    <MapIcon className="w-32 h-32 text-sky-400 mb-6 opacity-30" />
                    <h3 className="text-3xl font-bold text-sky-900 mb-3">
                        Belum Ada Titik Absen
                    </h3>
                    <p className="text-sky-700 mb-8 text-center max-w-md">
                        Tambahkan titik absen pertama untuk mengaktifkan sistem presensi berbasis lokasi GPS.
                        Hanya 1 titik absen yang dapat aktif pada satu waktu.
                    </p>
                    <button 
                        onClick={() => openModal()}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-8 cursor-pointer py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3 active:scale-95"
                    >
                        <Plus className="w-6 h-6" />
                        Tambah Titik Absen Pertama
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
                message="Apakah Anda yakin ingin menghapus lokasi ini? Tindakan ini tidak dapat dibatalkan dan akan menonaktifkan presensi berbasis lokasi."
                confirmText="Ya, Hapus"
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={handleDelete}
                loading={isDeleting}
            />
        </div>
    );
}
