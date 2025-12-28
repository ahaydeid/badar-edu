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
        <form
            onSubmit={submit}
            className="w-96 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
            <h1 className="text-lg font-semibold text-gray-900 mb-5">Login</h1>

            <div className="mb-4">
                <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Username"
                    value={data.username}
                    onChange={(e) => setData("username", e.target.value)}
                    autoFocus
                />
                {errors.username && (
                    <div className="text-red-600 text-xs mt-1">
                        {errors.username}
                    </div>
                )}
            </div>

            <div className="mb-5 relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {errors.password && (
                    <div className="text-red-600 text-xs mt-1">
                        {errors.password}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Login
            </button>
        </form>
    );
}

Login.layout = (page: ReactNode) => (
    <GuestLayout title="Login">
        <Head title="Login" />
        {page}
    </GuestLayout>
);

export default Login;
