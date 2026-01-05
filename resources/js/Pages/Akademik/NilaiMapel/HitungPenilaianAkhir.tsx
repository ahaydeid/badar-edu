import React, { useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import { Calculator, Save, ArrowLeft, User, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useUiFeedback } from '@/hooks/useUiFeedback';
import Toast from '@/Components/ui/Toast';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';

// Interfaces matching backend data
interface JenisPenilaian {
    id: number;
    nama: string;
    bobot: number;
}

interface SiswaData {
    id: number;
    nama: string;
    nisn: string;
    nilai_per_jenis: Record<number, number | null>; // Allow null
}

interface ExistingGrade {
    nilai: number;
    updated_at: string;
    status: string;
}

interface Props {
    kelas: { id: number; nama: string };
    mapel: { id: number; nama: string };
    jenisPenilaians: JenisPenilaian[];
    siswaList: SiswaData[];
    existingGrades: Record<number, ExistingGrade>;
    kelasId: number;
    mapelId: number;
    waliKelas: string;
    semester: string;
}

export default function HitungPenilaianAkhir({ kelas, mapel, jenisPenilaians, siswaList, existingGrades, kelasId, mapelId, waliKelas, semester }: Props) {
    const { toast, showToast } = useUiFeedback();
    
    // State for Bobot Configuration
    const [bobotConfig, setBobotConfig] = useState(
        jenisPenilaians.map(j => ({ id: j.id, nama: j.nama, bobot: j.bobot }))
    );

    // Track the "Saved" state of configuration to detect changes
    const [savedConfig, setSavedConfig] = useState(
        JSON.parse(JSON.stringify(jenisPenilaians.map(j => ({ id: j.id, nama: j.nama, bobot: j.bobot }))))
    );

    const isBobotDirty = useMemo(() => {
        return JSON.stringify(bobotConfig) !== JSON.stringify(savedConfig);
    }, [bobotConfig, savedConfig]);

    // State for Calculated Results - Initialize from existingGrades if available
    const [calculatedResults, setCalculatedResults] = useState<Record<number, number> | null>(() => {
        if (!existingGrades || Object.keys(existingGrades).length === 0) return null;
        
        const initial: Record<number, number> = {};
        Object.keys(existingGrades).forEach(key => {
            initial[Number(key)] = existingGrades[Number(key)].nilai;
        });
        return initial;
    });

    // Check if grades are already sent based on existing data
    const isGradesSent = useMemo(() => {
        if (!existingGrades || Object.keys(existingGrades).length === 0) return false;
        // Check if any grade has status 'dikirim'
        return Object.values(existingGrades).some(g => g.status === 'dikirim');
    }, [existingGrades]);

    // Check if new calculation differs from existing saved grades
    const isGradesChanged = useMemo(() => {
        if (!calculatedResults || !existingGrades) return false;
        
        return siswaList.some(siswa => {
            const calculated = calculatedResults[siswa.id];
            const existing = existingGrades[siswa.id]?.nilai;
            
            // If calculated exists but no existing record -> Changed
            if (calculated !== undefined && existing === undefined) return true;
            
            // If both exist but different -> Changed
            if (calculated !== undefined && existing !== undefined && calculated !== existing) return true;
            
            return false;
        });
    }, [calculatedResults, existingGrades, siswaList]);

    // Last Sync derived from existingGrades
    const lastSync = useMemo(() => {
        if (!existingGrades) return '-';
        const keys = Object.keys(existingGrades);
        if (keys.length === 0) return '-';
        // Get the latest updated_at
        const first = existingGrades[Number(keys[0])];
        return new Date(first.updated_at).toLocaleString('id-ID', { 
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    }, [existingGrades]);

    // Process & Dialog States
    const [processState, setProcessState] = useState<{ isProcessing: boolean; message: string }>({ isProcessing: false, message: '' });
    const [confirmState, setConfirmState] = useState<{ type: 'hitung' | 'kirim' | 'export' | null; isOpen: boolean }>({ type: null, isOpen: false });

    // Total Bobot Calculation
    const totalBobot = useMemo(() => {
        return bobotConfig.reduce((sum, item) => sum + Number(item.bobot), 0);
    }, [bobotConfig]);

    // Handle Bobot Change in Input
    const handleBobotChange = (index: number, val: string) => {
        const newConfig = [...bobotConfig];
        newConfig[index].bobot = Number(val);
        setBobotConfig(newConfig);
    };

    // 1. Simpan Bobot Action
    const handleSimpanBobot = () => {
        if (totalBobot !== 100) {
            showToast(`Total bobot harus 100%. Saat ini: ${totalBobot}%`, 'error');
            return;
        }

        router.post('/penilaian/bobot', {
            bobot_data: bobotConfig
        }, {
            onSuccess: () => {
                showToast('Konfigurasi bobot berhasil disimpan.', 'success');
                setSavedConfig(JSON.parse(JSON.stringify(bobotConfig))); // Update saved state
            },
            onError: () => showToast('Gagal menyimpan bobot.', 'error'),
            preserveScroll: true
        });
    };

    // Trigger Hitung (Open Dialog)
    const triggerHitungNilai = () => {
        if (totalBobot !== 100) {
             showToast('Bobot belum 100%. Harap perbaiki konfigurasi bobot.', 'error');
             return;
        }
        if (isBobotDirty) {
            showToast('Simpan bobot terlebih dahulu sebelum menghitung.', 'error');
            return;
        }
        setConfirmState({ type: 'hitung', isOpen: true });
    };

    // Execute Hitung (After Delay)
    const executeHitungNilai = () => {
        setConfirmState({ type: null, isOpen: false });
        setProcessState({ isProcessing: true, message: 'Sedang mengkalkulasi nilai siswa...' });

        // Artificial Delay 5s
        setTimeout(() => {
            const results: Record<number, number> = {};
            siswaList.forEach(siswa => {
                let finalScore = 0;
                bobotConfig.forEach(conf => {
                    const rawScore = siswa.nilai_per_jenis[conf.id];
                    const score = rawScore !== null ? rawScore : 0;
                    finalScore += (score * (conf.bobot / 100));
                });
                results[siswa.id] = Math.ceil(finalScore);
            });

            setCalculatedResults(results);
            setProcessState({ isProcessing: false, message: '' });
            showToast('Perhitungan selesai. Silakan periksa kolom Nilai Akhir.', 'success');
        }, 5000); 
    };

    // Trigger Kirim (Open Dialog)
    const triggerKirimNilai = () => {
        // Allow if not sent OR if sent but changed (Resend)
        if (isGradesSent && !isGradesChanged) return;

        if (!calculatedResults) {
            showToast('Harap lakukan "Hitung Nilai" terlebih dahulu.', 'error');
            return;
        }
        setConfirmState({ type: 'kirim', isOpen: true });
    };

    // Execute Kirim (After Delay)
    const executeKirimNilai = () => {
        setConfirmState({ type: null, isOpen: false });
        setProcessState({ isProcessing: true, message: 'Menyimpan & Mengirim Nilai ke Wali Kelas...' });

        // Artificial Delay 5s
        setTimeout(() => {
            router.post('/penilaian/kirim-akhir', {
                kelas_id: kelasId,
                mapel_id: mapelId
            }, {
                onSuccess: () => {
                    setProcessState({ isProcessing: false, message: '' });
                    showToast('Nilai berhasil dikirim ke Wali Kelas.', 'success');
                },
                onError: () => {
                    setProcessState({ isProcessing: false, message: '' });
                    showToast('Gagal mengirim nilai.', 'error');
                },
                preserveScroll: true
            });
        }, 5000);
    };

    // Trigger Export
    const triggerExport = () => {
         setConfirmState({ type: 'export', isOpen: true });
    };

    // Execute Export
    const executeExport = async () => {
        setConfirmState({ type: null, isOpen: false });
        setProcessState({ isProcessing: true, message: 'Membuat file Excel...' });

        try {
            // Lazy load XLSX
            const XLSX = await import('xlsx-js-style');
            
            // 1. Prepare Data
            const rows: any[][] = [];
            
            // HEADER INFO (Rows 1-5)
            rows.push(["DAFTAR NILAI AKHIR SISWA"]);
            rows.push([]);
            rows.push(["Mata Pelajaran", ": " + mapel.nama]);
            rows.push(["Kelas", ": " + kelas.nama]);
            rows.push(["Wali Kelas", ": " + waliKelas]);
            rows.push(["Semester", ": " + semester]);
            rows.push([]);

            // TABLE HEADER (Row 8)
            const headerRow = ["No", "Nama Siswa"];
            jenisPenilaians.forEach(j => headerRow.push(`${j.nama} (${j.bobot}%)`));
            headerRow.push("Nilai Akhir");
            rows.push(headerRow);

            // DATA ROWS
            siswaList.forEach((siswa, i) => {
                const rowData: any[] = [
                    i + 1,
                    siswa.nama
                ];

                // Assessment Columns
                jenisPenilaians.forEach(j => {
                    const val = siswa.nilai_per_jenis[j.id];
                    rowData.push(val !== null ? val : 0); 
                });

                // Dummy logic for final grade just to fill the cell before formula
                rowData.push(0); 

                rows.push(rowData);
            });

            // Create Worksheet
            const ws = XLSX.utils.aoa_to_sheet(rows);

            // --- STYLING START ---
            
            // Define Style
            const headerStyle = {
                font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "000000" } },
                fill: { fgColor: { rgb: "BDD7EE" } }, // Light Blue
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { auto: 1 } },
                    bottom: { style: "thin", color: { auto: 1 } },
                    left: { style: "thin", color: { auto: 1 } },
                    right: { style: "thin", color: { auto: 1 } }
                }
            };

            const dataBorder = {
                top: { style: "thin", color: { auto: 1 } },
                bottom: { style: "thin", color: { auto: 1 } },
                left: { style: "thin", color: { auto: 1 } },
                right: { style: "thin", color: { auto: 1 } }
            };

            const dataStyle = {
                font: { name: "Calibri", sz: 11 },
                border: dataBorder
            };

            const dataStyleCenter = {
                font: { name: "Calibri", sz: 11 },
                alignment: { horizontal: "center" },
                border: dataBorder
            };

            // Apply Styles
            // @ts-ignore
            const range = XLSX.utils.decode_range(ws['!ref'] || "A1:A1");
            const headerRowLabel = 7; // 0-indexed (Row 8)
            
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                    // @ts-ignore
                    if (!ws[cellRef]) continue;

                    // Apply Header Style
                    if (R === headerRowLabel) {
                        // @ts-ignore
                        ws[cellRef].s = headerStyle;
                    }
                    // Apply Data Style for table (rows > header)
                    else if (R > headerRowLabel) {
                        // Column 0 (No) and Columns > 1 (Values) -> Center
                        // Column 1 (Nama) -> Left
                        if (C === 0 || C >= 2) {
                            // @ts-ignore
                            ws[cellRef].s = dataStyleCenter;
                        } else {
                            // @ts-ignore
                            ws[cellRef].s = dataStyle;
                        }
                    }
                }
            }

            // --- COLUMN WIDTHS ---
            // Calculate max width for each column based on HEADER CONTENT
            const colWidths = rows[headerRowLabel].map((header: any) => {
                let maxLen = header ? header.toString().length : 10;
                return { wch: maxLen + 2 };
            });
            
            // @ts-ignore
            ws['!cols'] = colWidths;

            // --- FORMULA RE-APPLICATION ---
            const dataStartRow = 8; 
            const totalRows = siswaList.length;
            const lastColIndex = 2 + jenisPenilaians.length; 
            
            for (let r = 0; r < totalRows; r++) {
                const currentRow = dataStartRow + r; 
                const excelRow = currentRow + 1; 
                
                let weightedSumParts: string[] = [];
                
                jenisPenilaians.forEach((j, idx) => {
                    const colIndex = 2 + idx; 
                    const colLetter = XLSX.utils.encode_col(colIndex);
                    const weightDecimal = j.bobot / 100;
                    weightedSumParts.push(`(${colLetter}${excelRow}*${weightDecimal})`); 
                });
                
                const formula = `CEILING(${weightedSumParts.join("+")}, 1)`;
                
                const cellRef = XLSX.utils.encode_cell({ r: currentRow, c: lastColIndex });
                // @ts-ignore
                if (!ws[cellRef]) ws[cellRef] = { t: 'n', v: 0 }; 
                // @ts-ignore
                ws[cellRef].f = formula;
                // @ts-ignore
                ws[cellRef].v = undefined; 
                
                // Re-apply style to formula cell
                // @ts-ignore
                ws[cellRef].s = dataStyleCenter; 
            }

            // Create Workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Nilai Akhir");

            // Download
            const safeKelas = kelas.nama.replace(/[^a-z0-9]/gi, '_');
            const safeMapel = mapel.nama.replace(/[^a-z0-9]/gi, '_');
            const fileName = `NilaiAkhir_${safeKelas}_${safeMapel}.xlsx`;
            
            XLSX.writeFile(wb, fileName);

            setProcessState({ isProcessing: false, message: '' });
            showToast("File Excel berhasil diunduh!", "success");

        } catch (error) {
            console.error("Failed to export excel", error);
            setProcessState({ isProcessing: false, message: '' });
            showToast("Gagal membuat file excel.", "error");
        }
    };

    // Update ConfirmDialog usages
    const getConfirmData = () => {
        if (confirmState.type === 'hitung') return {
            title: "Konfirmasi Perhitungan",
            msg: "Sistem akan menghitung nilai akhir berdasarkan bobot yang telah ditetapkan. Proses ini membutuhkan waktu beberapa saat.",
            btn: "Mulai Hitung",
            action: executeHitungNilai
        };
        if (confirmState.type === 'kirim') {
            const isResend = isGradesSent && isGradesChanged;
            return {
                title: isResend ? "Konfirmasi Kirim Ulang" : "Konfirmasi Pengiriman",
                msg: isResend 
                    ? "Nilai akhir siswa telah berubah dibanding data sebelumnya. Apakah Anda yakin ingin mengirim ulang nilai baru ini? Nilai lama akan diperbarui."
                    : "Nilai akhir akan dikirim ke Wali Kelas dan disimpan permanen. Pastikan perhitungan sudah sesuai.",
                btn: isResend ? "Kirim Ulang" : "Kirim Sekarang",
                action: executeKirimNilai
            };
        }
        if (confirmState.type === 'export') return {
            title: "Konfirmasi Export Excel",
            msg: "Apakah anda ingin mengunduh data nilai ini dalam format Excel (.xlsx)?",
            btn: "Unduh Excel",
            action: executeExport
        };
        return { title: "", msg: "", btn: "", action: () => {} };
    };

    const confirmData = getConfirmData();

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-900 relative">
            <Toast open={toast.open} message={toast.message} type={toast.type} />

            {/* Loading Overlay */}
            {processState.isProcessing && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all animate-in fade-in duration-300">
                    <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-xl shadow-2xl ring-1 ring-slate-900/5">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 animate-pulse">{processState.message}</h3>
                        <p className="text-slate-400 text-xs mt-2 font-mono">Mohon tunggu sebentar...</p>
                    </div>
                </div>
            )}
            
            {/* Confirmation Dialogs */}
            <ConfirmDialog
                open={confirmState.isOpen}
                title={confirmData.title}
                message={confirmData.msg}
                confirmText={confirmData.btn}
                cancelText="Batal"
                onConfirm={confirmData.action}
                onClose={() => setConfirmState({ type: null, isOpen: false })}
                variant={'primary'} 
            />

            {/* Header Halaman */}
            <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between border-b border-slate-200 pb-6">
                <div>
                    <Link
                        href={`/penilaian/${kelasId}`}
                        className="mb-3 flex items-center text-xs font-bold tracking-wider text-slate-400 transition-colors hover:text-slate-700"
                    >
                        <ArrowLeft className="mr-1 h-3 w-3" /> Kembali
                    </Link>
                    <h1 className="text-2xl font-black tracking-tight text-slate-800 uppercase">
                        Hitung Penilaian Akhir
                    </h1>
                    <div className="mt-1 flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                            Rombel: <span className="font-bold text-slate-700">{kelas.nama}</span>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm text-slate-500">
                            Mata Pelajaran: <span className="font-bold text-slate-700">{mapel.nama}</span>
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={triggerExport}
                        disabled={processState.isProcessing}
                        className="flex items-center rounded-sm border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 hover:shadow-sm active:bg-slate-100 cursor-pointer"
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> Export (.XLSX)
                    </button>
                    <button 
                        onClick={triggerHitungNilai}
                        disabled={totalBobot !== 100 || isBobotDirty || processState.isProcessing}
                        className={`flex items-center rounded-sm px-5 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-all shadow-sm cursor-pointer ${
                            totalBobot === 100 && !isBobotDirty && !processState.isProcessing
                            ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]' 
                            : 'bg-slate-300 cursor-not-allowed opacity-70'
                        }`}
                    >
                        {processState.isProcessing && confirmState.type === 'hitung' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Calculator className="mr-2 h-4 w-4" /> 
                        )}
                        Hitung Nilai
                    </button>
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Panel Pengaturan Bobot (Sisi Kiri) */}
                <div className="space-y-4 lg:col-span-1">
                    <div className="rounded-sm border border-slate-200 bg-white">
                        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                            <h2 className="flex items-center text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                <Calculator className="mr-2 h-3 w-3" /> Konfigurasi Bobot
                            </h2>
                        </div>
                        <div className="space-y-5 p-5">
                            <div className="grid gap-4">
                                {bobotConfig.map((item, index) => (
                                    <div key={item.id}>
                                        <label className="mb-1.5 block text-[10px] font-bold tracking-wide text-slate-500 uppercase">
                                            {item.nama} (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={item.bobot}
                                            onChange={(e) => handleBobotChange(index, e.target.value)}
                                            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm font-semibold transition-all outline-none focus:border-slate-400 focus:bg-slate-50"
                                        />
                                    </div>
                                ))}
                                {bobotConfig.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada jenis penilaian.</p>}
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        Total Akumulasi
                                    </span>
                                    <span className={`font-mono text-sm font-black ${totalBobot === 100 ? 'text-green-600' : 'text-red-500'}`}>
                                        {totalBobot}%
                                    </span>
                                </div>
                                <button 
                                    onClick={handleSimpanBobot}
                                    disabled={totalBobot !== 100 || !isBobotDirty || processState.isProcessing}
                                    className={`w-full flex items-center justify-center rounded-sm py-2.5 text-[10px] font-black tracking-[0.15em] text-white uppercase transition-colors cursor-pointer ${
                                        (totalBobot === 100 && isBobotDirty)
                                        ? 'bg-slate-800 hover:bg-slate-900' 
                                        : 'bg-slate-300 cursor-not-allowed text-slate-500'
                                    }`}
                                >
                                    {!isBobotDirty && totalBobot === 100 ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-3 w-3" /> Bobot Ditetapkan
                                        </>
                                    ) : (
                                        "Tetapkan Bobot"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start rounded-sm border border-slate-200 bg-slate-100 p-4">
                        <AlertCircle className="mt-0.5 mr-3 h-4 w-4 shrink-0 text-slate-400" />
                        <p className="text-[11px] leading-normal font-medium text-slate-500 uppercase">
                            Perubahan bobot akan mempengaruhi seluruh kalkulasi nilai akhir.
                        </p>
                    </div>
                </div>

                {/* Tabel Penilaian (Sisi Kanan) */}
                <div className="lg:col-span-3">
                    <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-none">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/30 p-4">
                            <h3 className="text-[11px] font-black tracking-[0.2em] text-slate-500 uppercase">
                                Data Penilaian Kolektif
                            </h3>
                            <div className="flex items-center text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                                <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span> System Siap
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-white">
                                        <th className="w-12 px-4 py-4 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            No
                                        </th>
                                        <th className="px-4 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            Nama Siswa
                                        </th>
                                        {/* Dynamic Headers based on Jenis Penilaian */}
                                        {jenisPenilaians.map(jenis => (
                                            <th key={jenis.id} className="px-4 py-4 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                {jenis.nama}
                                            </th>
                                        ))}
                                        <th className="border-l border-slate-100 bg-slate-50/50 px-4 py-4 text-center text-[10px] font-black tracking-widest text-slate-800 uppercase">
                                            Nilai Akhir
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {siswaList.map((siswa, index) => (
                                        <tr key={siswa.id} className="group transition-colors hover:bg-slate-50/80">
                                            <td className="px-4 py-4 text-center font-mono text-xs text-slate-400">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-xs font-bold text-slate-700 uppercase">
                                                    {siswa.nama}
                                                </p>
                                                <p className="text-[10px] text-slate-400">{siswa.nisn}</p>
                                            </td>
                                            
                                            {/* Dynamic Data Cells per Jenis */}
                                            {jenisPenilaians.map(jenis => {
                                                const val = siswa.nilai_per_jenis[jenis.id];
                                                const displayVal = (val !== null && val !== undefined) ? val : '-';
                                                
                                                return (
                                                    <td key={jenis.id} className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                                                        {displayVal}
                                                    </td>
                                                );
                                            })}

                                            <td className="border-l border-slate-100 bg-slate-50/30 px-4 py-4 text-center text-xs font-black text-slate-900">
                                                {calculatedResults && calculatedResults[siswa.id] !== undefined ? (
                                                    <span className="text-blue-700">{Math.ceil(calculatedResults[siswa.id])}</span>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {siswaList.length === 0 && (
                                        <tr>
                                            <td colSpan={2 + jenisPenilaians.length + 1} className="px-4 py-8 text-center text-sm text-slate-500 italic">
                                                Tidak ada data siswa.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 p-6">
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                Last Sync: {lastSync}
                            </p>
                            <button 
                                onClick={triggerKirimNilai}
                                disabled={processState.isProcessing || (isGradesSent && !isGradesChanged)}
                                className={`flex items-center rounded-sm px-8 py-3 text-xs font-black tracking-[0.2em] text-white uppercase transition-all hover:shadow-md active:scale-[0.99] active:transform cursor-pointer ${
                                    processState.isProcessing 
                                    ? 'bg-green-400 cursor-wait' 
                                    : isGradesSent && !isGradesChanged
                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                        : isGradesSent && isGradesChanged
                                            ? 'bg-amber-500 hover:bg-amber-600' // Orange for resend
                                            : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {isGradesSent && !isGradesChanged ? (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-slate-500" /> Nilai Sudah Terkirim
                                    </>
                                ) : isGradesSent && isGradesChanged ? (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Kirim Ulang Nilai
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Kirim Ke Wali Kelas
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
