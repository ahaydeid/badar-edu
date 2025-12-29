import { useForm, Head } from "@inertiajs/react";
import type { ReactNode, FormEvent } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";

function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    function submit(e: FormEvent) {
        e.preventDefault();
        post("/login");
    }

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-between px-4 py-8">
                <div
                    className="
                    w-full
                    max-w-[880px]
                    bg-white
                    rounded-xl
                    shadow-lg
                    overflow-hidden
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    md:h-[520px]
                "
                >
                    <div
                        className="
                            hidden
                            md:flex
                            items-center
                            justify-center
                            bg-purple-200
                            bg-no-repeat
                            bg-center
                            bg-cover
                        "
                        style={{ backgroundImage: "url('/img/bg-login.webp')" }}
                    />

                    <div className="px-6 md:px-14 flex flex-col justify-center py-10 md:py-0">
                        <h1 className="text-2xl font-semibold text-purple-700 mb-2">
                            <span className="text-gray-700">Badar</span>{" "}
                            Education
                        </h1>
                        <p className="text-sm text-gray-500 mb-8">
                            Selamat Datang di{" "}
                            <span className="font-extrabold">Badu Suites</span>
                        </p>

                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500">
                                    Kode Guru
                                </label>
                                <input
                                    className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-purple-600"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                />
                                {errors.username && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {errors.username}
                                    </div>
                                )}
                            </div>

                            <div className="mb-6 relative">
                                <label className="text-xs text-gray-500">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full border-b border-gray-300 py-2 pr-10 text-sm focus:outline-none focus:border-purple-600"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-2 top-7 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                                {errors.password && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {errors.password}
                                    </div>
                                )}
                                <div className="text-right mt-2">
                                    <a
                                        href="#"
                                        className="text-xs text-purple-600 hover:underline"
                                    >
                                        Lupa password?
                                    </a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full cursor-pointer bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium py-2 rounded-full transition disabled:opacity-50"
                            >
                                Masuk
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-6">
                                Guru Baru?{" "}
                                <a
                                    href="#"
                                    className="text-purple-600 hover:underline"
                                >
                                    Permohonan Akun
                                </a>
                            </p>
                        </form>
                    </div>
                </div>

                <footer className="text-center text-xs text-gray-400 mt-6">
                    Created By{" "}
                    <a
                        href="https://ahadi.my.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 hover:font-bold"
                    >
                        Hadi
                    </a>
                </footer>
            </div>
        </>
    );
}

Login.layout = (page: ReactNode) => (
    <GuestLayout title="Login">
        <Head title="Login" />
        {page}
    </GuestLayout>
);

export default Login;
