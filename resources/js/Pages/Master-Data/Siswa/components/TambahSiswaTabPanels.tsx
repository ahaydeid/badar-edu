import { User } from "lucide-react";
import { Grid, Input, Section, Select, Textarea } from "./FormComponents";

type Props = {
    activeTab: number;
    form: any;
    preview: string | null;
    rombelList: { id: number; nama: string }[];
    editId?: number | null;
    initialData?: any;

    update: (key: any, value: any) => void;
    updateWali: (
        jenis: "ayah" | "ibu" | "wali",
        key: any,
        value: string
    ) => void;
    handleFoto: (file: File | null) => void;
};

export default function TambahSiswaTabPanels({
    activeTab,
    form,
    preview,
    rombelList,
    update,
    updateWali,
    handleFoto,
}: Props) {
    // TAB 0: Data Utama (Foto + Data Pribadi)
    if (activeTab === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* FOTO */}
                <div className="md:col-span-1">
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
                </div>

                {/* DATA PRIBADI */}
                <div className="md:col-span-2">
                    <Section title="Data Pribadi Siswa">
                        <Grid>
                            <Input
                                label="Nama Lengkap"
                                value={form.nama}
                                onChange={(e: any) =>
                                    update("nama", e.target.value)
                                }
                            />
                            <Input
                                label="NIPD"
                                value={form.nipd}
                                onChange={(e: any) =>
                                    update("nipd", e.target.value)
                                }
                            />
                            <Input
                                label="NISN"
                                value={form.nisn}
                                onChange={(e: any) =>
                                    update("nisn", e.target.value)
                                }
                            />
                            <Select
                                label="Jenis Kelamin"
                                value={form.jenis_kelamin}
                                onChange={(e: any) =>
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
                            <Input
                                label="NIK"
                                value={form.nik}
                                onChange={(e: any) =>
                                    update("nik", e.target.value)
                                }
                            />
                            <Input
                                label="Agama"
                                value={form.agama}
                                onChange={(e: any) =>
                                    update("agama", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>
                </div>
            </div>
        );
    }

    // TAB 1: Alamat & Lokasi
    if (activeTab === 1) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ALAMAT */}
                <div className="md:col-span-2">
                    <Section title="Alamat Lengkap">
                        <Grid>
                            <Textarea
                                label="Alamat"
                                value={form.alamat}
                                onChange={(e: any) =>
                                    update("alamat", e.target.value)
                                }
                            />
                            <Input
                                label="RT"
                                value={form.rt}
                                onChange={(e: any) =>
                                    update("rt", e.target.value)
                                }
                            />
                            <Input
                                label="RW"
                                value={form.rw}
                                onChange={(e: any) =>
                                    update("rw", e.target.value)
                                }
                            />
                            <Input
                                label="Dusun"
                                value={form.dusun}
                                onChange={(e: any) =>
                                    update("dusun", e.target.value)
                                }
                            />
                            <Input
                                label="Kelurahan"
                                value={form.kelurahan}
                                onChange={(e: any) =>
                                    update("kelurahan", e.target.value)
                                }
                            />
                            <Input
                                label="Kecamatan"
                                value={form.kecamatan}
                                onChange={(e: any) =>
                                    update("kecamatan", e.target.value)
                                }
                            />
                            <Input
                                label="Kode Pos"
                                value={form.kode_pos}
                                onChange={(e: any) =>
                                    update("kode_pos", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>
                </div>

                {/* LOKASI */}
                <div className="md:col-span-1">
                    <Section title="Lokasi">
                        <Grid>
                            <Input
                                label="Lintang"
                                value={form.lintang}
                                onChange={(e: any) =>
                                    update("lintang", e.target.value)
                                }
                            />
                            <Input
                                label="Bujur"
                                value={form.bujur}
                                onChange={(e: any) =>
                                    update("bujur", e.target.value)
                                }
                            />
                            <Input
                                label="Jarak Rumah ke Sekolah (KM)"
                                value={form.jarak_rumah_ke_sekolah_km}
                                onChange={(e: any) =>
                                    update(
                                        "jarak_rumah_ke_sekolah_km",
                                        e.target.value
                                    )
                                }
                            />
                        </Grid>
                    </Section>
                </div>
            </div>
        );
    }

    // TAB 2: Keluarga / Wali
    if (activeTab === 2) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AYAH */}
                <Section title="Data Ayah">
                    <Grid>
                        <Input
                            label="Nama"
                            value={form.wali.ayah.nama}
                            onChange={(e: any) =>
                                updateWali("ayah", "nama", e.target.value)
                            }
                        />
                        <Input
                            label="Tahun Lahir"
                            value={form.wali.ayah.tahun_lahir}
                            onChange={(e: any) =>
                                updateWali(
                                    "ayah",
                                    "tahun_lahir",
                                    e.target.value
                                )
                            }
                        />
                        <Input
                            label="Pendidikan"
                            value={form.wali.ayah.jenjang_pendidikan}
                            onChange={(e: any) =>
                                updateWali(
                                    "ayah",
                                    "jenjang_pendidikan",
                                    e.target.value
                                )
                            }
                        />
                        <Input
                            label="Pekerjaan"
                            value={form.wali.ayah.pekerjaan}
                            onChange={(e: any) =>
                                updateWali("ayah", "pekerjaan", e.target.value)
                            }
                        />
                        <Input
                            label="Penghasilan"
                            value={form.wali.ayah.penghasilan}
                            onChange={(e: any) =>
                                updateWali(
                                    "ayah",
                                    "penghasilan",
                                    e.target.value
                                )
                            }
                        />
                        <Input
                            label="NIK"
                            value={form.wali.ayah.nik}
                            onChange={(e: any) =>
                                updateWali("ayah", "nik", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* IBU */}
                <Section title="Data Ibu">
                    <Grid>
                        <Input
                            label="Nama"
                            value={form.wali.ibu.nama}
                            onChange={(e: any) =>
                                updateWali("ibu", "nama", e.target.value)
                            }
                        />
                        <Input
                            label="Tahun Lahir"
                            value={form.wali.ibu.tahun_lahir}
                            onChange={(e: any) =>
                                updateWali("ibu", "tahun_lahir", e.target.value)
                            }
                        />
                        <Input
                            label="Pendidikan"
                            value={form.wali.ibu.jenjang_pendidikan}
                            onChange={(e: any) =>
                                updateWali(
                                    "ibu",
                                    "jenjang_pendidikan",
                                    e.target.value
                                )
                            }
                        />
                        <Input
                            label="Pekerjaan"
                            value={form.wali.ibu.pekerjaan}
                            onChange={(e: any) =>
                                updateWali("ibu", "pekerjaan", e.target.value)
                            }
                        />
                        <Input
                            label="Penghasilan"
                            value={form.wali.ibu.penghasilan}
                            onChange={(e: any) =>
                                updateWali("ibu", "penghasilan", e.target.value)
                            }
                        />
                        <Input
                            label="NIK"
                            value={form.wali.ibu.nik}
                            onChange={(e: any) =>
                                updateWali("ibu", "nik", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* WALI */}
                <div className="md:col-span-2">
                    <Section title="Data Wali">
                        <Grid>
                            <Input
                                label="Nama"
                                value={form.wali.wali.nama}
                                onChange={(e: any) =>
                                    updateWali("wali", "nama", e.target.value)
                                }
                            />
                            <Input
                                label="Tahun Lahir"
                                value={form.wali.wali.tahun_lahir}
                                onChange={(e: any) =>
                                    updateWali(
                                        "wali",
                                        "tahun_lahir",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="Pendidikan"
                                value={form.wali.wali.jenjang_pendidikan}
                                onChange={(e: any) =>
                                    updateWali(
                                        "wali",
                                        "jenjang_pendidikan",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="Pekerjaan"
                                value={form.wali.wali.pekerjaan}
                                onChange={(e: any) =>
                                    updateWali(
                                        "wali",
                                        "pekerjaan",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="Penghasilan"
                                value={form.wali.wali.penghasilan}
                                onChange={(e: any) =>
                                    updateWali(
                                        "wali",
                                        "penghasilan",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="NIK"
                                value={form.wali.wali.nik}
                                onChange={(e: any) =>
                                    updateWali("wali", "nik", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>
                </div>
            </div>
        );
    }

    // TAB 3: Akademik & Bantuan
    if (activeTab === 3) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* KONTAK & LAINNYA */}
                <Section title="Kontak & Lainnya">
                    <Grid>
                        <Input
                            label="Jenis Tinggal"
                            value={form.jenis_tinggal}
                            onChange={(e: any) =>
                                update("jenis_tinggal", e.target.value)
                            }
                        />
                        <Input
                            label="Alat Transportasi"
                            value={form.alat_transportasi}
                            onChange={(e: any) =>
                                update("alat_transportasi", e.target.value)
                            }
                        />
                        <Input
                            label="Telepon"
                            value={form.telepon}
                            onChange={(e: any) =>
                                update("telepon", e.target.value)
                            }
                        />
                        <Input
                            label="HP"
                            value={form.hp}
                            onChange={(e: any) => update("hp", e.target.value)}
                        />
                        <Input
                            label="Email"
                            value={form.email}
                            onChange={(e: any) =>
                                update("email", e.target.value)
                            }
                        />
                        <Input
                            label="SKHUN"
                            value={form.skhun}
                            onChange={(e: any) =>
                                update("skhun", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* AKADEMIK */}
                <Section title="Akademik">
                    <Grid>
                        <Input
                            label="No Peserta UN"
                            value={form.no_peserta_un}
                            onChange={(e: any) =>
                                update("no_peserta_un", e.target.value)
                            }
                        />
                        <Input
                            label="No Seri Ijazah"
                            value={form.no_seri_ijazah}
                            onChange={(e: any) =>
                                update("no_seri_ijazah", e.target.value)
                            }
                        />
                        <Input
                            label="Sekolah Asal"
                            value={form.sekolah_asal}
                            onChange={(e: any) =>
                                update("sekolah_asal", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* KPS */}
                <Section title="KPS">
                    <Grid>
                        <Select
                            label="Penerima KPS"
                            value={form.penerima_kps}
                            onChange={(e: any) =>
                                update("penerima_kps", e.target.value as any)
                            }
                        >
                            <option value="TIDAK">TIDAK</option>
                            <option value="YA">YA</option>
                        </Select>
                        <Input
                            label="Nomor KPS"
                            value={form.nomor_kps}
                            disabled={form.penerima_kps !== "YA"}
                            onChange={(e: any) =>
                                update("nomor_kps", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* KIP */}
                <Section title="KIP">
                    <Grid>
                        <Select
                            label="Penerima KIP"
                            value={form.penerima_kip}
                            onChange={(e: any) =>
                                update("penerima_kip", e.target.value as any)
                            }
                        >
                            <option value="TIDAK">TIDAK</option>
                            <option value="YA">YA</option>
                        </Select>
                        <Input
                            label="Nomor KIP"
                            value={form.nomor_kip}
                            disabled={form.penerima_kip !== "YA"}
                            onChange={(e: any) =>
                                update("nomor_kip", e.target.value)
                            }
                        />
                        <Input
                            label="Nama di KIP"
                            value={form.nama_di_kip}
                            disabled={form.penerima_kip !== "YA"}
                            onChange={(e: any) =>
                                update("nama_di_kip", e.target.value)
                            }
                        />
                        <Input
                            label="Nomor KKS"
                            value={form.nomor_kks}
                            onChange={(e: any) =>
                                update("nomor_kks", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* PIP */}
                <Section title="PIP">
                    <Grid>
                        <Select
                            label="Layak PIP"
                            value={form.layak_pip}
                            onChange={(e: any) =>
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
                            onChange={(e: any) =>
                                update("alasan_layak_pip", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* ROMBEL */}
                <Section title="Rombel">
                    <Select
                        label="Rombel Saat Ini"
                        value={form.rombel_saat_ini}
                        onChange={(e: any) =>
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
            </div>
        );
    }

    // TAB 4: Kesehatan & Keuangan
    if (activeTab === 4) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IDENTITAS & KELUARGA */}
                <Section title="Identitas & Keluarga">
                    <Grid>
                        <Input
                            label="No KK"
                            value={form.no_kk}
                            onChange={(e: any) =>
                                update("no_kk", e.target.value)
                            }
                        />
                        <Input
                            label="No Registrasi Akta Lahir"
                            value={form.no_registrasi_akta_lahir}
                            onChange={(e: any) =>
                                update(
                                    "no_registrasi_akta_lahir",
                                    e.target.value
                                )
                            }
                        />
                        <Input
                            label="Anak Ke"
                            value={form.anak_ke}
                            onChange={(e: any) =>
                                update("anak_ke", e.target.value)
                            }
                        />
                        <Input
                            label="Jumlah Saudara Kandung"
                            value={form.jumlah_saudara_kandung}
                            onChange={(e: any) =>
                                update("jumlah_saudara_kandung", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* KESEHATAN & FISIK */}
                <Section title="Kesehatan & Fisik">
                    <Grid>
                        <Input
                            label="Kebutuhan Khusus"
                            value={form.kebutuhan_khusus}
                            onChange={(e: any) =>
                                update("kebutuhan_khusus", e.target.value)
                            }
                        />
                        <Input
                            label="Berat Badan"
                            value={form.berat_badan}
                            onChange={(e: any) =>
                                update("berat_badan", e.target.value)
                            }
                        />
                        <Input
                            label="Tinggi Badan"
                            value={form.tinggi_badan}
                            onChange={(e: any) =>
                                update("tinggi_badan", e.target.value)
                            }
                        />
                        <Input
                            label="Lingkar Kepala"
                            value={form.lingkar_kepala}
                            onChange={(e: any) =>
                                update("lingkar_kepala", e.target.value)
                            }
                        />
                    </Grid>
                </Section>

                {/* PERBANKAN */}
                <div className="md:col-span-2">
                    <Section title="Perbankan">
                        <Grid>
                            <Input
                                label="Bank"
                                value={form.bank}
                                onChange={(e: any) =>
                                    update("bank", e.target.value)
                                }
                            />
                            <Input
                                label="Nomor Rekening Bank"
                                value={form.nomor_rekening_bank}
                                onChange={(e: any) =>
                                    update(
                                        "nomor_rekening_bank",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="Rekening Atas Nama"
                                value={form.rekening_atas_nama}
                                onChange={(e: any) =>
                                    update("rekening_atas_nama", e.target.value)
                                }
                            />
                        </Grid>
                    </Section>
                </div>
            </div>
        );
    }

    return null;
}
