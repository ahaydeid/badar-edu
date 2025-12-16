"use client";

import { useState, type ChangeEvent } from "react";
import LokasiAbsenModal from "./LokasiAbsenModal";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { MapPin } from "lucide-react";

export default function AbsensiGuru() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

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
        metodeAbsen: "geo" | "rfid";
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
            status: "HADIR",
            lat: item.lat,
            lng: item.lng,
        });
        setOpen(true);
    };

    return (
        <AppLayout title="Absensi Guru Hari Ini">
            <h2 className="font-bold text-3xl mb-6">Absensi Guru Hari Ini</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Cari guru atau mapel..."
                    className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-gray-400"
                    value={search}
                    onChange={handleSearch}
                />

                <div className="overflow-x-auto border border-gray-200 rounded bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-sky-100 text-gray-700">
                            <tr className="text-center">
                                <th className="p-3 border-r border-gray-50">
                                    No
                                </th>
                                <th className="p-3 border-r border-gray-50">
                                    Nama
                                </th>
                                <th className="p-3 border-r border-gray-50">
                                    Mengajar
                                </th>
                                <th className="p-3 border-r border-gray-50">
                                    Jadwal Masuk
                                </th>
                                <th className="p-3 border-r border-gray-50">
                                    Absen Masuk
                                </th>
                                <th className="p-3 border-r border-gray-50">
                                    Absen Pulang
                                </th>
                                <th className="p-3 border-r border-gray-50">
                                    Status
                                </th>
                                <th className="p-3 border-r border-gray-50">
                                    Jenis Absen
                                </th>
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
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-100"
                                    >
                                        <td className="p-3 text-center">
                                            {idx + 1}
                                        </td>
                                        <td className="p-3">{item.nama}</td>
                                        <td className="p-3">{item.mapel}</td>
                                        <td className="p-3">
                                            {item.jadwalMasuk}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.jamMasuk ?? "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.jamPulang ?? "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                                HADIR
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.metodeAbsen === "geo" ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openModal(item)
                                                    }
                                                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-500 cursor-pointer text-white rounded-md"
                                                >
                                                    <MapPin className="mr-1 h-4 w-4" />
                                                    <span>Lokasi</span>
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md cursor-default">
                                                    Kartu
                                                </span>
                                            )}
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
