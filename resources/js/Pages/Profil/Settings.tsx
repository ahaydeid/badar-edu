import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { User, Key, ArrowLeft } from "lucide-react";
import UpdateProfileGuru from "./components/UpdateProfileGuru";
import UpdatePasswordModal from "./components/UpdatePasswordModal";

export default function Settings({ user, guru, canEdit }: { user: any, guru: any, canEdit: boolean }) {
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);

    return (
        <>
            <Head title="Pengaturan Profil" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/profile" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h2>
                        <p className="text-gray-500">Kelola informasi profil dan keamanan akun anda</p>
                    </div>
                </div>

                {!canEdit && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm rounded-lg mb-6">
                        Pengeditan data profil saat ini sedang ditutup oleh administrator.
                    </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Card 1: Perbarui Data */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-800">
                                <User className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Perbarui Data Diri</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Update informasi pribadi, data kepegawaian, dan foto profil anda.
                            </p>
                            <button 
                                onClick={() => setUpdateModalOpen(true)}
                                disabled={!canEdit}
                                className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Edit Data Guru
                            </button>
                        </div>
                    </div>

                        {/* Card 2: Ubah Kata Sandi */}
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-600">
                                <Key className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ubah Kata Sandi</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Amankan akun anda dengan memperbarui kata sandi secara berkala.
                            </p>
                            <button 
                                onClick={() => setPasswordModalOpen(true)}
                                className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                Ubah Kata Sandi
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            <UpdateProfileGuru 
                open={updateModalOpen} 
                onClose={() => setUpdateModalOpen(false)}
                initialData={guru}
            />

            <UpdatePasswordModal
                open={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />
        </>
    );
}
