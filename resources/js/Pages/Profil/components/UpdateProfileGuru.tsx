import { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import { router } from "@inertiajs/react";

type Props = {
    open: boolean;
    onClose: () => void;
    initialData?: any; // Data guru
};

type FormState = {
    foto: File | null;

    nama: string;
    nuptk: string;
    nik: string;
    nip: string;
    jk: "L" | "P";
    tempat_lahir: string;
    tanggal_lahir: string;

    status_kepegawaian: string;
    jenis_ptk: string;
    gelar_depan: string;
    gelar_belakang: string;
    jenjang: string;
    prodi: string;
    sertifikasi: string;

    tmt_kerja: string;
    tugas_tambahan: string;
    mengajar: string;

    jam_tugas_tambahan: string;
    jjm: string;
    total_jjm: string;

    kompetensi: string;
};

function emptyForm(): FormState {
    return {
        foto: null,

        nama: "",
        nuptk: "",
        nik: "",
        nip: "",
        jk: "L",
        tempat_lahir: "",
        tanggal_lahir: "",

        status_kepegawaian: "",
        jenis_ptk: "",
        gelar_depan: "",
        gelar_belakang: "",
        jenjang: "",
        prodi: "",
        sertifikasi: "",

        tmt_kerja: "",
        tugas_tambahan: "",
        mengajar: "",

        jam_tugas_tambahan: "",
        jjm: "",
        total_jjm: "",

        kompetensi: "",
    };
}

export default function UpdateProfileGuru({
    open,
    onClose,
    initialData,
}: Props) {
    const [form, setForm] = useState<FormState>(emptyForm());
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    
    // Confirm & Toast
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
    const [toast, setToast] = useState({ open: false, message: "", type: "success" as "success" | "error" });

    useEffect(() => {
        if (!open) return;

        setSubmitting(false);

        if (initialData) {
            const f = emptyForm();
            
            Object.keys(f).forEach((k) => {
                if (k === "foto") return;
                if (initialData[k] !== undefined && initialData[k] !== null) {
                    f[k as keyof FormState] = String(initialData[k]) as any;
                }
            });

            f.jk = initialData.jk === "P" ? "P" : "L";

            setForm(f);
            setPreview(
                initialData.foto ? `/storage/${initialData.foto}` : null
            );
        } else {
            setForm(emptyForm());
            setPreview(null);
        }
    }, [open, initialData]);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleFoto(file: File | null) {
        setForm((prev) => ({ ...prev, foto: file }));
        if (!file) {
            setPreview(
                initialData?.foto
                    ? `/storage/${initialData.foto}`
                    : null
            );
            return;
        }
        setPreview(URL.createObjectURL(file));
    }

    function handleSubmit() {
        setConfirmSaveOpen(true);
    }
    
    function handleConfirmSave() {
        setSubmitting(true);
        setConfirmSaveOpen(false); 

        const data = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (key === "foto") {
                if (value) data.append("foto", value as any);
                return;
            }
            data.append(key, (value ?? "") as any);
        });

        const options = {
            forceFormData: true,
            onFinish: () => setSubmitting(false),
            onSuccess: () => {
                setToast({ open: true, message: "Profil berhasil diperbarui", type: "success" });
                setTimeout(() => {
                    setToast(prev => ({ ...prev, open: false }));
                    onClose();
                }, 2000);
            },
            onError: (errors: any) => {
                 setToast({ open: true, message: "Gagal menyimpan data. Periksa input anda.", type: "error" });
                 setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
            }
        };

        // Custom route for self update
        router.post("/profile/update-data", data, options);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="bg-slate-50 w-full h-full overflow-y-auto">
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Update Profil Guru
                    </h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-8 py-8 space-y-4">
                    <Section title="Foto Guru">
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

                    <Section title="Identitas Guru">
                        <Grid>
                            <Input
                                label="Nama"
                                value={form.nama}
                                onChange={(e: any) => update("nama", e.target.value)}
                            />
                            <Input
                                label="NIP"
                                value={form.nip}
                                onChange={(e: any) => update("nip", e.target.value)}
                            />
                            <Input
                                label="NUPTK"
                                value={form.nuptk}
                                onChange={(e: any) =>
                                    update("nuptk", e.target.value)
                                }
                            />
                            <Select
                                label="Jenis Kelamin"
                                value={form.jk}
                                onChange={(e: any) =>
                                    update("jk", e.target.value as any)
                                }
                            >
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </Select>
                            <Input
                                label="NIK"
                                value={form.nik}
                                onChange={(e: any) => update("nik", e.target.value)}
                            />
                            <Input
                                label="Tempat Lahir"
                                value={form.tempat_lahir}
                                onChange={(e: any) =>
                                    update("tempat_lahir", e.target.value)
                                }
                            />
                            <Input
                                type="date"
                                label="Tanggal Lahir"
                                value={form.tanggal_lahir}
                                onChange={(e: any) =>
                                    update("tanggal_lahir", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Kepegawaian & Akademik">
                        <Grid>
                            <Input
                                label="Status Kepegawaian"
                                value={form.status_kepegawaian}
                                onChange={(e: any) =>
                                    update("status_kepegawaian", e.target.value)
                                }
                            />
                            <Input
                                label="Jenis PTK"
                                value={form.jenis_ptk}
                                onChange={(e: any) =>
                                    update("jenis_ptk", e.target.value)
                                }
                            />
                            <Input
                                label="Gelar Depan"
                                value={form.gelar_depan}
                                onChange={(e: any) =>
                                    update("gelar_depan", e.target.value)
                                }
                            />
                            <Input
                                label="Gelar Belakang"
                                value={form.gelar_belakang}
                                onChange={(e: any) =>
                                    update("gelar_belakang", e.target.value)
                                }
                            />
                            <Input
                                label="Jenjang"
                                value={form.jenjang}
                                onChange={(e: any) =>
                                    update("jenjang", e.target.value)
                                }
                            />
                            <Input
                                label="Prodi"
                                value={form.prodi}
                                onChange={(e: any) =>
                                    update("prodi", e.target.value)
                                }
                            />
                            <Input
                                label="Sertifikasi"
                                value={form.sertifikasi}
                                onChange={(e: any) =>
                                    update("sertifikasi", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Tugas & Jam">
                        <Grid>
                            <Input
                                type="date"
                                label="TMT Kerja"
                                value={form.tmt_kerja}
                                onChange={(e: any) =>
                                    update("tmt_kerja", e.target.value)
                                }
                            />
                            <Input
                                label="Tugas Tambahan"
                                value={form.tugas_tambahan}
                                onChange={(e: any) =>
                                    update("tugas_tambahan", e.target.value)
                                }
                            />
                            <Input
                                label="Mengajar"
                                value={form.mengajar}
                                onChange={(e: any) =>
                                    update("mengajar", e.target.value)
                                }
                            />
                            <Input
                                label="Jam Tugas Tambahan"
                                value={form.jam_tugas_tambahan}
                                onChange={(e: any) =>
                                    update("jam_tugas_tambahan", e.target.value)
                                }
                            />
                            <Input
                                label="JJM"
                                value={form.jjm}
                                onChange={(e: any) => update("jjm", e.target.value)}
                            />
                            <Input
                                label="Total JJM"
                                value={form.total_jjm}
                                onChange={(e: any) =>
                                    update("total_jjm", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>

                    <Section title="Kompetensi">
                        <Textarea
                            label="Kompetensi"
                            value={form.kompetensi}
                            onChange={(e: any) =>
                                update("kompetensi", e.target.value)
                            }
                        />
                    </Section>

                    <div className="flex justify-end gap-4 pb-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-200 rounded-lg"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2 bg-sky-600 text-white rounded"
                        >
                            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </div>
            </div>
            
             <ConfirmDialog
                open={confirmSaveOpen}
                onClose={() => setConfirmSaveOpen(false)}
                onConfirm={handleConfirmSave}
                title={"Simpan Perubahan?"}
                message="Pastikan data yang dimasukkan sudah benar."
                confirmText={"Ya, Simpan"}
                cancelText="Batal"
                variant="primary" 
            />

            <Toast open={toast.open} message={toast.message} type={toast.type} />
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
