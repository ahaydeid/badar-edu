"use client";

import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarGrid from "./components/CalendarGrid";
import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { CalendarEvent } from "./components/AgendaModal";
import AppLayout from "@/Layouts/AppLayout";

export default function Page() {
    const { events } = usePage<InertiaPageProps & { events: CalendarEvent[] }>()
        .props;

    const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
    const today = dayjs();

    const prevMonth = () =>
        setCurrentMonth((prev) => prev.subtract(1, "month"));
    const nextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));

    return (
        <AppLayout title="Kalender Akademik">
            <section className="w-full min-h-screen px-24 pt-6">
                <div>
                    <div className="flex items-center justify-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            Kalender Akademik
                        </h1>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg hover:bg-sky-100 text-sky-600 transition"
                        >
                            <ChevronLeft className="w-7 h-7" />
                        </button>

                        <p className="text-2xl font-semibold text-sky-700">
                            {currentMonth.format("MMMM YYYY")}
                        </p>

                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg hover:bg-sky-100 text-sky-600 transition"
                        >
                            <ChevronRight className="w-7 h-7" />
                        </button>
                    </div>
                </div>

                <CalendarGrid
                    currentMonth={currentMonth}
                    today={today}
                    events={events}
                />

                <div className="mt-10">
                    {(() => {
                        const bulanEvents = events.filter(
                            (e) =>
                                dayjs(e.tanggal).month() ===
                                    currentMonth.month() &&
                                dayjs(e.tanggal).year() === currentMonth.year()
                        );

                        if (bulanEvents.length === 0) {
                            return (
                                <p className="text-sm text-gray-500">
                                    Tidak ada kegiatan untuk bulan ini.
                                </p>
                            );
                        }

                        const grouped: Record<
                            string,
                            { tanggal: number[]; kategori: string | null }
                        > = {};

                        bulanEvents.forEach((e) => {
                            const key = e.kegiatan ?? "Tidak ada kegiatan";
                            const tgl = dayjs(e.tanggal).date();

                            if (!grouped[key]) {
                                grouped[key] = {
                                    tanggal: [],
                                    kategori: e.kategori ?? null,
                                };
                            }

                            grouped[key].tanggal.push(tgl);
                        });

                        return Object.entries(grouped)
                            .sort((a, b) => a[1].tanggal[0] - b[1].tanggal[0])
                            .map(([kegiatan, info]) => {
                                const tanggalStr = info.tanggal
                                    .sort((a, b) => a - b)
                                    .join(", ");
                                const bulanStr = currentMonth.format("MMMM");

                                return (
                                    <div
                                        key={kegiatan}
                                        className="text-sm mb-1"
                                    >
                                        <span className="font-semibold text-gray-700">
                                            {tanggalStr} {bulanStr}
                                        </span>
                                        {": "}
                                        <span
                                            className={
                                                info.kategori === "LIBUR"
                                                    ? "text-red-500 font-medium"
                                                    : "text-gray-700"
                                            }
                                        >
                                            {kegiatan}
                                        </span>
                                    </div>
                                );
                            });
                    })()}
                </div>
            </section>
        </AppLayout>
    );
}
