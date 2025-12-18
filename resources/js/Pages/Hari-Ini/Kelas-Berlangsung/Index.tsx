"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import AttendanceDetailModal from "./components/AttendanceDetailModal";

type KelasTab = "all" | "10" | "11" | "12";

interface JadwalItem {
    id: number;
    jam: string;
    mapel: string;
    guru: string;
    status: "selesai" | "berlangsung" | "belum";
    color: string;
    hadir: boolean | null;
}

interface DummyKegiatan {
    id: number;
    kelas: string;
    wali: string;
    siswa: {
        hadir: number;
        izin: number;
        sakit: number;
        alfa: number;
    };
    jadwal: JadwalItem[];
}

const dummyData: DummyKegiatan[] = [
    {
        id: 1,
        kelas: "12 MPLB 2",
        wali: "Siti",
        siswa: { hadir: 25, izin: 3, sakit: 0, alfa: 7 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Matematika",
                guru: "Ahmad",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "PKN",
                guru: "Liza",
                status: "belum",
                color: "bg-blue-500",
                hadir: false,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Coding",
                guru: "Ahadi",
                status: "berlangsung",
                color: "bg-pink-500",
                hadir: null,
            },
        ],
    },
    {
        id: 2,
        kelas: "10 RPL 1",
        wali: "Budi",
        siswa: { hadir: 30, izin: 5, sakit: 2, alfa: 1 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Basis Data",
                guru: "Dewi",
                status: "belum",
                color: "bg-yellow-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "UI/UX",
                guru: "Riko",
                status: "selesai",
                color: "bg-purple-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Web",
                guru: "Rizal",
                status: "berlangsung",
                color: "bg-orange-500",
                hadir: null,
            },
        ],
    },
    {
        id: 3,
        kelas: "11 AKL 2",
        wali: "Lina",
        siswa: { hadir: 28, izin: 3, sakit: 4, alfa: 2 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Akuntansi",
                guru: "Bambang",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "Perpajakan",
                guru: "Tia",
                status: "selesai",
                color: "bg-red-500",
                hadir: false,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Excel",
                guru: "Nina",
                status: "berlangsung",
                color: "bg-blue-500",
                hadir: null,
            },
        ],
    },
];

