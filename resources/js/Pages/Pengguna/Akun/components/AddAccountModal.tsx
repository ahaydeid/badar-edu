import { useForm } from "@inertiajs/react";
import { X, Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddAccountModal({ open, allRoles, candidatesGuru, candidatesSiswa, onClose, specificUserType }) {
    const { data, setData, post, processing, reset, errors } = useForm<{
        user_type: string;
        user_id: string;
        username: string;
        status: string;
        roles: string[];
    }>({
        user_type: specificUserType || "guru_pegawai", // 'guru_pegawai' or 'siswa'
        user_id: "",
        username: "",
        status: "aktif",
        roles: [],
    });

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [open]);

    const candidates = data.user_type === "guru_pegawai" ? candidatesGuru : candidatesSiswa;

    const handleToggleRole = (roleName) => {
        if (data.roles.includes(roleName)) {
            setData("roles", data.roles.filter((r) => r !== roleName));
        } else {
            setData("roles", [...data.roles, roleName]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/akun/store", {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <>
            {(open || visible) && (
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200 ${
                        visible ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={onClose}
                >
                    <div
                        className={`w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-200 ${
                            visible ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-5"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    Tambah Akun Baru
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {specificUserType === "guru_pegawai" 
                                        ? "Buat akun untuk Guru & Pegawai" 
                                        : specificUserType === "siswa" 
                                            ? "Buat akun untuk Siswa"
                                            : "Buat akun untuk Guru, Pegawai atau Siswa"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200/50 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-5">
                                {/* User Type Selection - ONLY SHOW IF NO SPECIFIC TYPE */}
                                {!specificUserType && (
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Jenis Pengguna
                                        </label>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData("user_type", "guru_pegawai");
                                                    setData("user_id", ""); 
                                                }}
                                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                                                    data.user_type === "guru_pegawai"
                                                        ? "bg-white text-sky-600 shadow-sm"
                                                        : "text-gray-500 hover:text-gray-700"
                                                }`}
                                            >
                                                Guru & Pegawai
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData("user_type", "siswa");
                                                    setData("user_id", "");
                                                }}
                                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                                                    data.user_type === "siswa"
                                                        ? "bg-white text-sky-600 shadow-sm"
                                                        : "text-gray-500 hover:text-gray-700"
                                                }`}
                                            >
                                                Siswa
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Name Selection */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Nama Akun
                                    </label>
                                    <select
                                        value={data.user_id}
                                        onChange={(e) => setData("user_id", e.target.value)}
                                        className="w-full border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm"
                                    >
                                        <option value="">-- Pilih Nama --</option>
                                        {candidates.map((c) => (
                                            <option 
                                                key={c.id} 
                                                value={c.id}
                                                disabled={!!c.user}
                                                className={c.user ? "text-gray-400 italic bg-gray-50" : ""}
                                            >
                                                {c.nama} {c.user ? "(Sudah punya akun)" : ""}
                                            </option>
                                        ))}
                                    </select>
                                    {data.user_id && (
                                         <p className="mt-1 text-xs text-sky-600">
                                            {data.user_type === "guru_pegawai" 
                                                ? "Username: Kode Guru, Password: NIK" 
                                                : "Username: NISN, Password: password (default)"}
                                         </p>
                                    )}
                                </div>

                                {/* Status Switch */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">
                                        Status Akun
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData("status", data.status === "aktif" ? "nonaktif" : "aktif")
                                        }
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            data.status === "aktif" ? "bg-green-500" : "bg-gray-200"
                                        }`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                data.status === "aktif" ? "translate-x-5" : "translate-x-0"
                                            }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex justify-end -mt-3">
                                    <span className="text-xs text-gray-500">
                                        {data.status === "aktif" ? "Aktif" : "Nonaktif"}
                                    </span>
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Role Pengguna
                                    </label>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <div className="max-h-40 overflow-y-auto p-2 space-y-1">
                                            {allRoles.filter(r => r.name !== 'devhero').map((role) => {
                                                const isSelected = data.roles.includes(role.name);
                                                return (
                                                    <div
                                                        key={role.id}
                                                        onClick={() => handleToggleRole(role.name)}
                                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                                            isSelected
                                                                ? "text-sky-700 bg-sky-50"
                                                                : "hover:bg-gray-50 text-gray-700"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 border rounded flex items-center justify-center ${
                                                                isSelected
                                                                    ? "bg-sky-500 border-sky-500"
                                                                    : "border-gray-400 bg-white"
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <Check className="w-3 h-3 text-white" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {role.name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {processing ? "Simpan..." : "Tambah Akun"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
