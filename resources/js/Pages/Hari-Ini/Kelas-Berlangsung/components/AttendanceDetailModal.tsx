import { Fragment } from "react";

type AttendanceRow = {
    id: number;
    nama: string;
    jamMasuk: string;
    jamPulang: string;
    status: "Hadir" | "Terlambat" | "Sakit" | "Izin" | "Alfa";
};

type Props = {
    open: boolean;
    onClose: () => void;
    kelas: string;
};

const dummyData: AttendanceRow[] = [
    {
        id: 1,
        nama: "Ahmad Fauzi",
        jamMasuk: "07:00",
        jamPulang: "14:00",
        status: "Hadir",
    },
    {
        id: 2,
        nama: "Siti Aisyah",
        jamMasuk: "07:15",
        jamPulang: "14:00",
        status: "Terlambat",
    },
    {
        id: 3,
        nama: "Budi Santoso",
        jamMasuk: "-",
        jamPulang: "-",
        status: "Alfa",
    },
];

export default function AttendanceDetailModal({ open, onClose, kelas }: Props) {
    if (!open) return null;

    return (
        <Fragment>
            {/* Backdrop */}
            <div
                className="fixed min-h-screen inset-0 bg-black/40 z-9999"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-9999 flex items-center justify-center">
                <div className="bg-white w-full max-w-3xl rounded-sm shadow-lg p-6 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">
                             Detail Kehadiran <span className="text-sky-600">{kelas}</span> 
                        </h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="border border-white bg-sky-100 px-3 py-2 text-center">
                                        No
                                    </th>
                                    <th className="border border-white bg-sky-100 px-3 py-2 text-left">
                                        Nama
                                    </th>
                                    <th className="border border-white bg-sky-100 px-3 py-2">
                                        Jam Masuk
                                    </th>
                                    <th className="border border-white bg-sky-100 px-3 py-2">
                                        Jam Pulang
                                    </th>
                                    <th className="border border-white bg-sky-100 px-3 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dummyData.map((row, i) => (
                                    <tr key={row.id}>
                                        <td className="border border-gray-100 px-3 py-2 text-center">
                                            {i + 1}
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2">
                                            {row.nama}
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2 text-center">
                                            {row.jamMasuk}
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2 text-center">
                                            {row.jamPulang}
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2 text-center font-medium">
                                            {row.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
