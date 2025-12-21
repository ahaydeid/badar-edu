"use client";

import { useState, type ChangeEvent } from "react";
import LokasiAbsenModal from "./LokasiAbsenModal";
import { usePage } from "@inertiajs/react";
import { MapPin } from "lucide-react";

function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

export default function AbsensiGuru() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [detail, setDetail] = useState<{
        nama: string | null;
        jamMasuk: string | null;
        lat: number | null;
        lng: number | null;
    }>({
        nama: null,
        jamMasuk: null,
        lat: null,
        lng: null,
    });

    const { items } = usePage().props;

    const rows = items as {
        id: number;
        nama: string;
        mapel: string;
        jadwal: string;
        jamMasuk: string | null;
        jamPulang: string | null;
        status: string;
        lat: number | null;
        lng: number | null;
        metodeAbsen: "geo" | "rfid" | null;
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
            jamMasuk: item.jamMasuk,
            lat: item.lat,
            lng: item.lng,
        });
        setOpen(true);
    };

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const renderStatus = (item: (typeof rows)[0]) => {
        const [jadwalMasuk, jadwalPulang] = item.jadwal.split("-");
        const jadwalMasukMin = timeToMinutes(jadwalMasuk);
        const jadwalPulangMin = timeToMinutes(jadwalPulang);

        // BELUM ABSEN
        if (!item.jamMasuk) {
            if (nowMinutes < jadwalMasukMin) {
                return <span>-</span>;
            }

            if (nowMinutes >= jadwalPulangMin) {
                return (
                    <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700">
                        Tidak Hadir
                    </span>
                );
            }

            return (
                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700">
                    Belum Hadir
                </span>
            );
        }

        // SUDAH ABSEN
        const jamMasukMin = timeToMinutes(item.jamMasuk);

        if (jamMasukMin > jadwalMasukMin) {
            return (
                <span className="inline-block px-2 py-1 text-xs bg-yellow-300 text-gray-700">
                    Terlambat
                </span>
            );
        }

        return (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700">
                {item.status}
            </span>
        );
    };

    const renderJenisAbsen = (item: (typeof rows)[0]) => {
        if (!item.jamMasuk) return <span>-</span>;

        return item.metodeAbsen === "geo" ? (
            <button
                type="button"
                onClick={() => openModal(item)}
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-500 cursor-pointer text-white rounded-md"
            >
                <MapPin className="mr-1 h-4 w-4" />
                <span>Lokasi</span>
            </button>
        ) : (
            <span className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md cursor-default">
                ID Card
            </span>
        );
    };

    return (
        <>
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
                                <th className="p-3 border-r border-white">
                                    No
                                </th>
                                <th className="p-3 border-r border-white">
                                    Nama
                                </th>
                                <th className="p-3 border-r border-white">
                                    Mengajar
                                </th>
                                <th className="p-3 border-r border-white">
                                    Jadwal
                                </th>
                                <th className="p-3 border-r border-white">
                                    Absen Masuk
                                </th>
                                <th className="p-3 border-r border-white">
                                    Absen Pulang
                                </th>
                                <th className="p-3 border-r border-white">
                                    Status
                                </th>
                                <th className="p-3">Jenis Absen</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center p-4 text-gray-500"
                                    >
                                        Tidak ada jadwal hari ini.
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
                                        <td className="p-3 text-center">
                                            {item.jadwal}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.jamMasuk ?? "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.jamPulang ?? "-"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {renderStatus(item)}
                                        </td>
                                        <td className="p-3 text-center">
                                            {renderJenisAbsen(item)}
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
        </>
    );
}
