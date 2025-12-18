import { Head } from "@inertiajs/react";
import { Users, GraduationCap, BookOpen, School } from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import AppLayout from "@/Layouts/AppLayout";

const stats = [
    { label: "Total Siswa", value: 759, icon: Users, color: "bg-[#f5365c]" },
    {
        label: "Total Guru",
        value: 48,
        icon: GraduationCap,
        color: "bg-[#fb6340]",
    },
    { label: "Rombel", value: 14, icon: School, color: "bg-[#11cdef]" },
    { label: "Mapel", value: 18, icon: BookOpen, color: "bg-[#8965e0]" },
];

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

export default function DashboardSekolah() {
    const latestAttendance = kehadiran[kehadiran.length - 1]?.hadir ?? 0;

    const getBarColor = (persen: number) => {
        if (persen >= 80) return "#2dce89";
        if (persen >= 60) return "#fb6340";
        return "#f5365c";
    };

    const getPersentase = (data: { name: string; value: number }[]) => {
        const total = data.reduce((a, b) => a + b.value, 0);
        const hadir =
            data.find((d) => d.name.toLowerCase() === "hadir")?.value ?? 0;
        return total === 0 ? 0 : Math.round((hadir / total) * 100);
    };

    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className={`${s.color} text-white rounded-xl p-5 flex items-center justify-between relative overflow-hidden`}
                        >
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full" />
                            <div>
                                <p className="text-xs tracking-wide uppercase opacity-80">
                                    {s.label}
                                </p>
                                <p className="text-3xl font-semibold">
                                    {s.value}
                                </p>
                            </div>
                            <s.icon className="w-10 h-10 opacity-50" />
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Kehadiran Siswa */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200/70 lg:col-span-2">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">
                            Kehadiran Siswa{" "}
                            <span className="text-gray-700 font-normal">
                                ({latestAttendance}%)
                            </span>
                        </h3>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={kehadiran}>
                                    <XAxis dataKey="minggu" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="hadir"
                                        stroke="#5e72e4"
                                        strokeWidth={2.5}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Donut Absen Guru & Siswa */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 gap-6">
                        {[
                            { title: "Absen Guru (Hari Ini)", data: absenGuru },
                            {
                                title: "Absen Siswa (Hari Ini)",
                                data: absenSiswa,
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="bg-white rounded-xl p-6 border border-slate-200/70"
                            >
                                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                                    {item.title}
                                </h3>

                                <div className="h-64 flex items-center justify-center">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={item.data}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={4}
                                            >
                                                {item.data.map((d, i) => (
                                                    <Cell
                                                        key={i}
                                                        fill={d.color}
                                                    />
                                                ))}
                                            </Pie>

                                            {/* CENTER PERCENTAGE */}
                                            <text
                                                x="50%"
                                                y="50%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="fill-slate-800 font-semibold text-xl"
                                            >
                                                {getPersentase(item.data)}%
                                            </text>

                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-4 space-y-1 text-sm">
    {item.data.map((d) => (
        <div
            key={d.name}
            className="flex items-center justify-between"
        >
            <div className="flex items-center gap-2">
                <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                />
                <span className="text-slate-600">
                    {d.name}
                </span>
            </div>
            <span className="font-medium">
                {d.value}
            </span>
        </div>
    ))}

    {/* TOTAL */}
    <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between font-semibold text-slate-800">
        <span>Total</span>
        <span>
            {item.data.reduce((sum, d) => sum + d.value, 0)}
        </span>
    </div>
</div>

                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar Chart Absen Siswa per Kelas (Bulanan) */}
                <div className="bg-white rounded-xl p-6 border border-slate-200/70">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">
                        Persentase Kehadiran Siswa 1 Bulan Terakhir
                    </h3>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={absenKelasBulanan}>
                                <XAxis
                                    dataKey="kelas"
                                    interval={0}
                                    angle={-30}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tickFormatter={(v) => `${v}%`}
                                />

                                <Tooltip
                                    formatter={(value) => `${value ?? 0}%`}
                                />
                                <Bar dataKey="persen" radius={[4, 4, 0, 0]}>
                                    {absenKelasBulanan.map((item, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getBarColor(item.persen)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
