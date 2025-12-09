import { MenuItem } from "./Menu";

export interface AuthProps {
    user: any;
    menus: MenuItem[];
}

declare module "@inertiajs/core" {
    interface PageProps {
        auth: AuthProps;
    }
}
