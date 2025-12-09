"use client";

import { useState, type ChangeEvent } from "react";
import LokasiAbsenModal from "./LokasiAbsenModal";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function AbsensiGuru() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    // Dummy detail untuk modal (UI only)
    const [detail, setDetail] = useState<{
        nama: string | null;
        mapel: string | null;
        jamMasuk: string | null;
        status: string | null;
        lat: number | null;
        lng: number | null;
    }>({
        nama: null,
        mapel: null,
        jamMasuk: null,
        status: null,
        lat: null,
        lng: null,
    });

    const { items } = usePage().props;
    const rows = items as {
        id: number;
        nama: string;
        mapel: string;
        jadwalMasuk: string | null;
        jamMasuk: string | null;
        jamPulang: string | null;
        lat: number | null;
        lng: number | null;
    }[];

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filtered = rows.filter((item) => {
        const q = search.toLowerCase();
        return (
            item.nama.toLowerCase().includes(q) ||
            item.mapel.toLowerCase().includes(q)
        );
    });

    const openModal = (item: (typeof rows)[0]) => {
        setDetail({
            nama: item.nama,
            mapel: item.mapel,
            jamMasuk: item.jamMasuk,
            status: "HADIR", // Static, UI only
            lat: item.lat,
            lng: item.lng,
        });
        setOpen(true);
    };

    return (
        <AppLayout title="Absensi Guru Hari Ini">
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Cari guru atau mapel..."
                    className="w-full md:w-1/3 px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-gray-500"
                    value={search}
                    onChange={handleSearch}
                />

                <div className="overflow-x-auto border border-gray-200 rounded bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700 text-left">
                            <tr>
                                <th className="p-3">No</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Mengajar</th>
                                <th className="p-3">Jadwal Masuk</th>
                                <th className="p-3">Absen Masuk</th>
                                <th className="p-3">Absen Pulang</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Lokasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center p-4 text-gray-500"
                                    >
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item, idx) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-3">{idx + 1}</td>
                                        <td className="p-3">{item.nama}</td>
                                        <td className="p-3">{item.mapel}</td>
                                        <td className="p-3">
                                            {item.jadwalMasuk}
                                        </td>
                                        <td className="p-3">
                                            {item.jamMasuk ?? "-"}
                                        </td>
                                        <td className="p-3">
                                            {item.jamPulang ?? "-"}
                                        </td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                                HADIR
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                type="button"
                                                onClick={() => openModal(item)}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
                                            >
                                                Lihat
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <LokasiAbsenModal
                    open={open}
                    onClose={() => setOpen(false)}
                    lat={detail.lat}
                    lng={detail.lng}
                    nama={detail.nama}
                    jamMasuk={detail.jamMasuk}
                />
            </div>
        </AppLayout>
    );
}
