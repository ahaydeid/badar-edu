import { Search, User } from "lucide-react";
import { useState, useMemo } from "react";

type MapelWithGuru = {
    id: number;
    nama: string;
    kategori: string;
    tingkat: string | number;
    warna_hex_mapel?: string;
    guru: { id: number; nama: string } | null;
};

type Props = {
    mapel: MapelWithGuru[];
    activeTingkat: number;
    isEditMode: boolean;
};

export default function SubjectSidebar({ mapel, activeTingkat, isEditMode }: Props) {
    const [search, setSearch] = useState("");

    const filteredMapel = useMemo(() => {
        return mapel.filter((m) => {
            const isTingkatMatch = m.tingkat == activeTingkat || !m.tingkat; // Allow null tingkat to show everywhere
            const isSearchMatch = m.nama.toLowerCase().includes(search.toLowerCase());
            return isTingkatMatch && isSearchMatch;
        });
    }, [mapel, activeTingkat, search]);

    const handleDragStart = (e: React.DragEvent, m: MapelWithGuru) => {
        if (!isEditMode) return;
        e.dataTransfer.setData("mapel", JSON.stringify(m));
        e.dataTransfer.effectAllowed = "move";
        
        // Create a custom ghost image or just let it be
        const ghost = e.currentTarget as HTMLElement;
        ghost.style.opacity = "0.5";
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
    };

    return (
        <div className="w-96 flex-shrink-0 h-screen overflow-hidden border-l border-gray-200 fixed pt-13 right-0 top-0">
            <div className={`h-full bg-white transition-all overflow-hidden flex flex-col ${isEditMode ? "border-l-4 border-l-sky-400 shadow-lg" : ""}`}>
                {/* Header */}
                <div className={`p-4 border-b border-gray-200 ${isEditMode ? "bg-sky-50" : "bg-gray-50"}`}>
                    <h3 className={`font-semibold mb-3 ${isEditMode ? "text-sky-800" : "text-gray-800"}`}>
                        {isEditMode ? "Klik & Tarik Mapel" : "Mata Pelajaran & Guru"}
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari mapel..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            disabled={isEditMode}
                        />
                    </div>
                </div>

                {/* Subject List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {filteredMapel.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-gray-500 italic">Tidak ada mapel ditemukan.</p>
                        </div>
                    ) : (
                        filteredMapel.map((m) => (
                            <div
                                key={m.id}
                                draggable={isEditMode && !!m.guru}
                                onDragStart={(e) => handleDragStart(e, m)}
                                onDragEnd={handleDragEnd}
                                className={`p-3 rounded-lg border bg-white transition-all group ${
                                    isEditMode 
                                        ? m.guru 
                                            ? "border-sky-100 hover:border-sky-400 hover:shadow-md cursor-grab active:cursor-grabbing" 
                                            : "border-gray-100 opacity-50 cursor-not-allowed"
                                        : "border-gray-100 pointer-events-none"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className={`w-2 h-6 rounded-full ${isEditMode && m.guru ? "animate-pulse" : ""}`}
                                        style={{ backgroundColor: m.warna_hex_mapel || "#0ea5e9" }}
                                    ></div>
                                    <span className="font-medium text-gray-900 group-hover:text-sky-600 transition-colors text-xs">
                                        {m.nama}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {!m.guru ? (
                                        <p className="text-[10px] text-red-400 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Belum ada guru pengampu
                                        </p>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                            <User className="w-3 h-3 text-sky-400" />
                                            <span>{m.guru.nama}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-[11px] text-gray-600 font-medium">
                        Daftar ini menampilkan guru yang memiliki kompetensi di tingkat kelas {activeTingkat}
                    </p>
                </div>
            </div>
        </div>
    );
}
