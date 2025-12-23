import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    Upload,
    WalletCards,
    NotebookPen,
    QrCode,
    Calendar,
    GraduationCap,
    CalendarDays,
    ClipboardList,
    Users2,
    Layers,
    ClipboardCheck,
    UserCheck,
    Megaphone,
    Settings,
    CalendarClock,
    Loader2Icon,
    Loader2,
    Loader,
    LoaderPinwheelIcon,
    Users,
    FileCheck,
    ShieldCheck,
    AlertTriangle,
    MessageSquareHeart,
    FileWarning,
    UsersRound,
} from "lucide-react";

export type MenuItem = {
    section?: string;
    name?: string;
    icon?: LucideIcon;
    path?: string;
    permission?: string;
    children?: MenuItem[];
    spin?: boolean;
};

export const panelMenu: MenuItem[] = [
    // ================================================================
    // SECTION: DASHBOARD
    // ================================================================
    {
        section: "",
        children: [
            {
                name: "Dashboard",
                icon: LayoutDashboard,
                path: "/dashboard",
                permission: "dashboard.view",
            },
        ],
    },

    // ================================================================
    // SECTION: HARI INI
    // ================================================================
    {
        section: "Hari Ini",
        children: [
            {
                name: "Kelas Berlangsung",
                icon: Loader,
                spin: true,
                path: "/kelas-berlangsung",
                permission: "kelas-berlangsung.view",
            },
            {
                name: "Absensi Guru",
                icon: UserCheck,
                path: "/absensi-guru",
                permission: "absensi_guru.view",
            },
        ],
    },

    // ================================================================
    // SECTION: PENGUMUMAN
    // ================================================================
    {
        section: "",
        children: [
            {
                name: "Pengumuman",
                icon: Megaphone,
                path: "/pengumuman",
                permission: "pengumuman.view",
            },
        ],
    },

    // ================================================================
    // SECTION: AKADEMIK
    // ================================================================
    {
        section: "Akademik",
        children: [
            {
                name: "Jadwal",
                icon: Calendar,
                path: "/jadwal-mapel",
                permission: "jadwal.view",
            },
            {
                name: "Absen Siswa",
                icon: ClipboardList,
                path: "/absensi-siswa",
                permission: "absen.siswa.view",
            },

            {
                name: "Kelas Binaan",
                icon: GraduationCap,
                path: "/kelas-binaan",
                permission: "kelas_binaan.view",
                children: [
                    {
                        name: "Jadwal Kelas",
                        path: "/kelas-binaan/jadwal-kelas",
                    },
                    { name: "Absensi Kelas", path: "/kelas-binaan/absensi" },
                    { name: "Data Siswa", path: "/kelas-binaan/data-siswa" },
                    { name: "Rapor Siswa", path: "/kelas-binaan/rapor-siswa" },
                ],
            },
            {
                name: "Modul Ajar",
                icon: Upload,
                path: "/modul-ajar",
                permission: "modul.view",
                children: [
                    {
                        name: "Upload Modul Ajar",
                        path: "/modul-ajar/upload",
                    },
                ],
            },
            {
                name: "Jadwal Kelas",
                icon: CalendarClock,
                path: "/jadwal-semua-kelas",
                permission: "kalender.view",
            },

            {
                name: "Kalender Akademik",
                icon: CalendarDays,
                path: "/kalender-akademik",
                permission: "kalender.view",
            },
        ],
    },

    // ================================================================
    // SECTION: LMS
    // ================================================================
    {
        section: "LMS",
        children: [
            {
                name: "Materi",
                icon: ClipboardList,
                path: "/lms-materi",
                permission: "absen.siswa.view",
            },
            {
                name: "Tugas",
                icon: NotebookPen,
                path: "/lms-tugas",
                permission: "tugas.view",
            },
        ],
    },

    // ================================================================
    // SECTION: KESISWAAN
    // ================================================================
    {
        section: "Kesiswaan",
        children: [
            {
                name: "Dashboard Kedisiplinan",
                icon: ShieldCheck,
                path: "/kedisiplinan",
            },
            {
                name: "Perlu Tindakan",
                icon: AlertTriangle,
                path: "/kedisiplinan/perlu-tindakan",
            },
            {
                name: "Data Siswa",
                icon: Users,
                path: "/kedisiplinan/siswa",
            },
            {
                name: "Riwayat Sanksi",
                icon: FileWarning,
                path: "/kedisiplinan/riwayat-sanksi",
            },
            {
                name: "Master Kedisiplinan",
                icon: Settings,
                children: [
                    {
                        name: "Jenis Pelanggaran",
                        path: "/kedisiplinan/master/jenis-pelanggaran",
                    },
                    {
                        name: "Jenis Sanksi",
                        path: "/kedisiplinan/master/jenis-sanksi",
                    },
                ],
            },
        ],
    },

    // ================================================================
    // SECTION: PPDB
    // ================================================================
    {
        section: "PPDB",
        children: [
            {
                name: "Pendaftaran",
                icon: ClipboardList,
                path: "/ppdb/pendaftaran",
                permission: "ppdb.pendaftaran.view",
            },
            {
                name: "Data Pendaftar",
                icon: Users,
                path: "/ppdb/pendaftar",
                permission: "ppdb.pendaftar.view",
            },
            {
                name: "Verifikasi Berkas",
                icon: FileCheck,
                path: "/ppdb/verifikasi-berkas",
                permission: "ppdb.verifikasi.view",
            },
            {
                name: "Seleksi & Penilaian",
                icon: ClipboardCheck,
                path: "/ppdb/seleksi",
                permission: "ppdb.seleksi.view",
            },
            {
                name: "Pengumuman",
                icon: Megaphone,
                path: "/ppdb/pengumuman-kelulusan",
                permission: "ppdb.pengumuman.view",
            },
            {
                name: "Daftar Ulang",
                icon: Layers,
                path: "/ppdb/penempatan-rombel",
                permission: "ppdb.daftarulang.view",
            },
            {
                name: "Pengaturan PPDB",
                icon: Settings,
                path: "/ppdb/pengaturan",
                permission: "ppdb.settings.view",
            },
        ],
    },

    // ================================================================
    // SECTION: ADMINISTRASI
    // ================================================================
    {
        section: "Administrasi",
        children: [
            {
                name: "Payrol",
                icon: WalletCards,
                path: "/payroll",
                permission: "payroll.view",
                children: [
                    { name: "Jalankan Payroll", path: "/payroll/run" },
                    { name: "Slip Gaji", path: "/payroll/slip" },
                ],
            },
        ],
    },

    // ================================================================
    // SECTION: PENGGUNA
    // ================================================================
    {
        section: "Pengguna",
        children: [
            {
                name: "Akun",
                icon: Users2,
                path: "/akun",
                permission: "akun.view",
            },
            {
                name: "Registrasi Kartu",
                icon: QrCode,
                path: "/rfid",
                permission: "rfid.register.view",
            },
        ],
    },

    // ================================================================
    // SECTION: MASTER DATA
    // ================================================================
    {
        section: "Master Data",
        children: [
            {
                name: "Master Data",
                icon: Layers,
                path: "/master-data",
                permission: "master.view",
                children: [
                    { name: "Guru & Pegawai", path: "/master-data/guru" },
                    { name: "Siswa", path: "/master-data/siswa" },
                    {
                        name: "Jadwal Ajar",
                        path: "/master-data/jadwal-ajar",
                    },
                    { name: "Rombel", path: "/master-data/rombel" },
                    { name: "Alumni", path: "/master-data/alumni" },
                ],
            },
        ],
    },

    // ================================================================
    // SECTION: KONFIGURASI
    // ================================================================
    {
        section: "Konfigurasi",
        children: [
            {
                name: "Konfigurasi",
                icon: Settings,
                path: "/konfigurasi",
                permission: "konfigurasi.view",
                children: [
                    { name: "Jurusan", path: "/konfigurasi/jurusan" },

                    { name: "Mata Pelajaran", path: "/konfigurasi/mapel" },
                    {
                        name: "Jadwal",
                        path: "/konfigurasi/jadwal",
                        children: [
                            { name: "Hari", path: "/konfigurasi/jadwal/hari" },
                            { name: "Jam", path: "/konfigurasi/jadwal/jam" },
                            {
                                name: "Semester",
                                path: "/konfigurasi/jadwal/semester",
                            },
                        ],
                    },
                    {
                        name: "Kalender Akademik",
                        path: "/konfigurasi/kalender-akademik",
                        children: [
                            {
                                name: "Giat Khusus",
                                path: "/konfigurasi/kalender-akademik/giat-khusus",
                            },
                            {
                                name: "Giat Tahunan",
                                path: "/konfigurasi/kalender-akademik/giat-tahunan",
                            },
                        ],
                    },
                    {
                        name: "Titik Absensi",
                        path: "/konfigurasi/titik-absen",
                    },
                    {
                        name: "Role",
                        path: "/konfigurasi/role",
                    },
                ],
            },
        ],
    },
];
