"use client";

import { useEffect, useState } from "react";
import AttendanceDetailModal from "./components/AttendanceDetailModal";

type KelasTab = string;

type AttendanceRow = {
    id: number;
    nama: string;
    jamMasuk: string;
    jamPulang: string;
    status: "Hadir" | "Terlambat" | "Sakit" | "Izin" | "Alfa";
};

interface JadwalItem {
    id: number;
    jam: string | null;
    mapel: string | null;
    guru: string | null;
    status: "selesai" | "berlangsung" | "belum" | null;
    color: string | null;
    hadir: boolean | null;
}

interface Kegiatan {
    id: number;
    kelas: string;
    wali: string | null;
    siswa: {
        hadir: number;
        izin: number;
        sakit: number;
        alfa: number;
    };
    jadwal: JadwalItem[];
}

export default function KegiatanBelajar({
    items,
    detailAbsen,
}: {
    items: Kegiatan[];
    detailAbsen: Record<number, AttendanceRow[]>;
}) {
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => setAnimate(true));
        return () => cancelAnimationFrame(t);
    }, []);

    const tabList = [
        { key: "10", label: "Kelas 10" },
        { key: "11", label: "Kelas 11" },
        { key: "12", label: "Kelas 12" },
        { key: "X", label: "Kelas X" },
        { key: "XI", label: "Kelas XI" },
        { key: "XII", label: "Kelas XII" },
    ];

    const [activeKelas, setActiveKelas] = useState<KelasTab>(() => {
        // Try to find which tab has data
        const firstWithData = tabList.find(tab => items.some(k => k.kelas.toUpperCase().startsWith(tab.key.toUpperCase())));
        return firstWithData ? firstWithData.key : (items.length > 0 ? "10" : "X");
    });

    const filteredData = items.filter((item) =>
        item.kelas.toUpperCase().startsWith(activeKelas.toUpperCase())
    );

    const getChartData = (kelas: Kegiatan) => [
        { name: "Hadir", value: kelas.siswa.hadir, color: "#00B83D" },
        { name: "Izin", value: kelas.siswa.izin, color: "#F9D900" },
        { name: "Sakit", value: kelas.siswa.sakit, color: "#00ADFF" },
        { name: "Alfa", value: kelas.siswa.alfa, color: "#FF0000" },
    ];

    return (
        <div className="space-y-6 px-6">
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
                            <div>
                                <div className="inline-block bg-gray-800 text-white px-3 py-1 text-sm font-semibold">
                                    {kelas.kelas}
                                </div>

                                <p className="mt-4 text-sm text-gray-700">
                                    Wali kelas:
                                </p>
                                <p className="font-semibold">{kelas.wali}</p>

                                <div className="mt-6 flex items-start gap-5">
                                    <div className="w-full space-y-2 text-xs">
                                        {[
                                            {
                                                label: "Hadir",
                                                value: kelas.siswa.hadir,
                                                color: "bg-green-500",
                                            },
                                            {
                                                label: "Izin",
                                                value: kelas.siswa.izin,
                                                color: "bg-yellow-400",
                                            },
                                            {
                                                label: "Sakit",
                                                value: kelas.siswa.sakit,
                                                color: "bg-blue-400",
                                            },
                                            {
                                                label: "Alfa",
                                                value: kelas.siswa.alfa,
                                                color: "bg-red-500",
                                            },
                                        ].map((s) => {
                                            const percent =
                                                totalSiswa > 0
                                                    ? Math.round(
                                                          (s.value /
                                                              totalSiswa) *
                                                              100
                                                      )
                                                    : 0;

                                            return (
                                                <div key={s.label}>
                                                    <div className="flex justify-between mb-0.5">
                                                        <span>{s.label}</span>
                                                        <span className="font-semibold">
                                                            {s.value}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded">
                                                        <div
                                                            className={`${s.color} h-2 rounded transition-all duration-700 ease-out`}
                                                            style={{
                                                                width: animate
                                                                    ? `${percent}%`
                                                                    : "0%",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-300 text-sm">
                                            <span>
                                                Total{" "}
                                                <span className="text-gray-500">
                                                    (
                                                    {totalSiswa > 0
                                                        ? Math.round(
                                                              (kelas.siswa
                                                                  .hadir /
                                                                  totalSiswa) *
                                                                  100
                                                          )
                                                        : 0}
                                                    %)
                                                </span>
                                            </span>
                                            <span className="font-bold">
                                                {totalSiswa}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedKelasId(kelas.id);
                                                setOpenDetail(true);
                                            }}
                                            className="mt-3 text-sm text-white bg-sky-600 px-3 py-1 cursor-pointer hover:bg-sky-700 rounded-sm font-medium"
                                        >
                                            Detail
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-lg font-semibold text-gray-900">
                                    Jadwal hari ini
                                </p>

                                {kelas.jadwal.length === 0 ? (
                                    <div className="text-sm italic text-gray-400">
                                        Tidak ada jadwal hari ini
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {kelas.jadwal.map((j) => (
                                            <div
                                                key={j.id}
                                                className="border border-gray-200 rounded-lg bg-white px-4 py-3"
                                            >
                                                <div className="text-sm text-gray-700">
                                                    <div className="text-gray-500">
                                                        {j.jam}
                                                    </div>
                                                    <div className="font-semibold text-gray-900">
                                                        {j.mapel}
                                                    </div>
                                                </div>

                                                <div className="mt-1 flex justify-between items-center">
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {j.guru}
                                                    </div>

                                                    <span className="text-xs italic text-gray-400">
                                                        Kosong
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AttendanceDetailModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                kelas={items.find((k) => k.id === selectedKelasId)?.kelas ?? ""}
                data={selectedKelasId ? detailAbsen[selectedKelasId] ?? [] : []}
            />
        </div>
    );
}
