import type { LucideIcon } from "lucide-react";

export type MenuItem = {
    section?: string;
    name?: string;
    icon?: LucideIcon;
    path?: string;
    permission?: string;
    children?: MenuItem[];
    spin?: boolean;
    live?: boolean;
};
