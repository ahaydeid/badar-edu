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
    Users,
    ShieldCheck,
    AlertTriangle,
    FileWarning,
    Radio,
    BarChart3,
    Building2,
} from "lucide-react";

export type MenuItem = {
    section?: string;
    name?: string;
    icon?: LucideIcon;
    path?: string;
    permission?: string;
    children?: MenuItem[];
    spin?: boolean;
    live?: boolean;
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
                icon: Radio,
                spin: false,
                live: true,
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
                permission: "jadwal-mapel.view",
            },
            {
                name: "Absensi Siswa",
                icon: ClipboardList,
                path: "/absensi-siswa",
                permission: "absensi-siswa.view",
            },
            {
                name: "Nilai Siswa",
                icon: BarChart3,
                path: "/penilaian",
                permission: "nilai.view",
            },
            {
                name: "Kelas Binaan",
                icon: GraduationCap,
                path: "/kelas-binaan",
                // permission: "kelas-binaan.view", // Removed per request
                children: [
                    {
                        name: "Jadwal Kelas",
                        path: "/kelas-binaan/jadwal-kelas",
                        permission: "kelas-binaan.jadwal.view",
                    },
                    {
                        name: "Absensi Siswa",
                        path: "/kelas-binaan/absensi-siswa",
                        permission: "kelas-binaan.absensi.view",
                    },
                    {
                        name: "Progres Siswa",
                        path: "/kelas-binaan/progres-siswa",
                        permission: "kelas-binaan.progres.view",
                    },
                    {
                        name: "Data Siswa",
                        path: "/kelas-binaan/data-siswa",
                        permission: "kelas-binaan.siswa.view",
                    },
                    {
                        name: "Rapor Siswa",
                        path: "/kelas-binaan/rapor-siswa",
                        permission: "kelas-binaan.rapor.view",
                    },
                ],
            },

            {
                name: "Rencana Ajar",
                icon: Upload,
                path: "/rencana-ajar",
                // permission: "rencana-ajar.view", // Removed per request
                children: [
                    {
                        name: "Modul Ajar",
                        path: "/rencana-ajar/modul",
                        permission: "rencana-ajar.view",
                    },
                    {
                        name: "Silabus",
                        path: "/rencana-ajar/silabus",
                        permission: "rencana-ajar.view",
                    },
                ],
            },
            {
                name: "Jadwal Kelas",
                icon: CalendarClock,
                path: "/jadwal-semua-kelas",
                permission: "jadwal-semua-kelas.view",
            },
            {
                name: "Kalender Akademik",
                icon: CalendarDays,
                path: "/kalender-akademik",
                permission: "kalender-akademik.view",
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
                permission: "lms.materi.view",
            },
            {
                name: "Tugas",
                icon: NotebookPen,
                path: "/lms-tugas",
                permission: "lms.tugas.view",
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
                permission: "kedisiplinan.view",
            },
            {
                name: "Perlu Tindakan",
                icon: AlertTriangle,
                path: "/kedisiplinan/perlu-tindakan",
                permission: "kedisiplinan.view",
            },
            {
                name: "Data Siswa",
                icon: Users,
                path: "/kedisiplinan/siswa",
                permission: "kedisiplinan.view",
            },
            {
                name: "Riwayat Sanksi",
                icon: FileWarning,
                path: "/kedisiplinan/riwayat-sanksi",
                permission: "kedisiplinan.view",
            },
            {
                name: "Master Kedisiplinan",
                icon: Settings,
                path: "/kedisiplinan/master",
                permission: "kedisiplinan.view",
                children: [
                    {
                        name: "Jenis Pelanggaran",
                        path: "/kedisiplinan/master/jenis-pelanggaran",
                        permission: "kedisiplinan.view",
                    },
                    {
                        name: "Jenis Sanksi",
                        path: "/kedisiplinan/master/jenis-sanksi",
                        permission: "kedisiplinan.view",
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
                name: "Pengaturan PPDB",
                icon: Settings,
                path: "/ppdb/pengaturan",
                permission: "ppdb.settings.view",
            },
            {
                name: "Pendaftaran Masuk",
                icon: Users,
                path: "/ppdb/pendaftaran",
                permission: "ppdb.pendaftaran.view",
            },
            {
                name: "Verifikasi & Seleksi",
                icon: ClipboardCheck,
                path: "/ppdb/verifikasi",
                permission: "ppdb.verifikasi.view",
            },
            {
                name: "Daftar Ulang",
                icon: Layers,
                path: "/ppdb/daftar-ulang",
                permission: "ppdb.daftarulang.view",
            },
            {
                name: "Siswa Baru",
                icon: GraduationCap,
                path: "/ppdb/siswa-baru",
                permission: "ppdb.siswabaru.view",
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
                name: "Payroll",
                icon: WalletCards,
                permission: "payroll.view",
                children: [
                    {
                        name: "Jalankan Payroll",
                        path: "/payroll/run",
                        permission: "payroll.run",
                    },
                    {
                        name: "Slip Gaji",
                        path: "/payroll/slip",
                        permission: "payroll.slip",
                    },
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
                // permission: "pengguna.view", // Removed per request
                children: [
                    {
                        name: "Guru & Pegawai",
                        path: "/akun/guru-pegawai",
                        permission: "guru-pegawai.view",
                    },
                    {
                        name: "Siswa",
                        path: "/akun/siswa",
                        permission: "siswa.view",
                    },
                ],
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
                // permission: "master-data.view", // Removed per request
                children: [
                    {
                        name: "Guru & Pegawai",
                        path: "/master-data/guru",
                        permission: "master-data.guru.view",
                    },
                    {
                        name: "Siswa",
                        path: "/master-data/siswa",
                        permission: "master-data.siswa.view",
                    },
                    {
                        name: "Jadwal Ajar",
                        path: "/master-data/jadwal-ajar",
                        permission: "master-data.jadwal-ajar.view",
                    },
                    {
                        name: "Rombel",
                        path: "/master-data/rombel",
                        permission: "master-data.rombel.view",
                    },
                    {
                        name: "Alumni",
                        path: "/master-data/alumni",
                        permission: "master-data.alumni.view",
                    },
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
                // permission: "konfigurasi.view", // Removed per request
                children: [
                    {
                        name: "Profil Sekolah",
                        path: "/konfigurasi/profile-sekolah",
                        permission: "konfigurasi.view",
                    },
                    {
                        name: "Jurusan",
                        path: "/konfigurasi/jurusan",
                        permission: "konfigurasi.jurusan.view",
                    },
                    {
                        name: "Mata Pelajaran",
                        path: "/konfigurasi/mapel",
                        permission: "konfigurasi.mapel.view",
                    },
                    {
                        name: "Jadwal",
                        path: "/konfigurasi/jadwal",
                        permission: "konfigurasi.jadwal.view",
                        children: [
                            {
                                name: "Hari",
                                path: "/konfigurasi/jadwal/hari",
                                permission: "konfigurasi.jadwal.view",
                            },
                            {
                                name: "Jam",
                                path: "/konfigurasi/jadwal/jam",
                                permission: "konfigurasi.jadwal.view",
                            },
                            {
                                name: "Semester",
                                path: "/konfigurasi/jadwal/semester",
                                permission: "konfigurasi.jadwal.view",
                            },
                        ],
                    },
                    {
                        name: "Kalender Akademik",
                        path: "/konfigurasi/kalender-akademik",
                        permission: "konfigurasi.kalender-akademik.view",
                        children: [
                            {
                                name: "Giat Khusus",
                                path: "/konfigurasi/kalender-akademik/giat-khusus",
                                permission:
                                    "konfigurasi.kalender-akademik.view",
                            },
                            {
                                name: "Giat Tahunan",
                                path: "/konfigurasi/kalender-akademik/giat-tahunan",
                                permission:
                                    "konfigurasi.kalender-akademik.view",
                            },
                        ],
                    },
                    {
                        name: "Titik Absensi",
                        path: "/konfigurasi/titik-absen",
                        permission: "konfigurasi.view",
                    },
                    {
                        name: "Role",
                        path: "/konfigurasi/role",
                        permission: "konfigurasi.role.view",
                    },
                ],
            },
        ],
    },
];
