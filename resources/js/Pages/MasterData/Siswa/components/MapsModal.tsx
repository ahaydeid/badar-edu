import React from "react";
import { X } from "lucide-react";

export default function MapsModal({
    student,
    onClose,
}: {
    student: any;
    onClose: () => void;
}) {
    const lat = student.lintang ?? "";
    const lng = student.bujur ?? "";

    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed`;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-9999">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-4">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Lokasi <span className="text-sky-600">{student.nama}</span> di Maps
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6 text-slate-600 hover:text-slate-800" />
                    </button>
                </div>

                {/* MAP */}
                <div className="w-full h-150 mb-4">
                    <iframe
                        src={mapsUrl}
                        className="w-full h-full rounded"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>

                {/* ALAMAT */}
                <p className="text-sm text-slate-700">
                    {student.alamat}, RT{student.rt}/RW{student.rw},{" "}
                    {student.kelurahan}, {student.kecamatan}, {student.kode_pos}
                </p>
            </div>
        </div>
    );
}
