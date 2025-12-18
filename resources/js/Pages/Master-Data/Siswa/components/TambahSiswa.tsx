import { useEffect, useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";
import TambahSiswaTabHeader from "./TambahSiswaTabHeader";
import TambahSiswaTabPanels from "./TambahSiswaTabPanels";

type Props = {
    open: boolean;
    onClose: () => void;
    rombelList: { id: number; nama: string }[];
    editId?: number | null;
    initialData?: any;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

type WaliForm = {
    nama: string;
    tahun_lahir: string;
    jenjang_pendidikan: string;
    pekerjaan: string;
    penghasilan: string;
    nik: string;
};

type FormState = {
    foto: File | null;

    nama: string;
    nipd: string;
    nisn: string;
    jenis_kelamin: "L" | "P";
    tempat_lahir: string;
    tanggal_lahir: string;
    nik: string;
    agama: string;

    alamat: string;
    rt: string;
    rw: string;
    dusun: string;
    kelurahan: string;
    kecamatan: string;
    kode_pos: string;

    jenis_tinggal: string;
    alat_transportasi: string;
    telepon: string;
    hp: string;
    email: string;
    skhun: string;

    penerima_kps: "YA" | "TIDAK";
    nomor_kps: string;

    rombel_saat_ini: string;

    no_peserta_un: string;
    no_seri_ijazah: string;

    penerima_kip: "YA" | "TIDAK";
    nomor_kip: string;
    nama_di_kip: string;
    nomor_kks: string;

    no_registrasi_akta_lahir: string;

    bank: string;
    nomor_rekening_bank: string;
    rekening_atas_nama: string;

    layak_pip: "YA" | "TIDAK";
    alasan_layak_pip: string;

    kebutuhan_khusus: string;
    sekolah_asal: string;
    anak_ke: string;

    lintang: string;
    bujur: string;

    no_kk: string;

    berat_badan: string;
    tinggi_badan: string;
    lingkar_kepala: string;
    jumlah_saudara_kandung: string;
    jarak_rumah_ke_sekolah_km: string;

    wali: {
        ayah: WaliForm;
        ibu: WaliForm;
        wali: WaliForm;
    };
};

const emptyWali: WaliForm = {
    nama: "",
    tahun_lahir: "",
    jenjang_pendidikan: "",
    pekerjaan: "",
    penghasilan: "",
    nik: "",
};

function emptyForm(): FormState {
    return {
        foto: null,

        nama: "",
        nipd: "",
        nisn: "",
        jenis_kelamin: "L",
        tempat_lahir: "",
        tanggal_lahir: "",
        nik: "",
        agama: "",

        alamat: "",
        rt: "",
        rw: "",
        dusun: "",
        kelurahan: "",
        kecamatan: "",
        kode_pos: "",

        jenis_tinggal: "",
        alat_transportasi: "",
        telepon: "",
        hp: "",
        email: "",
        skhun: "",

        penerima_kps: "TIDAK",
        nomor_kps: "",

        rombel_saat_ini: "",

        no_peserta_un: "",
        no_seri_ijazah: "",

        penerima_kip: "TIDAK",
        nomor_kip: "",
        nama_di_kip: "",
        nomor_kks: "",

        no_registrasi_akta_lahir: "",

        bank: "",
        nomor_rekening_bank: "",
        rekening_atas_nama: "",

        layak_pip: "TIDAK",
        alasan_layak_pip: "",

        kebutuhan_khusus: "",
        sekolah_asal: "",
        anak_ke: "",

        lintang: "",
        bujur: "",

        no_kk: "",

        berat_badan: "",
        tinggi_badan: "",
        lingkar_kepala: "",
        jumlah_saudara_kandung: "",
        jarak_rumah_ke_sekolah_km: "",

        wali: {
            ayah: { ...emptyWali },
            ibu: { ...emptyWali },
            wali: { ...emptyWali },
        },
    };
}

export default function TambahSiswa({
    open,
    onClose,
    rombelList,
    editId,
    initialData,
    onSuccess,
    onError,
}: Props) {
    const [form, setForm] = useState<FormState>(emptyForm());
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // TAB state (tambahan saja)
    const [activeTab, setActiveTab] = useState(0);
    const TOTAL_TABS = 5;

    useEffect(() => {
        if (!open) return;

        setSubmitting(false);
        setActiveTab(0);

        if (editId && initialData) {
            const f = emptyForm();

            Object.keys(f).forEach((k) => {
                if (k === "foto") return;
                if (k === "wali") return;
                if (initialData[k] !== undefined && initialData[k] !== null) {
                    (f as any)[k] = String(initialData[k]) as any;
                }
            });

            f.jenis_kelamin = (
                initialData.jenis_kelamin === "P" ? "P" : "L"
            ) as any;

            f.penerima_kps = (
                initialData.penerima_kps === "YA" ? "YA" : "TIDAK"
            ) as any;
            f.penerima_kip = (
                initialData.penerima_kip === "YA" ? "YA" : "TIDAK"
            ) as any;
            f.layak_pip = (
                initialData.layak_pip === "YA" ? "YA" : "TIDAK"
            ) as any;

            f.wali = initialData.wali ?? f.wali;

            setForm(f);
            setPreview(
                initialData.foto ? `/storage/${initialData.foto}` : null
            );
        } else {
            setForm(emptyForm());
            setPreview(null);
        }
    }, [open, editId, initialData]);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function updateWali(
        jenis: "ayah" | "ibu" | "wali",
        key: keyof WaliForm,
        value: string
    ) {
        setForm((prev) => ({
            ...prev,
            wali: {
                ...prev.wali,
                [jenis]: {
                    ...prev.wali[jenis],
                    [key]: value,
                },
            },
        }));
    }

    function handleFoto(file: File | null) {
        setForm((prev) => ({ ...prev, foto: file }));
        if (!file) {
            setPreview(
                editId && initialData?.foto
                    ? `/storage/${initialData.foto}`
                    : null
            );
            return;
        }
        setPreview(URL.createObjectURL(file));
    }

    function handleSubmit() {
        setSubmitting(true);

        const data = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (key === "wali") {
                data.append("wali", JSON.stringify(value));
                return;
            }
            if (key === "foto") {
                if (value) data.append("foto", value as any);
                return;
            }
            data.append(key, (value ?? "") as any);
        });

        if (editId) {
            data.append("_method", "PUT");
            router.post(`/master-data/siswa/${editId}`, data, {
                forceFormData: true,
                onFinish: () => setSubmitting(false),
                onSuccess: () => {
                    onSuccess("Data siswa berhasil diperbarui");
                    onClose();
                },
                onError: () => {
                    onError("Gagal memperbarui data siswa");
                },
            });
            return;
        }

        router.post("/master-data/siswa", data, {
            forceFormData: true,
            onFinish: () => setSubmitting(false),
            onSuccess: () => {
                onSuccess("Data siswa berhasil ditambahkan");
                onClose();
            },
            onError: () => {
                onError("Gagal menambahkan data siswa");
            },
        });
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="bg-slate-50 w-full h-full overflow-y-auto">
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Tambah Data Siswa</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-8 py-8 space-y-4">
                    {/* TAB HEADER (tambahan saja) */}
                    <TambahSiswaTabHeader
                        tabs={[
                            "Data Utama",
                            "Alamat & Lokasi",
                            "Keluarga / Wali",
                            "Akademik & Bantuan",
                            "Kesehatan & Keuangan",
                        ]}
                        active={activeTab}
                        onChange={setActiveTab}
                    />

                    {/* TAB CONTENT */}
                    <TambahSiswaTabPanels
                        activeTab={activeTab}
                        form={form}
                        preview={preview}
                        rombelList={rombelList}
                        editId={editId}
                        initialData={initialData}
                        update={update}
                        updateWali={updateWali}
                        handleFoto={handleFoto}
                    />

                    {/* BUTTONS (tetap sama) */}
                    <div className="flex justify-end gap-4 pb-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg p-2"
                        >
                            Batal
                        </button>

                        {activeTab < TOTAL_TABS - 1 ? (
                            <button
                                type="button"
                                onClick={() => setActiveTab((t) => t + 1)}
                                className="px-6 py-2 flex text-sky-600 rounded hover:bg-gray-200"
                            >
                                Selanjutnya
                                <ChevronRight />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-6 py-2 bg-sky-600 text-white rounded"
                            >
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
