import "../css/app.css";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import AppLayout from "@/Layouts/AppLayout";

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
        const page: any = pages[`./Pages/${name}.tsx`];

        page.default.layout ??= (page: any) => <AppLayout>{page}</AppLayout>;

        return page;
    },
    setup({ el, App, props }: { el: HTMLElement; App: any; props: any }) {
        createRoot(el).render(<App {...props} />);
    },
});
