"use client";

import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { usePage } from "@inertiajs/react";
import type { PageProps } from "@inertiajs/core";

type SiswaItem = {
    id: number;
    nama: string;
    jenis_kelamin: string;
};

type JadwalItem = {
    jam_mulai: string;
    jam_selesai: string;
    mapel: string;
    warna: string;
};

type Props = PageProps & {
    jadwal: Record<string, JadwalItem[]>;
    kelas: string;
    wali: string;
    siswa: SiswaItem[];
};

export default function DetailKelas() {
    const { jadwal, kelas, wali, siswa } = usePage<Props>().props;

    const hariEntries = Object.entries(jadwal || {});

    return (
        <div className="px-6 pb-6 space-y-6">
            <div className="border-b border-gray-300 pb-4">
                <Link
                    href="/jadwal-semua-kelas"
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </Link>

                <h1 className="text-3xl font-bold">Jadwal Kelas {kelas}</h1>
                <p className="text-gray-500 mt-1">
                    Wali Kelas:{" "}
                    <span className="font-bold text-gray-800">{wali}</span>
                </p>
            </div>

            {/* CONTENT */}
            <div className="flex gap-4 items-start">
                {/* KIRI — SISWA (TANPA SCROLL) */}
                <div className="w-1/3 bg-white border border-gray-200 rounded-md p-4">
                    <h3 className="font-bold text-lg mb-3">Daftar Siswa</h3>

                    <table className="w-full text-sm border border-gray-300">
                        <thead className="bg-sky-100">
                            <tr>
                                <th className="border border-gray-300 px-2 py-2 w-10 text-center">
                                    No
                                </th>
                                <th className="border border-gray-300 px-2 py-2 text-center">
                                    Nama
                                </th>
                                <th className="border border-gray-300 px-2 py-2 w-12 text-center">
                                    JK
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {siswa.map((s, idx) => (
                                <tr key={s.id}>
                                    <td className="border border-gray-300 px-2 py-1 text-center">
                                        {idx + 1}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1">
                                        {s.nama}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">
                                        {s.jenis_kelamin}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* KANAN — JADWAL (GRID SENDIRI, TINGGI CARD NATURAL) */}
                <div className="flex-1 grid grid-cols-2 gap-4 items-start">
                    {hariEntries.length === 0 ? (
                        <div className="col-span-2 py-10 text-center text-gray-500">
                            Belum ada jadwal yang diatur
                        </div>
                    ) : (
                        hariEntries.map(([hari, list]) => (
                            <div
                                key={hari}
                                className="bg-white border border-gray-200 rounded-md p-4 h-fit"
                            >
                                <h3 className="text-xl font-bold mb-4">
                                    {hari}
                                </h3>

                                <div className="space-y-1">
                                    {list.map((j, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center text-sm text-gray-800 rounded px-3 py-2 font-semibold"
                                            style={{
                                                backgroundColor: j.warna,
                                            }}
                                        >
                                            <span className="whitespace-nowrap">
                                                {j.jam_mulai} - {j.jam_selesai}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span className="uppercase">
                                                {j.mapel}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
