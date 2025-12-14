import { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import { router } from "@inertiajs/react";

/* ===================== TYPES ===================== */

type Props = {
    open: boolean;
    onClose: () => void;
    rombelList: { id: number; nama: string }[];
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

/* ===================== COMPONENT ===================== */

export default function TambahSiswa({ open, onClose, rombelList }: Props) {
    const [form, setForm] = useState<FormState>({
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

        wali: {
            ayah: { ...emptyWali },
            ibu: { ...emptyWali },
            wali: { ...emptyWali },
        },
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setPreview(null);
        setSubmitting(false);
    }, [open]);

    /* ===================== HANDLERS ===================== */

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
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    function handleSubmit() {
        setSubmitting(true);

        const data = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (key === "wali") {
                data.append("wali", JSON.stringify(value));
            } else if (value !== null && value !== "") {
                data.append(key, value as any);
            }
        });

        router.post("/master-data/siswa", data, {
            forceFormData: true,
            onFinish: () => setSubmitting(false),
            onSuccess: () => onClose(),
        });
    }

    if (!open) return null;

    /* ===================== UI ===================== */

    return (
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="bg-slate-50 w-full h-full overflow-y-auto">
                {/* HEADER */}
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Tambah Data Siswa (Lengkap)
                    </h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
                    {/* FOTO */}
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

                    {/* DATA SISWA */}
                    <Section title="Data Pribadi Siswa">
                        <Grid>
                            <Input
                                label="Nama Lengkap"
                                onChange={(e) => update("nama", e.target.value)}
                            />
                            <Input
                                label="NIPD"
                                onChange={(e) => update("nipd", e.target.value)}
                            />
                            <Input
                                label="NISN"
                                onChange={(e) => update("nisn", e.target.value)}
                            />
                            <Select
                                label="Jenis Kelamin"
                                onChange={(e) =>
                                    update(
                                        "jenis_kelamin",
                                        e.target.value as "L" | "P"
                                    )
                                }
                            >
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </Select>
                            <Input
                                label="Tempat Lahir"
                                onChange={(e) =>
                                    update("tempat_lahir", e.target.value)
                                }
                            />
                            <Input
                                type="date"
                                label="Tanggal Lahir"
                                onChange={(e) =>
                                    update("tanggal_lahir", e.target.value)
                                }
                            />
                            <Input
                                label="NIK"
                                onChange={(e) => update("nik", e.target.value)}
                            />
                            <Input
                                label="Agama"
                                onChange={(e) =>
                                    update("agama", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    {/* ALAMAT */}
                    <Section title="Alamat Lengkap">
                        <Grid>
                            <Textarea
                                label="Alamat"
                                onChange={(e) =>
                                    update("alamat", e.target.value)
                                }
                            />
                            <Input
                                label="RT"
                                onChange={(e) => update("rt", e.target.value)}
                            />
                            <Input
                                label="RW"
                                onChange={(e) => update("rw", e.target.value)}
                            />
                            <Input
                                label="Dusun"
                                onChange={(e) =>
                                    update("dusun", e.target.value)
                                }
                            />
                            <Input
                                label="Kelurahan"
                                onChange={(e) =>
                                    update("kelurahan", e.target.value)
                                }
                            />
                            <Input
                                label="Kecamatan"
                                onChange={(e) =>
                                    update("kecamatan", e.target.value)
                                }
                            />
                            <Input
                                label="Kode Pos"
                                onChange={(e) =>
                                    update("kode_pos", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    {/* KONTAK & LAINNYA */}
                    <Section title="Kontak & Lainnya">
                        <Grid>
                            <Input
                                label="Jenis Tinggal"
                                onChange={(e) =>
                                    update("jenis_tinggal", e.target.value)
                                }
                            />
                            <Input
                                label="Alat Transportasi"
                                onChange={(e) =>
                                    update("alat_transportasi", e.target.value)
                                }
                            />
                            <Input
                                label="Telepon"
                                onChange={(e) =>
                                    update("telepon", e.target.value)
                                }
                            />
                            <Input
                                label="HP"
                                onChange={(e) => update("hp", e.target.value)}
                            />
                            <Input
                                label="Email"
                                onChange={(e) =>
                                    update("email", e.target.value)
                                }
                            />
                            <Input
                                label="SKHUN"
                                onChange={(e) =>
                                    update("skhun", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    {/* KPS */}
                    <Section title="KPS">
                        <Grid>
                            <Select
                                label="Penerima KPS"
                                onChange={(e) =>
                                    update(
                                        "penerima_kps",
                                        e.target.value as "YA" | "TIDAK"
                                    )
                                }
                            >
                                <option value="TIDAK">TIDAK</option>
                                <option value="YA">YA</option>
                            </Select>
                            <Input
                                label="Nomor KPS"
                                disabled={form.penerima_kps !== "YA"}
                                onChange={(e) =>
                                    update("nomor_kps", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    {/* ROMBEL */}
                    <Section title="Rombel">
                        <Select
                            label="Rombel Saat Ini"
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

                    {/* WALI */}
                    <Section title="Data Orang Tua / Wali">
                        {(["ayah", "ibu", "wali"] as const).map((jenis) => (
                            <div key={jenis}>
                                <h4 className="font-semibold uppercase">
                                    {jenis}
                                </h4>
                                <Grid>
                                    <Input
                                        label="Nama"
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

                    {/* ACTION */}
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

/* ===================== SMALL COMPONENTS ===================== */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
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
            <input {...props} className="input border border-gray-200 rounded-lg p-2 w-full" />
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
            <select {...props} className="input border border-gray-200 rounded-lg p-2 w-full">
                {props.children}
            </select>
        </label>
    );
}
