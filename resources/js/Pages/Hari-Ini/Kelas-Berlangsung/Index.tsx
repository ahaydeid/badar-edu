"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import AttendanceDetailModal from "./components/AttendanceDetailModal";

type KelasTab = "all" | "X " | "XI " | "XII ";

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
    /* ===================== X ===================== */
    {
        id: 1,
        kelas: "X MPLB 1",
        wali: "Budi Santoso",
        siswa: { hadir: 28, izin: 2, sakit: 1, alfa: 3 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Administrasi Umum",
                guru: "Ahmad Arif Saepudin",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "PKN",
                guru: "Gusti Ario Galang Marhaendra",
                status: "belum",
                color: "bg-blue-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Informatika",
                guru: "Dudy Ruchyat",
                status: "belum",
                color: "bg-pink-500",
                hadir: null,
            },
        ],
    },
    {
        id: 5,
        kelas: "X TKR 1",
        wali: "Ramadhan Akbar Aden",
        siswa: { hadir: 30, izin: 5, sakit: 2, alfa: 1 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Teknik Dasar Otomotif",
                guru: "Burhanudin",
                status: "belum",
                color: "bg-yellow-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "Gambar Teknik Otomotif",
                guru: "Sahroni",
                status: "selesai",
                color: "bg-purple-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Kejuruan TKR",
                guru: "Sahroni",
                status: "berlangsung",
                color: "bg-orange-500",
                hadir: null,
            },
        ],
    },
    {
        id: 7,
        kelas: "X TBSM 1",
        wali: "Burhanudin",
        siswa: { hadir: 28, izin: 4, sakit: 1, alfa: 2 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Teknik Dasar Otomotif",
                guru: "Burhanudin",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "Kejuruan TSM",
                guru: "Sahroni",
                status: "belum",
                color: "bg-red-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Kejuruan TSM",
                guru: "Sahroni",
                status: "belum",
                color: "bg-blue-500",
                hadir: null,
            },
        ],
    },
    /* ===================== XI ===================== */
    {
        id: 11,
        kelas: "XI MPLB 1",
        wali: "Indrayani Hidayat",
        siswa: { hadir: 27, izin: 3, sakit: 1, alfa: 1 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Korespondensi",
                guru: "Ayunah",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "PKN",
                guru: "Gusti Ario Galang Marhaendra",
                status: "belum",
                color: "bg-blue-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Informatika",
                guru: "Dudy Ruchyat",
                status: "belum",
                color: "bg-pink-500",
                hadir: null,
            },
        ],
    },
    /* ===================== XII ===================== */
    {
        id: 21,
        kelas: "XII MPLB 1",
        wali: "Eva Ocviyanti",
        siswa: { hadir: 26, izin: 3, sakit: 0, alfa: 2 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Manajemen Arsip",
                guru: "Ayunah",
                status: "berlangsung",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "PKN",
                guru: "Gusti Ario Galang Marhaendra",
                status: "belum",
                color: "bg-blue-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Informatika",
                guru: "Indrayani Hidayat",
                status: "belum",
                color: "bg-pink-500",
                hadir: null,
            },
        ],
    },
    {
        id: 22,
        kelas: "XII MPLB 2",
        wali: "Ayati",
        siswa: { hadir: 25, izin: 3, sakit: 0, alfa: 7 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Manajemen Arsip",
                guru: "Ayati",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "PKN",
                guru: "Muhamad Rizki Pawuzi",
                status: "belum",
                color: "bg-blue-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Coding",
                guru: "Ahadi",
                status: "belum",
                color: "bg-pink-500",
                hadir: null,
            },
        ],
    },
    {
        id: 23,
        kelas: "XII MPLB 3",
        wali: "Indrayani Hidayat",
        siswa: { hadir: 24, izin: 4, sakit: 1, alfa: 1 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Manajemen Arsip",
                guru: "Ayunah",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "PKN",
                guru: "Gusti Ario Galang Marhaendra",
                status: "belum",
                color: "bg-blue-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Informatika",
                guru: "Indrayani Hidayat",
                status: "belum",
                color: "bg-pink-500",
                hadir: null,
            },
        ],
    },
    {
        id: 24,
        kelas: "XII MPLB 4",
        wali: "Kamaludin",
        siswa: { hadir: 23, izin: 5, sakit: 1, alfa: 1 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Manajemen Arsip",
                guru: "Ayati",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "PKN",
                guru: "Muhamad Rizki Pawuzi",
                status: "belum",
                color: "bg-blue-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Informatika",
                guru: "Indrayani Hidayat",
                status: "belum",
                color: "bg-pink-500",
                hadir: null,
            },
        ],
    },

    {
        id: 25,
        kelas: "XII TKR 1",
        wali: "Ramadhan Akbar Aden",
        siswa: { hadir: 28, izin: 3, sakit: 1, alfa: 1 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Pemeliharaan Mesin Kendaraan",
                guru: "Burhanudin",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "Kelistrikan Kendaraan",
                guru: "Sahroni",
                status: "belum",
                color: "bg-purple-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Kejuruan TKR",
                guru: "Sahroni",
                status: "belum",
                color: "bg-orange-500",
                hadir: null,
            },
        ],
    },
    {
        id: 26,
        kelas: "XII TKR 2",
        wali: "Sahroni",
        siswa: { hadir: 27, izin: 4, sakit: 1, alfa: 1 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Pemeliharaan Mesin Kendaraan",
                guru: "Burhanudin",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "Kelistrikan Kendaraan",
                guru: "Sahroni",
                status: "belum",
                color: "bg-purple-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Kejuruan TKR",
                guru: "Burhanudin",
                status: "belum",
                color: "bg-orange-500",
                hadir: null,
            },
        ],
    },

    {
        id: 27,
        kelas: "XII TBSM 1",
        wali: "Burhanudin",
        siswa: { hadir: 26, izin: 4, sakit: 1, alfa: 2 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Tune Up Sepeda Motor",
                guru: "Burhanudin",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "Sistem Injeksi",
                guru: "Sahroni",
                status: "belum",
                color: "bg-red-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Kejuruan TSM",
                guru: "Sahroni",
                status: "belum",
                color: "bg-blue-500",
                hadir: null,
            },
        ],
    },
    {
        id: 28,
        kelas: "XII TBSM 2",
        wali: "Sahroni",
        siswa: { hadir: 27, izin: 3, sakit: 2, alfa: 1 },
        jadwal: [
            {
                id: 1,
                jam: "07:30 - 09:00",
                mapel: "Tune Up Sepeda Motor",
                guru: "Burhanudin",
                status: "selesai",
                color: "bg-green-500",
                hadir: true,
            },
            {
                id: 2,
                jam: "09:45 - 10:30",
                mapel: "Sistem Injeksi",
                guru: "Sahroni",
                status: "belum",
                color: "bg-red-500",
                hadir: null,
            },
            {
                id: 3,
                jam: "10:30 - 12:00",
                mapel: "Kejuruan TSM",
                guru: "Sahroni",
                status: "belum",
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
        { key: "X ", label: "Kelas X" },
        { key: "XI ", label: "Kelas XI" },
        { key: "XII ", label: "Kelas XII" },
    ];

    const filteredData =
        activeKelas === "all"
            ? dummyData
            : dummyData.filter((item) => item.kelas.startsWith(activeKelas));

    const getChartData = (kelas: DummyKegiatan) => {
        const key = `chart-kehadiran-${kelas.id}`;
        const saved = sessionStorage.getItem(key);
        if (saved) return JSON.parse(saved);

        const data = [
            { name: "Hadir", value: kelas.siswa.hadir, color: "#00B83D" },
            { name: "Izin", value: kelas.siswa.izin, color: "#F9D900" },
            { name: "Sakit", value: kelas.siswa.sakit, color: "#00ADFF" },
            { name: "Alfa", value: kelas.siswa.alfa, color: "#FF0000" },
        ];

        sessionStorage.setItem(key, JSON.stringify(data));
        return data;
    };

    return (
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

                    const chartData = getChartData(kelas);

                    return (
                        <div
                            key={kelas.id}
                            className="w-full md:w-[calc(50%-12px)] border border-gray-200 rounded-lg p-5 bg-white grid grid-cols-1 md:grid-cols-2 gap-6 hover:shadow"
                        >
                            {/* KIRI */}
                            <div>
                                <div className="inline-block bg-gray-800 text-white px-3 py-1 text-sm font-semibold">
                                    {kelas.kelas}
                                </div>

                                <p className="mt-4 text-sm text-gray-700">
                                    Wali kelas:
                                </p>
                                <p className="font-semibold">{kelas.wali}</p>

                                {/* DONUT */}
                                <div className="mt-6 flex items-center gap-5">
                                    <div className="w-28 h-28 min-w-28 relative">
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
                                                    {chartData.map((d, i) => (
                                                        <Cell
                                                            key={i}
                                                            fill={d.color}
                                                        />
                                                    ))}
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
                                                    className="w-2 h-2 rounded-full"
                                                    style={{
                                                        background: d.color,
                                                    }}
                                                />
                                                {d.name}: {d.value}
                                            </div>
                                        ))}
                                        <div className="flex items-center pt-1 border-t border-gray-300 gap-2">
                                            <span className="font-bold">
                                                Total
                                            </span>
                                            {totalSiswa}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setOpenDetail(true)}
                                            className="mt-2 text-xs text-white bg-sky-600 px-2 py-0.5 hover:bg-sky-700 rounded-sm font-medium"
                                        >
                                            Detail
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* KANAN */}
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
                                            <div className="text-sm font-semibold text-gray-800">
                                                <span className="text-[11px] text-gray-500">
                                                    {j.jam}
                                                </span>{" "}
                                                - {j.mapel}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {j.guru}
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
    );
}
