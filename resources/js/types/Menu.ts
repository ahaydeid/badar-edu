import type { LucideIcon } from "lucide-react";

export type MenuItem = {
    section?: string; // Judul section
    name?: string; // Optional karena section tidak punya name
    icon?: LucideIcon;
    path?: string; // Optional karena section tidak punya path
    permission?: string;
    children?: MenuItem[];
};
