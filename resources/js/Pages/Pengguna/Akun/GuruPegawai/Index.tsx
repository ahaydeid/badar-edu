import { Eye, Settings2 } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Index({ users }) {
    return (
        <div className="rounded border border-gray-200 bg-white">
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-max text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-sky-100 text-gray-700 h-12">
                            <th className="p-3 text-center">No</th>
                            <th className="p-3">Nama</th>
                            <th className="p-3">Username</th>
                            <th className="p-3 text-center">Role</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center">
                                    Tidak ada data pengguna.
                                </td>
                            </tr>
                        ) : (
                            users.map((u, i) => (
                                <tr
                                    key={u.id}
                                    className="border-b border-gray-200 hover:bg-sky-50"
                                >
                                    <td className="py-2 px-3 text-center">
                                        {i + 1}
                                    </td>
                                    <td className="py-2 px-3">
                                        {u.profile?.nama ?? "-"}
                                    </td>
                                    <td className="py-2 px-3 font-medium">
                                        {u.username}
                                    </td>

                                    <td className="py-2 px-3 text-center">
                                        {u.roles?.length ? (
                                            <div className="flex justify-center gap-1 flex-wrap">
                                                {u.roles.map((r) => (
                                                    <span
                                                        key={r.name}
                                                        className="px-3 py-1 text-xs bg-gray-50 rounded-full text-gray-700 border border-gray-400"
                                                    >
                                                        {r.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td className="py-2 px-3 text-center">
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs border ${
                                                u.status === "aktif"
                                                    ? "bg-gray-100 text-gray-600 border-gray-300"
                                                    : "text-white bg-green-600"
                                            }`}
                                        >
                                            {u.status ?? "-"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {!u.roles?.some(
                                            (r) => r.name === "superadmin"
                                        ) && (
                                            <Link
                                                href={`/akun/guru-pegawai/${u.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs"
                                            >
                                                <Settings2 className="w-4 h-4" />
                                                Kelola{" "}
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
