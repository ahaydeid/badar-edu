import { Head } from "@inertiajs/react";
import { Users, GraduationCap, BookOpen, School } from "lucide-react";
import { useState, useEffect } from "react";

const kehadiran = [
    { minggu: "Minggu 1", hadir: 82 },
    { minggu: "Minggu 2", hadir: 78 },
    { minggu: "Minggu 3", hadir: 85 },
    { minggu: "Minggu 4", hadir: 80 },
    { minggu: "Minggu 5", hadir: 88 },
    { minggu: "Minggu 6", hadir: 84 },
    { minggu: "Minggu 7", hadir: 90 },
    { minggu: "Minggu 8", hadir: 86 },
    { minggu: "Minggu 9", hadir: 92 },
    { minggu: "Minggu 10", hadir: 89 },
    { minggu: "Minggu 11", hadir: 94 },
    { minggu: "Minggu Ini", hadir: 91 },
];

const absenKelasBulanan = [
    { kelas: "X TKR 1", persen: 96 },
    { kelas: "X TKR 2", persen: 91 },
    { kelas: "X TKR 3", persen: 65 },
    { kelas: "XI TKR 1", persen: 54 },
    { kelas: "XI TKR 2", persen: 44 },
    { kelas: "XI TKR 3", persen: 82 },
    { kelas: "XII MPLB 1", persen: 97 },
    { kelas: "XII MPLB 2", persen: 92 },
    { kelas: "XII MPLB 3", persen: 88 },
    { kelas: "XII MPLB 4", persen: 79 },
    { kelas: "XII TKR 1", persen: 84 },
    { kelas: "XII TKR 2", persen: 76 },
    { kelas: "XII TBSM 1", persen: 81 },
    { kelas: "XII TBSM 2", persen: 72 },
    { kelas: "XII Tata Boga", persen: 90 },
];

const absenGuru = [
    { name: "Hadir", value: 42, color: "#2dce89" },
    { name: "Izin", value: 3, color: "#fb6340" },
    { name: "Sakit", value: 2, color: "#11cdef" },
    { name: "Alpha", value: 1, color: "#f5365c" },
];

const absenSiswa = [
    { name: "Hadir", value: 712, color: "#2dce89" },
    { name: "Izin", value: 21, color: "#fb6340" },
    { name: "Sakit", value: 15, color: "#11cdef" },
    { name: "Alpha", value: 11, color: "#f5365c" },
];

