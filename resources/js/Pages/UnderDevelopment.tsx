import AppLayout from "@/Layouts/AppLayout";

export default function UnderDevelopment() {
    return (
        <div className="flex items-center bg-white justify-center min-h-[85vh] px-6">
            <div className="text-center">
                <img
                    src="/img/underdev.gif"
                    alt="Under development"
                    className="mx-auto object-contain w-100"
                />

                <h1 className="text-xl font-semibold mt-4 text-gray-600">
                    Under Development
                </h1>
            </div>
        </div>
    );
}

UnderDevelopment.layout = (page) => <AppLayout children={page} />;
