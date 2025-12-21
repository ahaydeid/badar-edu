"use client";

import React from "react";
import { usePage } from "@inertiajs/react";

type JadwalItem = {
    jam_mulai: string;
    jam_selesai: string;
    mapel: string;
    guru: string | null;
    warna: string;
};

export default function JadwalPage() {
    const { jadwal, kelas, wali } = usePage().props as any;

    return (
        <div className="px-2">
            <div className="border-b border-gray-300 ml-5 pb-4 mb-8">
                <h1 className="text-3xl font-bold">Jadwal Kelas {kelas}</h1>
                <p className="text-gray-500 mt-1">
                    Wali Kelas:{" "}
                    <span className="font-bold text-gray-800">{wali}</span>
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {Object.entries(jadwal).map(([hari, list]: any) => (
                    <div
                        key={hari}
                        className="bg-white border border-gray-200 rounded-md p-4"
                    >
                        <h3 className="text-xl font-bold mb-4">{hari}</h3>

                        <div className="space-y-1">
                            {list.map((j: JadwalItem, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex text-sm text-gray-700 rounded"
                                    style={{ backgroundColor: j.warna }}
                                >
                                    <div className="w-28 px-2 py-2 text-xs font-semibold border-r border-white">
                                        {j.jam_mulai} - {j.jam_selesai}
                                    </div>

                                    <div className="flex-1 px-3 py-2 uppercase font-bold text-xs">
                                        {j.mapel}
                                    </div>

                                    <div className="w-28 px-3 py-2 text-xs">
                                        {j.guru ?? "-"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
