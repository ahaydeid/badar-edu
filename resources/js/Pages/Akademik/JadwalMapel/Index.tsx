"use client";

import React, { useMemo } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import JadwalHariCard from "./components/JadwalHariCard";

type DayRow = { id: number; nama: string };

type JadwalRow = {
    id: number;
    hari_id: number;
    kelas?: { nama?: string } | null;
    jp: number;
    jamLabels: string[];
    jamMulai?: string | null;
    jamSelesai?: string | null;
};

const toMinutes = (time: string | null): number => {
    if (!time) return 9999;
    const [h = "0", m = "0"] = time.split(":");
    return Number(h) * 60 + Number(m);
};

export default function Index(): React.ReactElement {
    const { days, jadwals } = usePage().props as any;

    const jadwalMap = useMemo(() => {
        // const map = new Map<number, JadwalRow[]>();
        const map = new Map<number, any[]>();

        (days || []).forEach((day: DayRow) => {
            map.set(day.id, []);
        });

        (jadwals || []).forEach((j: JadwalRow) => {
            map.get(j.hari_id)?.push(j);
        });

        map.forEach((list) =>
            list.sort(
                (a, b) =>
                    toMinutes(a.jamMulai ?? null) -
                    toMinutes(b.jamMulai ?? null)
            )
        );

        return map;
    }, [days, jadwals]);

    return (
        <>
            <div className="min-h-screen pb-4">
                <h1 className="text-center text-2xl font-extrabold pb-4 mb-4 bg-gray-50">
                    Jadwal Mengajar Mapel
                </h1>

                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-3 gap-4">
                        {(days || []).map((day: DayRow) => (
                            <JadwalHariCard
                                key={`day-${day.id ?? "x"}-${day.nama}`}
                                day={day}
                                list={jadwalMap.get(day.id) ?? []}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