export default function KegiatanBelajar() {
    const [activeKelas, setActiveKelas] = useState<KelasTab>("all");
    const [openDetail, setOpenDetail] = useState(false);

    const tabList: { key: KelasTab; label: string }[] = [
        { key: "all", label: "Semua" },
        { key: "10", label: "Kelas 10" },
        { key: "11", label: "Kelas 11" },
        { key: "12", label: "Kelas 12" },
    ];

    const filteredData =
        activeKelas === "all"
            ? dummyData
            : dummyData.filter((item) => item.kelas.startsWith(activeKelas));

    return (
        <AppLayout title="Aktivitas Kelas Hari Ini">
            <div className="space-y-6 px-6">
                {/* TAB */}
                <div className="flex gap-1 justify-center">
                    {tabList.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveKelas(tab.key)}
                            className={`px-4 py-1 rounded text-sm font-medium border transition ${
                                activeKelas === tab.key
                                    ? "bg-sky-500 text-white"
                                    : "bg-white text-gray-700 border-gray-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {/* GRID */}
                <div className="flex flex-wrap gap-6">
                    {filteredData.map((kelas) => {
                        const totalSiswa =
                            kelas.siswa.hadir +
                            kelas.siswa.izin +
                            kelas.siswa.sakit +
                            kelas.siswa.alfa;

                        const chartData = [
                            {
                                name: "Hadir",
                                value: kelas.siswa.hadir,
                                color: "#00B83D",
                            },
                            {
                                name: "Izin",
                                value: kelas.siswa.izin,
                                color: "#F9D900",
                            },
                            {
                                name: "Sakit",
                                value: kelas.siswa.sakit,
                                color: "#00ADFF",
                            },
                            {
                                name: "Alfa",
                                value: kelas.siswa.alfa,
                                color: "#FF0000",
                            },
                        ];

                        return (
                            <div
                                key={kelas.id}
                                className="w-full md:w-[calc(50%-12px)] border border-gray-200 rounded-lg p-5 bg-white grid grid-cols-1 md:grid-cols-2 items-start gap-6  hover:shadow"
                            >
                                {/* KIRI — INFO KELAS */}
                                <div>
                                    <div className="inline-block bg-gray-800 text-white px-3 py-1 text-sm font-semibold">
                                        {kelas.kelas}
                                    </div>

                                    <p className="mt-4 text-sm text-gray-700">
                                        Wali kelas:
                                    </p>
                                    <p className="font-semibold">
                                        {kelas.wali}
                                    </p>

                                    {/* DONUT CHART KEHADIRAN */}
                                    <div className="mt-6 flex items-center gap-5">
                                        <div className="w-28 h-28 relative">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        dataKey="value"
                                                        innerRadius={40}
                                                        outerRadius={55}
                                                        paddingAngle={2}
                                                    >
                                                        {chartData.map(
                                                            (d, i) => (
                                                                <Cell
                                                                    key={i}
                                                                    fill={
                                                                        d.color
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-800">
                                                {Math.round(
                                                    (kelas.siswa.hadir /
                                                        totalSiswa) *
                                                        100
                                                )}
                                                %
                                            </div>
                                        </div>

                                        {/* LEGEND */}
                                        <div className="space-y-1 text-sm text-gray-700">
                                            {chartData.map((d) => (
                                                <div
                                                    key={d.name}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span
                                                        className="w-3 h-3 rounded-full"
                                                        style={{
                                                            background: d.color,
                                                        }}
                                                    />
                                                    {d.name}: {d.value}
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">
                                                    Total
                                                </span>
                                                : {kelas.siswa.hadir} /{" "}
                                                {totalSiswa}
                                            </div>
                                            {/* DETAIL */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenDetail(true)
                                                }
                                                className="mt-2 text-xs text-white bg-sky-600 px-2 py-0.5 hover:bg-sky-700 rounded-sm cursor-pointer font-medium"
                                            >
                                                Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* KANAN — JADWAL */}
                                <div>
                                    <p className="mb-2 font-semibold text-gray-800">
                                        Jadwal hari ini
                                    </p>

                                    <div className="space-y-2">
                                        {kelas.jadwal.map((j) => (
                                            <div
                                                key={j.id}
                                                className="border border-gray-200 rounded bg-gray-50 px-3 py-2"
                                            >
                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <div className="text-sm font-semibold text-gray-800 leading-tight truncate">
                                                            <span className="text-[11px] text-gray-500 font-medium">
                                                                {j.jam}
                                                            </span>
                                                            <span className="mx-1 text-gray-300">
                                                                -
                                                            </span>
                                                            {j.mapel}
                                                        </div>

                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-xs text-gray-500 truncate">
                                                                {j.guru}
                                                            </span>

                                                            {j.status ===
                                                                "selesai" && (
                                                                <span className="text-[11px] text-green-600 italic py-0.5">
                                                                    Selesai
                                                                </span>
                                                            )}

                                                            {j.status ===
                                                                "belum" && (
                                                                <span className="text-[11px] text-gray-400 italic py-0.5">
                                                                    Kosong
                                                                </span>
                                                            )}

                                                            {j.status ===
                                                                "berlangsung" && (
                                                                <span className="inline-flex items-center gap-1 mt-2 text-[11px] text-gray-500 py-0.5 italic rounded">
                                                                    <span className="relative flex h-4 w-4">
                                                                        <span className="absolute inset-0 m-auto h-4 w-4 rounded-full bg-red-400 animate-ping" />
                                                                        <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-red-600" />
                                                                    </span>
                                                                    Live
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <AttendanceDetailModal
                    open={openDetail}
                    onClose={() => setOpenDetail(false)}
                    kelas="12 MPLB 2"
                />
            </div>
        </AppLayout>
    );
}
