// resources/js/Pages/Master-Data/Siswa/components/TambahSiswa.tsx

import { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import { router } from "@inertiajs/react";

type Props = {
    open: boolean;
    onClose: () => void;
    rombelList: { id: number; nama: string }[];
    editId?: number | null;
    initialData?: any;
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
}: Props) {
    const [form, setForm] = useState<FormState>(emptyForm());
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;

        setSubmitting(false);

        if (editId && initialData) {
            const f = emptyForm();

            Object.keys(f).forEach((k) => {
                if (k === "foto") return;
                if (k === "wali") return;
                if (initialData[k] !== undefined && initialData[k] !== null) {
                    f[k] = String(initialData[k]) as any;
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
                onSuccess: () => onClose(),
            });
            return;
        }

        router.post("/master-data/siswa", data, {
            forceFormData: true,
            onFinish: () => setSubmitting(false),
            onSuccess: () => onClose(),
        });
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="bg-slate-50 w-full h-full overflow-y-auto">
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Tambah Data Siswa
                    </h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-8 py-8 space-y-4">
                    <Section title="Foto Siswa">
                        <label className="w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer">
                            {preview ? (
                                <img
                                    src={preview}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <User />
                            )}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) =>
                                    handleFoto(e.target.files?.[0] ?? null)
                                }
                            />
                        </label>
                    </Section>

                    <Section title="Data Pribadi Siswa">
                        <Grid>
                            <Input
                                label="Nama Lengkap"
                                value={form.nama}
                                onChange={(e) => update("nama", e.target.value)}
                            />
                            <Input
                                label="NIPD"
                                value={form.nipd}
                                onChange={(e) => update("nipd", e.target.value)}
                            />
                            <Input
                                label="NISN"
                                value={form.nisn}
                                onChange={(e) => update("nisn", e.target.value)}
                            />
                            <Select
                                label="Jenis Kelamin"
                                value={form.jenis_kelamin}
                                onChange={(e) =>
                                    update(
                                        "jenis_kelamin",
                                        e.target.value as any
                                    )
                                }
                            >
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </Select>
                            <Input
                                label="Tempat Lahir"
                                value={form.tempat_lahir}
                                onChange={(e) =>
                                    update("tempat_lahir", e.target.value)
                                }
                            />
                            <Input
                                type="date"
                                label="Tanggal Lahir"
                                value={form.tanggal_lahir}
                                onChange={(e) =>
                                    update("tanggal_lahir", e.target.value)
                                }
                            />
                            <Input
                                label="NIK"
                                value={form.nik}
                                onChange={(e) => update("nik", e.target.value)}
                            />
                            <Input
                                label="Agama"
                                value={form.agama}
                                onChange={(e) =>
                                    update("agama", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Alamat Lengkap">
                        <Grid>
                            <Textarea
                                label="Alamat"
                                value={form.alamat}
                                onChange={(e) =>
                                    update("alamat", e.target.value)
                                }
                            />
                            <Input
                                label="RT"
                                value={form.rt}
                                onChange={(e) => update("rt", e.target.value)}
                            />
                            <Input
                                label="RW"
                                value={form.rw}
                                onChange={(e) => update("rw", e.target.value)}
                            />
                            <Input
                                label="Dusun"
                                value={form.dusun}
                                onChange={(e) =>
                                    update("dusun", e.target.value)
                                }
                            />
                            <Input
                                label="Kelurahan"
                                value={form.kelurahan}
                                onChange={(e) =>
                                    update("kelurahan", e.target.value)
                                }
                            />
                            <Input
                                label="Kecamatan"
                                value={form.kecamatan}
                                onChange={(e) =>
                                    update("kecamatan", e.target.value)
                                }
                            />
                            <Input
                                label="Kode Pos"
                                value={form.kode_pos}
                                onChange={(e) =>
                                    update("kode_pos", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Kontak & Lainnya">
                        <Grid>
                            <Input
                                label="Jenis Tinggal"
                                value={form.jenis_tinggal}
                                onChange={(e) =>
                                    update("jenis_tinggal", e.target.value)
                                }
                            />
                            <Input
                                label="Alat Transportasi"
                                value={form.alat_transportasi}
                                onChange={(e) =>
                                    update("alat_transportasi", e.target.value)
                                }
                            />
                            <Input
                                label="Telepon"
                                value={form.telepon}
                                onChange={(e) =>
                                    update("telepon", e.target.value)
                                }
                            />
                            <Input
                                label="HP"
                                value={form.hp}
                                onChange={(e) => update("hp", e.target.value)}
                            />
                            <Input
                                label="Email"
                                value={form.email}
                                onChange={(e) =>
                                    update("email", e.target.value)
                                }
                            />
                            <Input
                                label="SKHUN"
                                value={form.skhun}
                                onChange={(e) =>
                                    update("skhun", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Akademik">
                        <Grid>
                            <Input
                                label="No Peserta UN"
                                value={form.no_peserta_un}
                                onChange={(e) =>
                                    update("no_peserta_un", e.target.value)
                                }
                            />
                            <Input
                                label="No Seri Ijazah"
                                value={form.no_seri_ijazah}
                                onChange={(e) =>
                                    update("no_seri_ijazah", e.target.value)
                                }
                            />
                            <Input
                                label="Sekolah Asal"
                                value={form.sekolah_asal}
                                onChange={(e) =>
                                    update("sekolah_asal", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="KPS">
                        <Grid>
                            <Select
                                label="Penerima KPS"
                                value={form.penerima_kps}
                                onChange={(e) =>
                                    update(
                                        "penerima_kps",
                                        e.target.value as any
                                    )
                                }
                            >
                                <option value="TIDAK">TIDAK</option>
                                <option value="YA">YA</option>
                            </Select>
                            <Input
                                label="Nomor KPS"
                                value={form.nomor_kps}
                                disabled={form.penerima_kps !== "YA"}
                                onChange={(e) =>
                                    update("nomor_kps", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="KIP">
                        <Grid>
                            <Select
                                label="Penerima KIP"
                                value={form.penerima_kip}
                                onChange={(e) =>
                                    update(
                                        "penerima_kip",
                                        e.target.value as any
                                    )
                                }
                            >
                                <option value="TIDAK">TIDAK</option>
                                <option value="YA">YA</option>
                            </Select>
                            <Input
                                label="Nomor KIP"
                                value={form.nomor_kip}
                                disabled={form.penerima_kip !== "YA"}
                                onChange={(e) =>
                                    update("nomor_kip", e.target.value)
                                }
                            />
                            <Input
                                label="Nama di KIP"
                                value={form.nama_di_kip}
                                disabled={form.penerima_kip !== "YA"}
                                onChange={(e) =>
                                    update("nama_di_kip", e.target.value)
                                }
                            />
                            <Input
                                label="Nomor KKS"
                                value={form.nomor_kks}
                                onChange={(e) =>
                                    update("nomor_kks", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="PIP">
                        <Grid>
                            <Select
                                label="Layak PIP"
                                value={form.layak_pip}
                                onChange={(e) =>
                                    update("layak_pip", e.target.value as any)
                                }
                            >
                                <option value="TIDAK">TIDAK</option>
                                <option value="YA">YA</option>
                            </Select>
                            <Textarea
                                label="Alasan Layak PIP"
                                value={form.alasan_layak_pip}
                                disabled={form.layak_pip !== "YA"}
                                onChange={(e) =>
                                    update("alasan_layak_pip", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Identitas & Keluarga">
                        <Grid>
                            <Input
                                label="No KK"
                                value={form.no_kk}
                                onChange={(e) =>
                                    update("no_kk", e.target.value)
                                }
                            />
                            <Input
                                label="No Registrasi Akta Lahir"
                                value={form.no_registrasi_akta_lahir}
                                onChange={(e) =>
                                    update(
                                        "no_registrasi_akta_lahir",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="Anak Ke"
                                value={form.anak_ke}
                                onChange={(e) =>
                                    update("anak_ke", e.target.value)
                                }
                            />
                            <Input
                                label="Jumlah Saudara Kandung"
                                value={form.jumlah_saudara_kandung}
                                onChange={(e) =>
                                    update(
                                        "jumlah_saudara_kandung",
                                        e.target.value
                                    )
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Kesehatan & Fisik">
                        <Grid>
                            <Input
                                label="Kebutuhan Khusus"
                                value={form.kebutuhan_khusus}
                                onChange={(e) =>
                                    update("kebutuhan_khusus", e.target.value)
                                }
                            />
                            <Input
                                label="Berat Badan"
                                value={form.berat_badan}
                                onChange={(e) =>
                                    update("berat_badan", e.target.value)
                                }
                            />
                            <Input
                                label="Tinggi Badan"
                                value={form.tinggi_badan}
                                onChange={(e) =>
                                    update("tinggi_badan", e.target.value)
                                }
                            />
                            <Input
                                label="Lingkar Kepala"
                                value={form.lingkar_kepala}
                                onChange={(e) =>
                                    update("lingkar_kepala", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Lokasi">
                        <Grid>
                            <Input
                                label="Lintang"
                                value={form.lintang}
                                onChange={(e) =>
                                    update("lintang", e.target.value)
                                }
                            />
                            <Input
                                label="Bujur"
                                value={form.bujur}
                                onChange={(e) =>
                                    update("bujur", e.target.value)
                                }
                            />
                            <Input
                                label="Jarak Rumah ke Sekolah (KM)"
                                value={form.jarak_rumah_ke_sekolah_km}
                                onChange={(e) =>
                                    update(
                                        "jarak_rumah_ke_sekolah_km",
                                        e.target.value
                                    )
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Perbankan">
                        <Grid>
                            <Input
                                label="Bank"
                                value={form.bank}
                                onChange={(e) => update("bank", e.target.value)}
                            />
                            <Input
                                label="Nomor Rekening Bank"
                                value={form.nomor_rekening_bank}
                                onChange={(e) =>
                                    update(
                                        "nomor_rekening_bank",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="Rekening Atas Nama"
                                value={form.rekening_atas_nama}
                                onChange={(e) =>
                                    update("rekening_atas_nama", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Rombel">
                        <Select
                            label="Rombel Saat Ini"
                            value={form.rombel_saat_ini}
                            onChange={(e) =>
                                update("rombel_saat_ini", e.target.value)
                            }
                        >
                            <option value="">Pilih Rombel</option>
                            {rombelList.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.nama}
                                </option>
                            ))}
                        </Select>
                    </Section>

                    <Section title="Data Orang Tua / Wali">
                        {(["ayah", "ibu", "wali"] as const).map((jenis) => (
                            <div key={jenis}>
                                <h4 className="font-semibold uppercase">
                                    {jenis}
                                </h4>
                                <Grid>
                                    <Input
                                        label="Nama"
                                        value={form.wali[jenis].nama}
                                        onChange={(e) =>
                                            updateWali(
                                                jenis,
                                                "nama",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        label="Tahun Lahir"
                                        value={form.wali[jenis].tahun_lahir}
                                        onChange={(e) =>
                                            updateWali(
                                                jenis,
                                                "tahun_lahir",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        label="Pendidikan"
                                        value={
                                            form.wali[jenis].jenjang_pendidikan
                                        }
                                        onChange={(e) =>
                                            updateWali(
                                                jenis,
                                                "jenjang_pendidikan",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        label="Pekerjaan"
                                        value={form.wali[jenis].pekerjaan}
                                        onChange={(e) =>
                                            updateWali(
                                                jenis,
                                                "pekerjaan",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        label="Penghasilan"
                                        value={form.wali[jenis].penghasilan}
                                        onChange={(e) =>
                                            updateWali(
                                                jenis,
                                                "penghasilan",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        label="NIK"
                                        value={form.wali[jenis].nik}
                                        onChange={(e) =>
                                            updateWali(
                                                jenis,
                                                "nik",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>
                            </div>
                        ))}
                    </Section>

                    <div className="flex justify-end gap-4 pb-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-200 rounded-lg p-2"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2 bg-sky-600 text-white rounded"
                        >
                            {submitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-semibold">{title}</h3>
            {children}
        </div>
    );
}

function Grid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    );
}

function Input(props: any) {
    return (
        <label className="block">
            <span className="text-sm">{props.label}</span>
            <input
                {...props}
                className="input border border-gray-200 rounded-lg p-2 w-full"
            />
        </label>
    );
}

function Textarea(props: any) {
    return (
        <label className="block md:col-span-3">
            <span className="text-sm">{props.label}</span>
            <textarea
                {...props}
                className="input border border-gray-200 rounded-lg p-2 w-full h-24"
            />
        </label>
    );
}

function Select(props: any) {
    return (
        <label className="block">
            <span className="text-sm">{props.label}</span>
            <select
                {...props}
                className="input border border-gray-200 rounded-lg p-2 w-full"
            >
                {props.children}
            </select>
        </label>
    );
}
