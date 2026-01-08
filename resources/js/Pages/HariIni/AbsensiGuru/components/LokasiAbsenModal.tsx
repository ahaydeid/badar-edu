"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface LokasiAbsenModalProps {
    open: boolean;
    onClose: () => void;
    lat: number | null;
    lng: number | null;
    nama: string | null;
    jamMasuk: string | null;
    foto: string | null;
    verifikasi: "OTOMATIS" | "PENDING" | "DISETUJUI" | "DITOLAK" | null;
    isInRange: boolean;
}

// School coordinates (hardcoded - adjust to your school location)
const SCHOOL_LAT = -6.200000;
const SCHOOL_LNG = 106.816666;

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Convert to meters
    
    return Math.round(distance);
}

// Format distance for display
function formatDistance(meters: number): string {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters} m`;
}

export default function LokasiAbsenModal({
    open,
    onClose,
    lat,
    lng,
    nama,
    jamMasuk,
    foto,
    verifikasi,
    isInRange,
}: LokasiAbsenModalProps) {
    if (!open) return null;

    const hasLocation = lat !== null && lng !== null;
    const distance = hasLocation ? calculateDistance(SCHOOL_LAT, SCHOOL_LNG, lat!, lng!) : 0;

    const schoolPosition: [number, number] = [SCHOOL_LAT, SCHOOL_LNG];
    const teacherPosition: [number, number] = hasLocation ? [lat!, lng!] : [0, 0];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white pb-6 px-5 rounded shadow-xl w-[95%] max-w-3xl space-y-5">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold mt-4">
                        Absensi <span className="text-sky-600">{nama}</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-4xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Maps */}
                {hasLocation ? (
                    <div className="space-y-4">
                        {/* Grid 2 Kolom: Foto (kiri) & Maps (kanan) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Photo Selfie - Kiri */}
                            {foto && (
                                <div className="w-full flex justify-center items-center">
                                    <img
                                        src={foto}
                                        alt="Selfie Absen"
                                        className="w-full h-[400px] rounded-lg object-cover shadow-md border-4 border-white"
                                    />
                                </div>
                            )}

                            {/* MAPS - Kanan */}
                            <div className={`w-full h-[400px] overflow-hidden border border-gray-200 rounded-lg ${!foto ? 'md:col-span-2' : ''}`}>
                                <MapContainer 
                                    center={teacherPosition} 
                                    zoom={16} 
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    
                                    {/* School Marker */}
                                    <Marker position={schoolPosition}>
                                        <Popup>
                                            <div className="text-center">
                                                <strong>Sekolah</strong>
                                                <br />
                                                <span className="text-xs text-gray-600">
                                                    {SCHOOL_LAT}, {SCHOOL_LNG}
                                                </span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                    
                                    {/* Teacher Marker */}
                                    <Marker position={teacherPosition}>
                                        <Popup>
                                            <div className="text-center">
                                                <strong>{nama}</strong>
                                                <br />
                                                <span className="text-xs text-gray-600">
                                                    {lat}, {lng}
                                                </span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                    
                                    {/* Connecting Line */}
                                    <Polyline 
                                        positions={[schoolPosition, teacherPosition]} 
                                        color="#3b82f6" 
                                        weight={3}
                                        dashArray="10, 10"
                                        opacity={0.7}
                                    />
                                </MapContainer>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="pt-4 border-t border-gray-300 grid grid-cols-2 gap-4 text-sm text-gray-800">
                            <div className="space-y-2">
                                <p>
                                    <span className="font-semibold">
                                        Jam Masuk:
                                    </span>{" "}
                                    {jamMasuk ?? "-"}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Koordinat:
                                    </span>{" "}
                                    {lat}, {lng}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Jarak dari Sekolah:
                                    </span>{" "}
                                    <span className="font-bold text-sky-600">
                                        {formatDistance(distance)}
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-2 text-right">
                                <p>
                                    <span className="font-semibold">
                                        Jarak Lokasi:
                                    </span>{" "}
                                    {isInRange ? (
                                        <span className="text-green-600 font-bold">DALAM JANGKAUAN</span>
                                    ) : (
                                        <span className="text-red-500 font-bold">DI LUAR JANGKAUAN</span>
                                    )}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Status Verifikasi:
                                    </span>{" "}
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        verifikasi === 'DISETUJUI' || verifikasi === 'OTOMATIS' 
                                            ? 'bg-green-100 text-green-700' 
                                            : verifikasi === 'DITOLAK' 
                                            ? 'bg-red-100 text-red-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {verifikasi}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">
                        Tidak ada data lokasi.
                    </div>
                )}
            </div>
        </div>
    );
}
