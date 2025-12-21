import { Head, usePage } from "@inertiajs/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Users, AlertTriangle } from "lucide-react";

type DashboardProps = {
    totalSiswa: number;
    sanksiAktif: number;
    rekapSanksi: {
        nama: string;
        total: number;
    }[];
};

const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
];

export default function Dashboard() {
    const { totalSiswa, sanksiAktif, rekapSanksi } = usePage()
        .props as unknown as DashboardProps;

    return (
        <>
            <Head title="Dashboard Kedisiplinan" />

            <div className="space-y-8">
                {/* HEADER */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Dashboard Kedisiplinan
                        </h1>
                        <p className="text-sm text-slate-500">
                            Ringkasan kondisi disiplin siswa terkini
                        </p>
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* TOTAL SISWA */}
                    <div className="relative overflow-hidden rounded-2xl p-6 bg-indigo-500 text-white shadow-lg">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full" />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide opacity-80">
                                    Total Siswa
                                </p>
                                <p className="text-4xl font-semibold mt-1">
                                    {totalSiswa}
                                </p>
                            </div>
                            <Users className="w-10 h-10 opacity-70" />
                        </div>
                    </div>

                    {/* SANKSI AKTIF */}
                    <div className="relative overflow-hidden rounded-2xl p-6 bg-rose-600 text-white shadow-lg">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full" />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide opacity-80">
                                    Sanksi Aktif
                                </p>
                                <p className="text-4xl font-semibold mt-1">
                                    {sanksiAktif}
                                </p>
                            </div>
                            <AlertTriangle className="w-10 h-10 opacity-70" />
                        </div>
                    </div>
                </div>

                {/* DISTRIBUSI SANKSI */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-700">
                            Distribusi Sanksi Aktif
                        </h3>
                    </div>

                    {rekapSanksi.length === 0 ? (
                        <div className="text-sm text-slate-500">
                            Tidak ada sanksi aktif
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* DONUT */}
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={rekapSanksi}
                                            dataKey="total"
                                            nameKey="nama"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={4}
                                        >
                                            {rekapSanksi.map((_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={
                                                        COLORS[
                                                            i % COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>

                                        {/* CENTER TOTAL */}
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="fill-slate-800"
                                        >
                                            <tspan
                                                x="50%"
                                                dy="-2"
                                                className="text-sm fill-slate-500"
                                            >
                                                Total
                                            </tspan>
                                            <tspan
                                                x="50%"
                                                dy="22"
                                                className="text-2xl font-semibold"
                                            >
                                                {sanksiAktif}
                                            </tspan>
                                        </text>

                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* LEGEND */}
                            <div className="flex flex-col justify-center space-y-2">
                                {rekapSanksi.map((item, i) => (
                                    <div
                                        key={item.nama}
                                        className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[
                                                            i % COLORS.length
                                                        ],
                                                }}
                                            />
                                            <span className="text-sm text-slate-600">
                                                {item.nama}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-slate-800">
                                            {item.total}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
