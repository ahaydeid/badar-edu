import { useState, useEffect } from "react";
import { X, Download, FileSpreadsheet, CheckCircle, Loader2 } from "lucide-react";
// import axios from "axios"; // Gunakan fetch bawaan agar konsisten

type Props = {
    open: boolean;
    onClose: () => void;
    rombelList: { id: number; nama: string }[];
};

type ExportMode = "all" | "rombel" | "siswa";

export default function ExportSiswaModal({ open, onClose, rombelList }: Props) {
    const [mode, setMode] = useState<ExportMode>("all");
    const [selectedRombel, setSelectedRombel] = useState<number | "">("");
    
    // Untuk pencarian siswa
    const [searchQuery, setSearchQuery] = useState("");
    const [foundStudents, setFoundStudents] = useState<{id: number, nama: string, rombel_nama: string}[]>([]);
    const [selectedSiswa, setSelectedSiswa] = useState<{id: number, nama: string} | null>(null);
    const [searching, setSearching] = useState(false);

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    
    // Helper untuk download file
    function saveExcel(data: any[], filename: string) {
         import("xlsx").then((XLSX) => {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa");
            XLSX.writeFile(workbook, filename);
         });
    }

    async function handleExport() {
        setLoading(true);
        try {
            let payload: any = { mode };
            let filename = "Data_Siswa_All.xlsx";

            if (mode === "rombel") {
                 if (!selectedRombel) {
                     alert("Pilih kelas terlebih dahulu");
                     setLoading(false); return;
                 }
                 payload.id = selectedRombel;
                 const rName = rombelList.find(r => r.id == selectedRombel)?.nama;
                 filename = `Data_Siswa_Kelas_${rName}.xlsx`;
            } 
            else if (mode === "siswa") {
                if (!selectedSiswa) {
                    alert("Cari dan pilih siswa terlebih dahulu");
                    setLoading(false); return;
                }
                payload.id = selectedSiswa.id;
                filename = `Data_Siswa_${selectedSiswa.nama}.xlsx`;
            }

            // Gunakan fetch POST
            const res = await fetch("/master-data/siswa/export", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    // CSRF Token biasanya otomatis diurus Laravel Sanctum/Inertia jika pakai axios, 
                    // tapi fetch butuh X-CSRF-TOKEN dari meta tag
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ""
                },
                body: JSON.stringify(payload)
            });

            if(!res.ok) {
                throw new Error("Gagal mengambil data export");
            }

            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                 saveExcel(data, filename);
                 onClose();
            } else {
                 alert("Tidak ada data ditemukan");
            }

        } catch (e: any) {
            console.error(e);
            alert("Gagal export: " + (e.message));
        } finally {
            setLoading(false);
        }
    }

    const runSearch = async () => {
        if(searchQuery.length < 3) return;
        setSearching(true);
        try {
            const res = await fetch(`/master-data/siswa/search?q=${encodeURIComponent(searchQuery)}`, {
                headers: { 
                    "Accept": "application/json" 
                }
            });
            if(res.ok) {
                const data = await res.json();
                setFoundStudents(data);
            }
        } catch(e) {
            console.error(e);
        } finally {
            setSearching(false);
        }
    }


    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Export Data Siswa
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* MODE SELECTION */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-sky-50 transition-colors has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50">
                            <input 
                                type="radio" 
                                name="exportMode" 
                                value="all" 
                                checked={mode === "all"} 
                                onChange={() => setMode("all")}
                                className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                            />
                            <div>
                                <span className="block font-medium text-gray-700">Semua Data</span>
                                <span className="text-xs text-gray-500">Maksimal 1000 data terbaru</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-sky-50 transition-colors has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50">
                            <input 
                                type="radio" 
                                name="exportMode" 
                                value="rombel" 
                                checked={mode === "rombel"} 
                                onChange={() => setMode("rombel")}
                                className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                            />
                            <div>
                                <span className="block font-medium text-gray-700">Per Kelas (Rombel)</span>
                                <span className="text-xs text-gray-500">Export seluruh siswa dalam satu kelas</span>
                            </div>
                        </label>

                         {mode === "rombel" && (
                            <div className="ml-8 mt-2 animate-in slide-in-from-top-2 fade-in">
                                <select 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                                    value={selectedRombel}
                                    onChange={(e) => setSelectedRombel(Number(e.target.value))}
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {rombelList.map(r => (
                                        <option key={r.id} value={r.id}>{r.nama}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-sky-50 transition-colors has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50">
                            <input 
                                type="radio" 
                                name="exportMode" 
                                value="siswa" 
                                checked={mode === "siswa"} 
                                onChange={() => setMode("siswa")}
                                className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                            />
                            <div>
                                <span className="block font-medium text-gray-700">Satu Siswa</span>
                                <span className="text-xs text-gray-500">Cari dan export data spesifik siswa</span>
                            </div>
                        </label>

                        {mode === "siswa" && (
                            <div className="ml-8 mt-2 space-y-2 animate-in slide-in-from-top-2 fade-in">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Cari nama siswa..." 
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                                    />
                                    <button 
                                        onClick={runSearch}
                                        disabled={searching}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200"
                                    >
                                        {searching ? '...' : 'Cari'}
                                    </button>
                                </div>
                                
                                {foundStudents.length > 0 && (
                                    <div className="border rounded-md max-h-32 overflow-y-auto bg-white">
                                        {foundStudents.map(s => (
                                            <div 
                                                key={s.id} 
                                                onClick={() => setSelectedSiswa(s)}
                                                className={`p-2 text-sm cursor-pointer hover:bg-sky-50 flex justify-between ${selectedSiswa?.id === s.id ? 'bg-sky-100 text-sky-800' : 'text-gray-700'}`}
                                            >
                                                <span>{s.nama}</span>
                                                <span className="text-xs text-gray-400">{s.rombel_nama}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={loading || (mode === 'rombel' && !selectedRombel) || (mode === 'siswa' && !selectedSiswa)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet className="w-4 h-4" />
                                Download Excel
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
