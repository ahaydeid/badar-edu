import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { X, FileSpreadsheet, Loader2, CheckCircle, AlertCircle, Download, Upload } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";

type Props = {
    open: boolean;
    onClose: () => void;
    onImported: () => void;
};

type ExcelRow = Record<string, any>;

export default function ImportSiswaModal({ open, onClose, onImported }: Props) {
    const [fileName, setFileName] = useState("");
    const [rows, setRows] = useState<ExcelRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0); // 0-100
    const [processingStage, setProcessingStage] = useState<"idle" | "reading" | "uploading" | "processing">("idle");
    const [confirmOpen, setConfirmOpen] = useState(false);

    const page = usePage<any>();
    const import_failed: boolean = page.props?.import_failed ?? false;
    const import_errors: { nama: string; reason: string }[] =
        page.props?.import_errors ?? [];

    if (!open) return null;

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setLoading(true);
        setProcessingStage("reading");
        setProgress(10); // Start reading

        try {
            // Lazy load XLSX
            const XLSX = await import("xlsx");
            
            const reader = new FileReader();
            reader.onprogress = (evt) => {
                 if (evt.lengthComputable) {
                     // Reading progress (minor part)
                     setProgress(10 + Math.round((evt.loaded / evt.total) * 20));
                 }
            };
            
            reader.onload = (evt) => {
                const wb = XLSX.read(evt.target?.result, { type: "binary" });
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json<ExcelRow>(sheet, {
                    defval: "",
                });
                setRows(json);
                setLoading(false);
                setProcessingStage("idle");
                setProgress(0);
            };
            reader.readAsBinaryString(file);
        } catch (error) {
            console.error("Failed to load xlsx library", error);
            setLoading(false);
            setProcessingStage("idle");
        }
    }

    function onConfirmImport() {
        setConfirmOpen(true);
    }

    function handleImport() {
        if (!rows.length) return;
        setConfirmOpen(false); // Close dialog

        setLoading(true);
        setProcessingStage("uploading");
        setProgress(30); // Show some initial progress

        // Simulate progress during upload (since Inertia doesn't support onProgress)
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev; // Cap at 90% until server responds
                return prev + 10;
            });
        }, 500);

        router.post(
            "/master-data/siswa/import",
            { rows },
            {
                onSuccess: () => {
                    clearInterval(progressInterval);
                    setProgress(100);
                    setProcessingStage("processing");
                    
                    // Small delay to show 100% before closing
                    setTimeout(() => {
                        setLoading(false);
                        onImported(); // This triggers parent toast
                        onClose();
                        // Reset state
                        setRows([]);
                        setFileName("");
                        setProcessingStage("idle");
                        setProgress(0);
                    }, 500);
                },
                onError: () => {
                   clearInterval(progressInterval);
                   setLoading(false);
                   setProcessingStage("idle");
                   setProgress(0);
                },
                onFinish: () => {
                    clearInterval(progressInterval);
                }
            }
        );
    }

    return (
        <>
            {/* KONFIRMASI (Diluar fixed container utama agar z-index aman) */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleImport}
                title="Konfirmasi Import"
                message={`Anda akan mengimport data siswa sebanyak ${rows.length} baris. Pastikan format Excel sudah sesuai template. Lanjutkan?`}
                confirmText="Ya, Import Sekarang"
                loading={loading}
            />

            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    
                   <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Import Data Siswa
                    </h3>
                    {!loading && (
                        <button onClick={onClose} className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* DOWNLOAD TEMPLATE */}
                    <div className="flex justify-between items-center bg-sky-50 p-4 rounded-lg border border-sky-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                                <FileSpreadsheet className="w-5 h-5" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-sky-900">Format Excel</p>
                                <p className="text-sky-700">Gunakan template ini agar data terbaca.</p>
                            </div>
                        </div>
                        <a
                            href="/templates/template_import_siswa.xlsx"
                            download
                            className="text-sm font-medium text-white px-3 py-1.5 rounded-md hover:shadow-sm border bg-sky-500 hover:bg-sky-600 transition-all cursor-pointer"
                        >
                            Unduh
                        </a>
                    </div>

                    {/* UPLOAD AREA */}
                    {!loading ? (
                        <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center cursor-pointer transition-all group ${
                            fileName ? 'border-emerald-300 bg-emerald-50/30' : 'border-gray-200 hover:border-sky-400 hover:bg-sky-50/30'
                        }`}>
                            {fileName ? (
                                <div className="bg-emerald-100 p-4 rounded-full mb-3 text-emerald-600">
                                    <FileSpreadsheet className="w-8 h-8" />
                                </div>
                            ) : (
                                <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400 group-hover:bg-sky-100 group-hover:text-sky-500 transition-colors">
                                    <UploadIcon />
                                </div>
                            )}
                            
                            <span className={`text-base font-medium mb-1 ${fileName ? 'text-emerald-800' : 'text-gray-700'}`}>
                                {fileName || "Klik untuk pilih file Excel"}
                            </span>
                            <span className="text-xs text-gray-500">
                                {fileName ? `${rows.length} baris data siap` : "Format .xlsx (Maks 2MB)"}
                            </span>
                            <input
                                type="file"
                                accept=".xlsx"
                                hidden
                                onChange={handleFile}
                            />
                        </label>
                    ) : (
                         <div className="border-2 border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 select-none">
                             <div className="w-full max-w-[200px] space-y-4 text-center">
                                {processingStage === 'reading' && 'Membaca File...'}
                                {processingStage === 'uploading' && `Mengupload (${progress}%)...`}
                                {processingStage === 'processing' && 'Memproses Data...'}
                                
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-sky-500 transition-all duration-300 ease-out"
                                        style={{ width: `${Math.max(5, progress)}%` }} 
                                    />
                                </div>
                                <p className="text-xs text-gray-400 animate-pulse">Mohon jangan tutup jendela ini</p>
                             </div>
                         </div>
                    )}

                    {/* ERROR LIST */}
                    {import_failed && !loading && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-rose-700 mb-1">
                                        Gagal mengimport beberapa data:
                                    </p>
                                    <ul className="list-disc ml-4 space-y-1 text-rose-600 max-h-32 overflow-y-auto pr-2">
                                        {import_errors.map((e: any, i: number) => (
                                            <li key={i}>
                                                <b>{e.nama}</b>: {e.reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        disabled={!rows.length || loading}
                        onClick={onConfirmImport}
                        className="bg-sky-600 cursor-pointer hover:bg-sky-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:grayscale flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {processingStage === 'processing' ? 'Memproses...' : 'Mengupload...'}
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Mulai Import
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

function UploadIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" x2="12" y1="3" y2="15"/>
        </svg>
    )
}
