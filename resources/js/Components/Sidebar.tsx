import {
    ChevronDown,
    ChevronRight,
    ChevronsLeftIcon,
    Menu,
    X,
} from "lucide-react";
import { panelMenu } from "@/Menus/menus";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import type { MenuItem } from "@/types/Menu";

export default function Sidebar({ isOpen, onToggle }) {
    const { url } = usePage();
    const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

    const permissions: string[] = [];

    const hasPermission = (permission?: string) => {
        if (!permission) return true;
        if (!permissions || permissions.length === 0) return true;
        return permissions.includes(permission);
    };

    const filterMenuByPermission = (items: MenuItem[]): MenuItem[] =>
        items
            .map((item) => {
                const hasChildren = !!item.children?.length;

                if (hasChildren) {
                    const filteredChildren = filterMenuByPermission(
                        item.children!
                    );
                    const allowedSelf = hasPermission(item.permission);
                    const allowedByChildren = filteredChildren.length > 0;

                    if (!allowedSelf && !allowedByChildren) return null;

                    return { ...item, children: filteredChildren };
                }

                if (!hasPermission(item.permission)) return null;
                return item;
            })
            .filter(Boolean) as MenuItem[];

    const filteredMenu = filterMenuByPermission(panelMenu);

    const toggleDropdown = (key: string) =>
        setOpenDropdowns((prev) =>
            prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
        );

    const isDropdownOpen = (key: string) => openDropdowns.includes(key);

    const isActive = (path: string) =>
        url === path || url.startsWith(path + "/");

    const renderMenu = (items: MenuItem[], level = 1) =>
        items.map((item) => {
            const hasChildren = !!item.children?.length;
            const path = item.path ?? "";
            const key =
                path ||
                item.name ||
                item.section ||
                `menu-${level}-${Math.random().toString(36).slice(2)}`;
            const open = isDropdownOpen(path);

            // SECTION
            if (item.section && item.section.trim() !== "") {
                return (
                    <div key={`section-${item.section}`}>
                        {isOpen && (
                            <div className="px-3 pt-5 pb-1 text-xs tracking-wide text-gray-400 uppercase">
                                {item.section}
                            </div>
                        )}
                        {item.children && renderMenu(item.children, level)}
                    </div>
                );
            }

            // item tanpa name/path
            if (!item.name && !item.path && !item.section && hasChildren) {
                return (
                    <div
                        key={`group-${level}-${Math.random()
                            .toString(36)
                            .slice(2)}`}
                    >
                        {renderMenu(item.children!, level)}
                    </div>
                );
            }

            const active = path ? isActive(path) : false;
            const Icon = item.icon;
            const padding = level === 1 ? "px-3 py-3" : "pl-10 pr-3 py-2";

            // WRAPPER ICON FIXED → size konsisten
            const renderIcon = Icon ? (
                <div className="size-5 shrink-0 flex items-center justify-center">
                    <Icon
                        className={`size-5 ${item.spin ? "animate-spin" : ""}`}
                    />
                </div>
            ) : null;

            return (
                <div key={key}>
                    {hasChildren ? (
                        <>
                            <button
                                onClick={() => toggleDropdown(path)}
                                className={`flex items-center gap-3 w-full ${padding} text-sm transition
                                    ${
                                        isOpen
                                            ? "justify-start"
                                            : "justify-center"
                                    }
                                    ${
                                        active
                                            ? "bg-sky-600 text-white font-semibold"
                                            : "text-gray-700 hover:bg-sky-50"
                                    }`}
                            >
                                {renderIcon}

                                {isOpen && (
                                    <div className="flex justify-between items-center w-full">
                                        <span>{item.name}</span>
                                        {open ? (
                                            <ChevronDown className="w-4 h-4 shrink-0" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 shrink-0" />
                                        )}
                                    </div>
                                )}
                            </button>

                            {open && isOpen && (
                                <div className="ml-4">
                                    {renderMenu(item.children!, level + 1)}
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            href={path || "#"}
                            className={`flex items-center gap-3 w-full ${padding} text-sm transition
                                ${isOpen ? "justify-start" : "justify-center"}
                                ${
                                    active
                                        ? "bg-sky-600 text-white font-semibold"
                                        : "text-gray-700 hover:bg-sky-50"
                                }`}
                        >
                            {renderIcon}
                            {isOpen && <span>{item.name}</span>}
                        </Link>
                    )}
                </div>
            );
        });

    return (
        <aside
            className={`${
                isOpen ? "w-65" : "w-16"
            } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed top-0 left-0 h-screen z-30`}
        >
            <div className="flex items-center justify-between px-4 h-14 sticky top-0 bg-white">
                {isOpen && (
                    <h1 className="font-bold text-lg">
                        Badar <span className="text-purple-500">Edu</span>
                    </h1>
                )}
                <button
                    onClick={onToggle}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    {isOpen ? <ChevronsLeftIcon /> : <Menu />}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
                {renderMenu(filteredMenu)}
            </nav>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
                <h3 className="text-xs text-gray-400">
                    Created by{" "}
                    <a
                        href="https://ahadi.my.id/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                    >
                        Hadi
                    </a>
                </h3>
            </div>
        </aside>
    );
}
