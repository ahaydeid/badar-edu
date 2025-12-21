import { useEffect } from "react";
import { router } from "@inertiajs/react";

export default function Home() {
    useEffect(() => {
        router.visit("/dashboard");
    }, []);

    return null;
}
