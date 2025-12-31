import { useState, useMemo } from "react";
import { Settings2, X, Check, Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import EditAccountModal from "../components/EditAccountModal";
import AddAccountModal from "../components/AddAccountModal";

export default function Index({ users, allRoles, candidatesGuru, candidatesSiswa }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const filteredUsers = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return users.filter((u) => {
            const nama = (u.profile?.nama ?? "").toLowerCase();
            const username = (u.username ?? "").toLowerCase();
            return nama.includes(q) || username.includes(q);
        });
    }, [users, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

    const handleManageRole = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Akun
                </button>
            </div>

            {/* ACTION BAR */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Data Akun Guru & Pegawai
                    </h1>

                    <div className="flex text-sm items-center gap-3">
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="border border-gray-200 px-3 py-2 rounded-lg w-[90px]"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Cari user..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="w-64 border border-gray-200 px-3 py-2 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded border border-gray-200 bg-white">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-max text-sm text-left">
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
                        {paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    {searchTerm ? "Tidak ditemukan data yang cocok." : "Tidak ada data pengguna."}
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((u, i) => (
                                <tr
                                    key={u.id}
                                    className="border-b border-gray-200 hover:bg-sky-50 transition-colors"
                                >
                                    <td className="py-2 px-3 text-center">
                                        {start + i + 1}
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
                                            className={`px-2 py-0.5 text-xs font-medium ${
                                                (u.status?.toUpperCase() === 'ACTIVE' || u.status === 'aktif')
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-200 text-gray-500 italic"
                                            }`}
                                        >
                                            {(u.status?.toUpperCase() === 'ACTIVE' || u.status === 'aktif') ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {!u.roles?.some(
                                            (r) => r.name === "devhero"
                                        ) && (
                                            <button
                                                onClick={() => handleManageRole(u)}
                                                className="inline-flex items-center gap-1 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs transition-colors"
                                            >
                                                <Settings2 className="w-4 h-4" />
                                                Kelola
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-end items-center gap-3">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border rounded-lg disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-600">
                    {page} dari {totalPages}
                </span>

                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border rounded-lg disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
            </div>

            {/* Role Manager Modal -> Edit Account Modal */}
            <EditAccountModal
                open={isModalOpen}
                user={selectedUser}
                allRoles={allRoles}
                onClose={closeModal}
            />

            <AddAccountModal
                open={isAddModalOpen}
                allRoles={allRoles}
                candidatesGuru={candidatesGuru}
                candidatesSiswa={candidatesSiswa}
                specificUserType="guru_pegawai"
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}


