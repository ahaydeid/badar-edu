"use client";

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
                                <iframe
                                    width="100%"
                                    height="100%"
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://www.google.com/maps?q=${lat},${lng}&hl=es;z=16&output=embed`}
                                ></iframe>
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
