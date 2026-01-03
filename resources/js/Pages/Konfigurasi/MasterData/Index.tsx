import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Lock, LockOpen, Users } from "lucide-react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";

type ConfigItem = {
    key: string;
    can_edit: boolean;
    description: string;
};

export default function Index() {
    const { guruConfig, siswaConfig } = usePage<any>().props;

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [newValue, setNewValue] = useState<boolean | null>(null);
    const [toast, setToast] = useState({ open: false, message: "", type: "success" as "success" | "error" });
    const [submitting, setSubmitting] = useState(false);

    function handleToggle(key: string, currentValue: boolean) {
        setActiveKey(key);
        setNewValue(!currentValue);
        setConfirmOpen(true);
    }

    function handleConfirm() {
        if (!activeKey || newValue === null) return;
        
        setSubmitting(true);
        router.post(
            `/konfigurasi/master-data/${activeKey}`,
            { can_edit: newValue },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmOpen(false);
                    setToast({
                        open: true,
                        message: "Konfigurasi berhasil diperbarui",
                        type: "success",
                    });
                    setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
                },
                onError: () => {
                    setToast({
                        open: true,
                        message: "Gagal memperbarui konfigurasi",
                        type: "error",
                    });
                    setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
                },
                onFinish: () => setSubmitting(false),
            }
        );
    }

    function getActiveConfig() {
        if (activeKey === 'guru_pegawai') return guruConfig;
        if (activeKey === 'siswa') return siswaConfig;
        return null;
    }

    const configs = [
        { 
            config: guruConfig, 
            icon: Users, 
            title: "Data Guru & Pegawai",
        },
        { 
            config: siswaConfig, 
            icon: Users, 
            title: "Data Siswa",
        },
    ];

    return (
        <div className="w-full space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Konfigurasi Master Data
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Atur izin pengeditan data master oleh pemilik data
                </p>
            </div>

            <div className="space-y-4">
                {configs.map(({ config, icon: Icon, title }) => (
                    <div 
                        key={config.key}
                        className="bg-white rounded-lg border border-gray-200 p-5"
                    >
                        <div className="flex items-center justify-between">
                            {/* Left: Icon + Title + Status */}
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-gray-100 rounded-lg">
                                    <Icon className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <h2 className="font-medium text-gray-800">
                                        {title}
                                    </h2>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        {config.can_edit ? (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                <span className="text-sm text-emerald-600 font-medium">
                                                    Dapat Diedit
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                <span className="text-sm text-gray-500 font-medium">
                                                    Dikunci
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Toggle Button */}
                            <button
                                onClick={() => handleToggle(config.key, config.can_edit)}
                                className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                                    config.can_edit
                                        ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        : "bg-gray-800 text-white hover:bg-gray-900"
                                }`}
                            >
                                {config.can_edit ? (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Kunci
                                    </>
                                ) : (
                                    <>
                                        <LockOpen className="w-4 h-4" />
                                        Buka Kunci
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Section */}
            <div className="text-sm text-gray-500 border-l-2 border-gray-200 pl-4">
                <p>Jika dikunci, pemilik data tidak dapat mengedit data mereka sendiri.</p>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                title={newValue ? "Buka Kunci Pengeditan?" : "Kunci Pengeditan?"}
                message={
                    newValue
                        ? `Izinkan pengeditan ${getActiveConfig()?.key === 'guru_pegawai' ? 'data guru & pegawai' : 'data siswa'}?`
                        : `Kunci pengeditan ${getActiveConfig()?.key === 'guru_pegawai' ? 'data guru & pegawai' : 'data siswa'}?`
                }
                confirmText={newValue ? "Ya, Buka" : "Ya, Kunci"}
                cancelText="Batal"
                variant={newValue ? undefined : "danger"}
                loading={submitting}
            />

            <Toast
                open={toast.open}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
}