// Lightweight SVG Donut Chart
function DonutChart({ data, size = 180, innerRadius = 60, outerRadius = 80 }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = (innerRadius + outerRadius) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {data.map((item, i) => {
                const percentage = (item.value / total) * 100;
                const dashArray = (percentage / 100) * circumference;
                const offset = (accumulatedAngle / 100) * circumference;
                accumulatedAngle += percentage;

                return (
                    <circle
                        key={i}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={outerRadius - innerRadius}
                        strokeDasharray={`${dashArray} ${circumference}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-500 ease-out"
                    />
                );
            })}
        </svg>
    );
}

// Lightweight Line Chart using SVG
function SimpleLineChart({ data, height = 200 }) {
    const max = 100;
    const padding = 20;
    const width = 600; // Reference width
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((d.hadir / max) * (height - padding * 2) + padding);
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="w-full h-full relative group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Horizontal Grid Lines */}
                {[0, 25, 50, 75, 100].map((v) => (
                    <line
                        key={v}
                        x1={padding}
                        y1={height - ((v / max) * (height - padding * 2) + padding)}
                        x2={width - padding}
                        y2={height - ((v / max) * (height - padding * 2) + padding)}
                        stroke="#e2e8f0"
                        strokeDasharray="4 4"
                    />
                ))}
                
                {/* Line Path */}
                <polyline
                    fill="none"
                    stroke="#5e72e4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className="transition-all duration-700 ease-in-out"
                />
                
                {/* Points */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                    const y = height - ((d.hadir / max) * (height - padding * 2) + padding);
                    return (
                        <g key={i} className="group/dot">
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#fff"
                                stroke="#5e72e4"
                                strokeWidth="2"
                                className="transition-all hover:r-6 cursor-pointer"
                            />
                            {/* Simple Tooltip on hover */}
                            <rect x={x - 20} y={y - 30} width="40" height="20" rx="4" className="fill-slate-800 opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                            <text x={x} y={y - 17} textAnchor="middle" className="fill-white text-[10px] opacity-0 group-hover/dot:opacity-100 pointer-events-none">{d.hadir}%</text>
                        </g>
                    );
                })}
            </svg>
            {/* Legend/Labels at Bottom */}
            <div className="flex justify-between px-2 mt-2">
                {data.filter((_, i) => i % 2 === 0).map((d, i) => (
                    <span key={i} className="text-[10px] text-gray-400 font-medium">{d.minggu}</span>
                ))}
            </div>
        </div>
    );
}

// Lightweight Bar Chart using CSS
function SimpleBarChart({ data }) {
    return (
        <div className="flex items-end justify-between h-full gap-2 px-2 pt-10">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {d.persen}%
                    </div>
                    {/* Bar */}
                    <div 
                        className={`w-full rounded-t-sm transition-all duration-700 ease-out min-h-[4px]`}
                        style={{ 
                            height: `${d.persen}%`,
                            backgroundColor: d.persen >= 80 ? "#2dce89" : d.persen >= 60 ? "#fb6340" : "#f5365c"
                        }}
                    />
                    {/* Label */}
                    <div className="text-[9px] text-gray-500 mt-2 rotate-[-45deg] origin-top-left -ml-2 whitespace-nowrap uppercase tracking-tight">
                        {d.kelas}
                    </div>
                </div>
            ))}
        </div>
    );
}

interface DashboardProps {
    totalSiswa: number;
    totalGuru: number;
    totalRombel: number;
    totalMapel: number;
}

export default function DashboardSekolah({ totalSiswa, totalGuru, totalRombel, totalMapel }: DashboardProps) {
    const stats = [
        { label: "Total Siswa", value: totalSiswa, icon: Users, color: "bg-[#f5365c]" },
        { label: "Total Guru", value: totalGuru, icon: GraduationCap, color: "bg-[#fb6340]" },
        { label: "Rombel", value: totalRombel, icon: School, color: "bg-[#11cdef]" },
        { label: "Mapel", value: totalMapel, icon: BookOpen, color: "bg-[#8965e0]" },
    ];

    const latestAttendance = kehadiran[kehadiran.length - 1]?.hadir ?? 0;

    const getPersentase = (data: { name: string; value: number }[]) => {
        const total = data.reduce((a, b) => a + b.value, 0);
        const hadir = data.find((d) => d.name.toLowerCase() === "hadir")?.value ?? 0;
        return total === 0 ? 0 : Math.round((hadir / total) * 100);
    };

    return (
        <>
            <Head title="Dashboard - BADU Suites | Badar Education" />

            <div className="space-y-6">
                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s) => (
                        <div key={s.label} className={`${s.color} text-white rounded-xl p-5 flex items-center justify-between relative overflow-hidden`}>
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full" />
                            <div>
                                <p className="text-xs tracking-wide uppercase opacity-80">{s.label}</p>
                                <p className="text-3xl font-semibold">{s.value}</p>
                            </div>
                            <s.icon className="w-10 h-10 opacity-50" />
                        </div>
                    ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Kehadiran Siswa Line Chart */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200/70 lg:col-span-2">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">
                            Kehadiran Siswa <span className="text-gray-700 font-normal">({latestAttendance}%)</span>
                        </h3>
                        <div className="h-64">
                            <SimpleLineChart data={kehadiran} />
                        </div>
                    </div>

                    {/* Donut Absen Guru & Siswa */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 gap-6">
                        {[
                            { title: "Absen Guru (Hari Ini)", data: absenGuru },
                            { title: "Absen Siswa (Hari Ini)", data: absenSiswa },
                        ].map((item) => (
                            <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-200/70 flex flex-col h-full">
                                <h3 className="text-sm font-semibold text-slate-700 mb-4">{item.title}</h3>
                                
                                <div className="relative h-48 flex items-center justify-center">
                                    <DonutChart data={item.data} size={160} innerRadius={55} outerRadius={80} />
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-2xl font-bold text-slate-800">{getPersentase(item.data)}%</span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-tight">Hadir</span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1 flex-1">
                                    {item.data.map((d) => (
                                        <div key={d.name} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                                <span className="text-slate-600">{d.name}</span>
                                            </div>
                                            <span className="font-semibold">{d.value}</span>
                                        </div>
                                    ))}
                                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between font-bold text-slate-800 text-xs">
                                        <span>Total</span>
                                        <span>{item.data.reduce((sum, d) => sum + d.value, 0)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar Chart Section */}
                <div className="bg-white rounded-xl p-6 border border-slate-200/70">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">
                        Persentase Kehadiran Siswa 1 Bulan Terakhir
                    </h3>
                    <div className="h-72 mb-8">
                        <SimpleBarChart data={absenKelasBulanan} />
                    </div>
                </div>
            </div>
        </>
    );
}
