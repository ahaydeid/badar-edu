import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { X, FileSpreadsheet } from "lucide-react";

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

        try {
            // Lazy load XLSX
            const XLSX = await import("xlsx");
            
            const reader = new FileReader();
            reader.onload = (evt) => {
                const wb = XLSX.read(evt.target?.result, { type: "binary" });
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json<ExcelRow>(sheet, {
                    defval: "",
                });
                setRows(json);
                setLoading(false);
            };
            reader.readAsBinaryString(file);
        } catch (error) {
            console.error("Failed to load xlsx library", error);
            setLoading(false);
        }
    }

    function handleImport() {
        if (!rows.length) return;

        router.post(
            "/master-data/siswa/import",
            { rows },
            {
                onSuccess: () => {
                    onImported();
                    onClose();
                },
            }
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="bg-white max-w-lg mx-auto mt-32 rounded-xl">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Import Data Siswa</h3>
                    <button onClick={onClose} className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <a
                        href="/templates/template_import_siswa.xlsx"
                        download
                        className="inline-flex items-center gap-2 text-right text-sm text-sky-600 hover:underline"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Unduh Template
                    </a>

                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-sky-400 hover:bg-gray-50 transition-all">
                        <FileSpreadsheet className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                            {loading ? "Membaca file..." : "Pilih file Excel (.xlsx)"}
                        </span>
                        <input
                            type="file"
                            accept=".xlsx"
                            hidden
                            onChange={handleFile}
                        />
                    </label>

                    {fileName && (
                        <p className="text-sm text-gray-600">
                            File: <b>{fileName}</b> ({rows.length} baris)
                        </p>
                    )}

                    {import_failed && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm">
                            <p className="font-semibold text-rose-700 mb-2">
                                Beberapa data gagal diimport:
                            </p>

                            <ul className="list-disc ml-5 space-y-1">
                                {import_errors.map((e: any, i: number) => (
                                    <li key={i}>
                                        <b>{e.nama}</b>: {e.reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="border border-gray-200 hover:bg-gray-100 rounded px-4 py-2 text-sm transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        disabled={!rows.length || loading}
                        onClick={handleImport}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
}
