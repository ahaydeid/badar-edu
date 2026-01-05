import { Head, Link } from "@inertiajs/react";
import { Users, BookOpen, Clock, AlertCircle, CheckCircle2, ChevronRight, LayoutDashboard, Pen } from "lucide-react";

interface Task {
    id: number;
    title: string;
    kelas: string;
    kelas_id: number;
    mapel: string;
    progress: number;
    total: number;
}

interface DashboardProps {
    stats: {
        totalKelas: number;
        totalSiswa: number;
        pendingGrades: number;
    };
    tasks: Task[];
    attendanceTrends: any[];
    gradeProgress: any[];
    active_semester: {
        nama: string;
        tahun_ajaran_dari: string | number;
        tahun_ajaran_sampai: string | number;
    };
}

// Lightweight Grouped Bar Chart using CSS
function GroupedBarChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;
    const classes = Object.keys(data[0]).filter(k => k !== 'week');
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex items-end justify-between gap-6 px-4 pt-4 pb-10 border-b border-slate-100">
                {data.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end relative">
                        <div className="flex gap-1.5 h-full items-end">
                            {classes.map((c, ci) => (
                                <div 
                                    key={ci}
                                    className="w-4 transition-all duration-300 hover:opacity-80 relative group"
                                    style={{ 
                                        height: `${d[c]}%`,
                                        backgroundColor: colors[ci % colors.length]
                                    }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                        {c}: {d[c]}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <span className="absolute -bottom-8 text-[11px] text-slate-400 font-semibold tracking-wide uppercase">{d.week}</span>
                    </div>
                ))}
            </div>
            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-start px-2">
                {classes.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span className="text-[11px] text-slate-500 font-medium">{c}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Lightweight Line Chart using SVG
function SimpleLineChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;
    const height = 200;
    const width = 800;
    const padding = 40;
    const max = 100;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((d.progress / max) * (height - padding * 2) + padding);
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="w-full h-full relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((v) => {
                    const y = height - ((v / max) * (height - padding * 2) + padding);
                    return (
                        <g key={v}>
                            <text x={padding - 10} y={y} textAnchor="end" alignmentBaseline="middle" className="text-[10px] fill-slate-300 font-medium">{v}%</text>
                            <line
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#f1f5f9"
                                strokeWidth="1"
                            />
                        </g>
                    );
                })}
                {/* Area under curve */}
                <path 
                    d={`M ${padding} ${height - padding} L ${points} L ${width - padding} ${height - padding} Z`}
                    fill="url(#gradient)"
                    opacity="0.1"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#fff" />
                    </linearGradient>
                </defs>
                {/* Line */}
                <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={points}
                />
                {/* Dots */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                    const y = height - ((d.progress / max) * (height - padding * 2) + padding);
                    return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#6366f1" strokeWidth="2" className="transition-all" />
                    );
                })}
            </svg>
            <div className="flex justify-between px-10 mt-1">
                {data.map((d, i) => (
                    <span key={i} className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{d.month}</span>
                ))}
            </div>
        </div>
    );
}

export default function GuruMapelDashboard({ stats, tasks, attendanceTrends, gradeProgress, active_semester }: DashboardProps) {
    const statCards = [
        { label: "Kelas Diajar", value: stats.totalKelas, icon: BookOpen, color: "bg-indigo-600" },
        { label: "Siswa Diajar", value: stats.totalSiswa, icon: Users, color: "bg-emerald-600" },
        { label: "Penilaian Pending", value: stats.pendingGrades, icon: AlertCircle, color: "bg-amber-500" },
    ];

    return (
        <div className="py-8 px-6 lg:px-10 space-y-8 bg-white min-h-screen">
            <Head title="Dashboard Guru - BADU Suites" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Guru</h1>
                    <p className="text-sm text-slate-500 mt-1">Pantau progres penilaian dan kehadiran kelas secara efisien.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-md">
                        {active_semester ? active_semester.nama : 'Semester Aktif'}
                    </span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((s) => (
                    <div key={s.label} className={`relative overflow-hidden ${s.color} text-white rounded-lg p-5 flex items-center justify-between transition-all hover:scale-[1.02] cursor-default shadow-sm`}>
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
                        <div className="relative z-10">
                            <p className="text-[11px] tracking-widest uppercase opacity-80 font-bold mb-1">{s.label}</p>
                            <p className="text-3xl font-bold tracking-tight">{s.value}</p>
                        </div>
                        <s.icon className="w-10 h-10 opacity-30 relative z-10" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Tasks */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" /> 
                                Tagihan Nilai Pending
                            </h3>
                            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                                {tasks.length} Items
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {tasks && tasks.length > 0 ? tasks.map((t) => (
                                <div key={t.id} className="p-5 hover:bg-slate-50/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-slate-800 leading-tight">{t.title}</h4>
                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                                <span>{t.kelas}</span>
                                                <span className="text-slate-200">•</span>
                                                <span>{t.mapel}</span>
                                            </div>
                                        </div>
                                        <Link href={`/penilaian/${t.kelas_id}/${t.id}`} className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                                            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                                        </Link>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                            <span className="uppercase tracking-widest">Progress</span>
                                            <span>{t.progress} / {t.total} Siswa</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-sm h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-indigo-500 h-full rounded-sm transition-all duration-700" 
                                                style={{ width: `${(t.progress / t.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 flex flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="w-12 h-12 text-slate-200 mb-3" />
                                    <p className="text-sm text-slate-500 font-medium">Semua tagihan nilai selesai.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50/30 border-t border-slate-100">
                            <Link href="/penilaian" className="w-full text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 py-2 rounded-md flex items-center justify-center gap-1.5 transition-all">
                                Lihat Semua Tagihan
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Akses Cepat</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/penilaian" className="bg-white border border-slate-200 p-4 rounded-lg hover:border-indigo-500 transition-all flex flex-col items-center gap-3 group">
                                <div className="p-2 rounded-md bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                    <Pen className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-slate-700">Input Nilai</span>
                            </Link>
                            <Link href="/jadwal-mapel" className="bg-white border border-slate-200 p-4 rounded-lg hover:border-emerald-500 transition-all flex flex-col items-center gap-3 group">
                                <div className="p-2 rounded-md bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 transition-colors">
                                    <LayoutDashboard className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-slate-700">Lihat Jadwal</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Attendance Chart */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-slate-800 tracking-tight">Tren Kehadiran</h3>
                                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wide">4 Minggu Terakhir • Mapel Pengampu</p>
                            </div>
                        </div>
                        <div className="h-72">
                            <GroupedBarChart data={attendanceTrends} />
                        </div>
                    </div>

                    {/* Grading Progress */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-bold text-slate-800 tracking-tight">Progres Penilaian Semester</h3>
                                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wide">Akumulasi penyelesaian per bulan</p>
                            </div>
                            <div className="text-right">
                                {gradeProgress && gradeProgress.length > 0 && (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold text-slate-800 tracking-tighter">{gradeProgress[gradeProgress.length - 1].progress}%</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Done</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="h-60">
                            <SimpleLineChart data={gradeProgress} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
