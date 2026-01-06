import { Head, router, usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import {
    MoreVertical,
    Settings,
    LogOut,
    User,
    FileText,
    GraduationCap,
    BookOpen,
    Award,
    Briefcase,
    Pencil,
} from "lucide-react";

export default function Profile({ canEdit }: { canEdit: boolean }) {
    const { auth } = usePage<any>().props;
    const u = auth?.user;

    const [tab, setTab] = useState<"profil" | "tugas">("profil");
    const [open, setOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);

    function logout() {
        router.post("/logout");
    }

    const namaLengkap = [
        u?.gelar_depan,
        u?.nama,
        u?.gelar_belakang ? `, ${u.gelar_belakang}` : "",
    ]
        .filter(Boolean)
        .join(" ");

    const formatTanggal = (date?: string) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <>
            <Head title="Profil Guru" />

            <div className="max-w-6xl mx-auto p-2">
                <div className="bg-white border border-gray-200 rounded-lg hover:shadow-sm">
                    {/* HEADER */}
                    <div className="flex items-start gap-6 p-6 border-b border-gray-200">
                        <img
                            src={
                                u?.foto
                                    ? u.foto.startsWith("http")
                                        ? u.foto
                                        : `/storage/${u.foto}`
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                          u?.nama || ""
                                      )}&background=0ea5e9&color=fff`
                            }
                            className="w-32 h-32 rounded-xl object-cover"
                        />

                        <div className="flex-1">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {namaLengkap}
                            </h1>
                            <div className=" text-gray-500 mt-1">
                                Kode Guru: {u?.kode_guru || "-"}
                            </div>
                            <div className="flex gap-2 mt-1">
                                {(auth?.roles ?? []).map((role: string) => (
                                    <span
                                        key={role}
                                        className=" px-2 py-0.5 text-white bg-sky-600"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* SETTINGS */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <Settings
                                    size={18}
                                    className="text-gray-600"
                                />
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-md z-50">
                                    {canEdit && (
                                        <Link 
                                            href="/profile/settings"
                                            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"
                                        >
                                            <Pencil
                                                size={16}
                                                className="text-gray-600"
                                            />
                                            Edit Data
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => setConfirmLogout(true)}
                                        className="w-full flex items-center gap-2 text-left px-4 py-2  text-red-600 hover:bg-gray-50"
                                    >
                                        <LogOut size={16} />
                                        Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="px-6 pt-3 border-b border-gray-200 flex gap-6 ">
                        <button
                            onClick={() => setTab("profil")}
                            className={`pb-3 ${
                                tab === "profil"
                                    ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                                    : "text-gray-400"
                            }`}
                        >
                            Profil
                        </button>
                        <button
                            onClick={() => setTab("tugas")}
                            className={`pb-3 ${
                                tab === "tugas"
                                    ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                                    : "text-gray-400"
                            }`}
                        >
                            Tugas & Beban
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6 space-y-4">
                        {tab === "profil" && (
                            <>
                                <section className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <h3 className="flex items-center gap-2 text- font-semibold text-sky-600 mb-3 tracking-wide">
                                        <User
                                            size={20}
                                            className="text-sky-600"
                                        />
                                        IDENTITAS
                                    </h3>
                                    <div className="grid grid-cols-4 gap-x-4 gap-y-4 text-base">
                                        <Item
                                            label="Nama Lengkap"
                                            value={ u?.nama}
                                        />
                                        <Item
                                            label="Gelar Depan"
                                            value={u?.gelar_depan || "-"}
                                        />
                                        <Item
                                            label="Gelar Belakang"
                                            value={u?.gelar_belakang || "-"}
                                        />
                                        <Item
                                            label="Jenis Kelamin"
                                            value={
                                                u?.jk === "L"
                                                    ? "Laki-laki"
                                                    : "Perempuan"
                                            }
                                        />
                                        <Item
                                            label="Tempat Lahir"
                                            value={u?.tempat_lahir || "-"}
                                        />
                                        <Item
                                            label="Tanggal Lahir"
                                            value={formatTanggal(
                                                u?.tanggal_lahir
                                            )}
                                        />
                                    </div>
                                </section>

                                <section className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <h3 className="flex items-center gap-2 text- font-semibold text-sky-600 mb-3 tracking-wide">
                                        <FileText
                                            size={20}
                                            className="text-sky-600"
                                        />
                                        ADMINISTRATIF
                                    </h3>
                                    <div className="grid grid-cols-4 gap-x-4 gap-y-4 text-base">
                                        <Item
                                            label="NIP"
                                            value={u?.nip || "-"}
                                        />
                                        <Item
                                            label="NIK"
                                            value={u?.nik || "-"}
                                        />
                                        <Item
                                            label="NUPTK"
                                            value={u?.nuptk || "-"}
                                        />
                                        <Item
                                            label="Status Kepegawaian"
                                            value={u?.status_kepegawaian || "-"}
                                        />
                                        <Item
                                            label="Jenis PTK"
                                            value={u?.jenis_ptk || "-"}
                                        />
                                        <Item
                                            label="TMT Kerja"
                                            value={formatTanggal(u?.tmt_kerja)}
                                        />
                                    </div>
                                </section>

                                <section className="border border-gray-200 rounded-lg p-4 bg-linear-to-br from-white to-gray-50">
                                    <h3 className="flex items-center gap-2 text- font-semibold text-sky-600 mb-3 tracking-wide">
                                        <GraduationCap
                                            size={20}
                                            className="text-sky-600"
                                        />
                                        AKADEMIK
                                    </h3>
                                    <div className="grid grid-cols-4 gap-x-4 gap-y-4 text-base">
                                        <Item
                                            label="Jenjang"
                                            value={u?.jenjang || "-"}
                                        />
                                        <Item
                                            label="Prodi"
                                            value={u?.prodi || "-"}
                                        />
                                        <Item
                                            label="Sertifikasi"
                                            value={u?.sertifikasi || "-"}
                                        />
                                    </div>
                                </section>
                            </>
                        )}

                        {tab === "tugas" && (
                            <>
                                <section className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <h3 className="flex items-center gap-2 text- font-semibold text-sky-600 mb-3 tracking-wide">
                                        <BookOpen
                                            size={20}
                                            className="text-sky-600"
                                        />
                                        MENGAJAR
                                    </h3>
                                    <div className="grid grid-cols-4 gap-x-4 gap-y-4 text-base">
                                        <Item
                                            label="Mata Pelajaran"
                                            value={u?.mengajar || "-"}
                                        />
                                        <Item
                                            label="JJM"
                                            value={
                                                u?.jjm ? `${u.jjm} Jam` : "-"
                                            }
                                        />
                                        <Item
                                            label="Total JJM"
                                            value={
                                                u?.total_jjm
                                                    ? `${u.total_jjm} Jam`
                                                    : "-"
                                            }
                                        />
                                    </div>
                                </section>

                                <section className="border border-gray-200 rounded-lg p-4 bg-linear-to-br from-white to-blue-50/40">
                                    <h3 className="flex items-center gap-2 text- font-semibold text-sky-600 mb-3 tracking-wide">
                                        <Briefcase
                                            size={20}
                                            className="text-sky-600"
                                        />
                                        TUGAS TAMBAHAN
                                    </h3>
                                    <div className="grid grid-cols-4 gap-x-4 gap-y-4 text-base">
                                        <Item
                                            label="Tugas Tambahan"
                                            value={u?.tugas_tambahan || "-"}
                                        />
                                        <Item
                                            label="Jam Tugas Tambahan"
                                            value={
                                                u?.jam_tugas_tambahan
                                                    ? `${u?.jam_tugas_tambahan} Jam`
                                                    : "-"
                                            }
                                        />
                                    </div>
                                </section>

                                <section className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <h3 className="flex items-center gap-2 text- font-semibold text-sky-600 mb-3 tracking-wide">
                                        <Award
                                            size={20}
                                            className="text-sky-600"
                                        />
                                        KOMPETENSI
                                    </h3>
                                    <div className="flex flex-wrap gap-2 ">
                                        {(u?.kompetensi
                                            ? u.kompetensi.split(",")
                                            : []
                                        ).map((k: string) => (
                                            <span
                                                key={k}
                                                className="px-2.5 py-0.5 rounded-md border border-gray-300 bg-gray-50 text-gray-700"
                                            >
                                                {k.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmLogout}
                title="Keluar Aplikasi?"
                message="Anda yakin ingin keluar dari sesi ini? Anda harus login kembali untuk mengakses aplikasi."
                confirmText="Ya, Keluar"
                cancelText="Batal"
                variant="danger"
                onClose={() => setConfirmLogout(false)}
                onConfirm={logout}
            />
        </>
    );
}

function Item({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text- text-gray-400 mb-1">{label}</div>
            <div className="font-medium text-gray-900">{value}</div>
        </div>
    );
}
