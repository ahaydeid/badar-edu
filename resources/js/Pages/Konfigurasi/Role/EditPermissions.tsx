import { useState, useMemo } from "react";
import ConfirmDialog from "@/Components/ui/ConfirmDialog";
import Toast from "@/Components/ui/Toast";
import { ArrowLeft, ChevronDown, ChevronRight, Check } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { panelMenu, MenuItem } from "@/Menus/menus";

type Permission = { id: number; name: string };

type Props = {
    role: { id: number; name: string };
    allPermissions: Permission[];
    rolePermissions: Permission[];
};

// Helper: Ubah "pengumuman.view" -> "View", "pengumuman.manage" -> "Manage"
const formatPermissionLabel = (fullPermission: string, prefix: string) => {
    // Remove prefix (e.g. "pengumuman.")
    let suffix = fullPermission.replace(prefix, "");
    
    // Capitalize first letter
    suffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
    
    // Translation map
    const map: Record<string, string> = {
        "View": "Lihat",
        "Index": "Lihat",
        "Show": "Detail",
        "Create": "Buat",
        "Store": "Simpan",
        "Edit": "Ubah",
        "Update": "Perbarui",
        "Delete": "Hapus",
        "Destroy": "Hapus",
        "Manage": "Kelola",
        "Run": "Jalankan",
        "Slip": "Slip Gaji"
    };

    return map[suffix] || suffix;
};

// Helper untuk recursive scan menu items
const getAllPermissionIdsInNode = (
    item: MenuItem, 
    allPermissions: Permission[],
    claimedPermissions: Set<string>
): number[] => {
    let ids: number[] = [];
    
    // 1. Cari permissions yang "match" dengan item ini
    if (item.permission) {
        let prefix = "";
        const parts = item.permission.split('.');
        prefix = parts.slice(0, parts.length - 1).join('.') + '.';
        
        // Cari semua permission di DB yang startWith prefix ini
        const related = allPermissions
            .filter(p => {
                if (!p.name.startsWith(prefix)) return false;
                // JIKA permission ini diklaim oleh menu item LAIN (dan bukan item ini sendiri), skip
                if (p.name !== item.permission && claimedPermissions.has(p.name)) {
                    return false;
                }
                return true;
            })
            .map(p => p.id);
            
         // Fallback exact match jika logic prefix gagal (misal no dots)
         if (related.length === 0) {
            const exact = allPermissions.find(p => p.name === item.permission);
            if (exact) ids.push(exact.id);
         } else {
             ids = [...ids, ...related];
         }
    }

    // 2. Recursive ke children
    if (item.children) {
        item.children.forEach((child) => {
            ids = [...ids, ...getAllPermissionIdsInNode(child, allPermissions, claimedPermissions)];
        });
    }
    
    return ids;
};



export default function EditPermissions({
    role,
    allPermissions,
    rolePermissions,
}: Props) {
    // Initial state dari DB
    const initialIds = useMemo(() => rolePermissions.map((p) => p.id), [rolePermissions]);

    // Build Set of Permissions that are explicitly assigned in the Menu
    // We use this to prevent "Parent" menu from stealing "Child" menu's permissions via aggressive prefix matching.
    const claimedPermissions = useMemo(() => {
        const claims = new Set<string>();
        const traverse = (items: MenuItem[]) => {
            items.forEach(item => {
                if (item.permission) claims.add(item.permission);
                if (item.children) traverse(item.children);
            });
        };
        traverse(panelMenu);
        return claims;
    }, []);

    const form = useForm<{ permissions: number[] }>({
        permissions: [],
    });

    const [selectedIds, setSelectedIds] = useState<number[]>(initialIds);
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const toggleExpand = (label: string) => {
        setExpandedNodes((prev) =>
            prev.includes(label)
                ? prev.filter((l) => l !== label)
                : [...prev, label]
        );
    };

    const handleToggleIds = (ids: number[], checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => {
                const unique = new Set([...prev, ...ids]);
                return Array.from(unique);
            });
        } else {
            setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
        }
    };

    const handleParentToggle = (item: MenuItem) => {
        const nodeIds = getAllPermissionIdsInNode(item, allPermissions, claimedPermissions);
        if (nodeIds.length === 0) return;

        const allSelected = nodeIds.every((id) => selectedIds.includes(id));
        handleToggleIds(nodeIds, !allSelected);
    };
    
    const handleIndividualToggle = (id: number) => {
        const isSelected = selectedIds.includes(id);
        handleToggleIds([id], !isSelected);
    };

    // Recursive Component
    const PermissionNode = ({ item, level = 0 }: { item: MenuItem; level?: number }) => {
        // 1. Identifikasi Related Permissions untuk Item ini
        let relatedPermissions: Permission[] = [];
        let prefix = "";

        if (item.permission) {
             const parts = item.permission.split('.');
             prefix = parts.slice(0, parts.length - 1).join('.') + '.';
             
             // Filter: Start with prefix AND (Is Self OR Not Claimed by others)
             relatedPermissions = allPermissions.filter(p => {
                 if (!p.name.startsWith(prefix)) return false;
                 // JIKA permission ini diklaim oleh menu item LAIN (dan bukan item ini sendiri), skip
                 if (p.name !== item.permission && claimedPermissions.has(p.name)) return false;
                 return true;
             });
             
             // Fallback
             if (relatedPermissions.length === 0) {
                 const exact = allPermissions.find(p => p.name === item.permission);
                 if (exact) relatedPermissions = [exact];
             }
        }

        // 2. Hitung statistik untuk checkbox Parent (Folder)
        const allNodeIds = getAllPermissionIdsInNode(item, allPermissions, claimedPermissions);
        
        const selectedCount = allNodeIds.filter(id => selectedIds.includes(id)).length;
        const isAllSelected = selectedCount === allNodeIds.length && allNodeIds.length > 0;
        const isIndeterminate = selectedCount > 0 && selectedCount < allNodeIds.length;

        const label = item.name || item.section || "Menu";
        const hasChildren = !!item.children && item.children.length > 0;
        
        const isExpanded = expandedNodes.includes(label);
        const ExpandIcon = isExpanded ? ChevronDown : ChevronRight;

        return (
            <div className="select-none mb-1">
                {/* ROW UTAMA: MENU LABEL & FOLDER CHECKBOX */}
                <div
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors border border-transparent
                    ${level === 0 ? "bg-white border-gray-100 mb-2" : "hover:bg-gray-50"}
                    `}
                    style={{ marginLeft: `${level * 24}px` }}
                >
                     {/* Expander */}
                     {hasChildren || relatedPermissions.length > 0 ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(label);
                            }}
                            className="p-1 text-gray-400 hover:text-purple-600 rounded hover:bg-purple-50 transition"
                        >
                            <ExpandIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="w-6" /> 
                    )}

                    {/* Checkbox Folder (Select All for this branch) */}
                    <div
                        onClick={() => handleParentToggle(item)}
                        className={`
                            relative w-5 h-5 flex items-center justify-center border rounded-md cursor-pointer transition-all
                            ${
                                isAllSelected
                                    ? "bg-purple-600 border-purple-600 text-white"
                                    : isIndeterminate
                                    ? "bg-purple-100 border-purple-600"
                                    : "bg-white border-gray-300 hover:border-purple-400"
                            }
                        `}
                    >
                        {isAllSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        {isIndeterminate && (
                            <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />
                        )}
                    </div>

                     {/* Label Menu */}
                     <div 
                        className={`flex-1 cursor-pointer font-medium ${level === 0 ? 'text-gray-800' : 'text-gray-700 text-sm'}`}
                        onClick={() => {
                             toggleExpand(label);
                        }}
                    >
                        {label}
                    </div>
                </div>

                {/* AREA ANAK: SPECIFIC PERMISSIONS & SUBMENUS */}
                {isExpanded && (
                    <div className="relative">
                        
                        {/* 1. LIST SPECIFIC PERMISSIONS (View, Manage, etc) */}
                        {relatedPermissions.length > 0 && (
                            <div className="flex flex-col gap-2 my-2" style={{ marginLeft: `${(level * 24) + 44}px` }}>
                                {relatedPermissions.map(p => {
                                    const checked = selectedIds.includes(p.id);
                                    const niceLabel = formatPermissionLabel(p.name, prefix);
                                    
                                    return (
                                        <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={checked}
                                                    onChange={() => handleIndividualToggle(p.id)}
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:border-purple-600 checked:bg-purple-600 transition-all hover:border-purple-400"
                                                />
                                                 <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                                            </div>
                                            <span className={`text-sm ${checked ? 'text-purple-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                {niceLabel} <span className="text-xs text-gray-300 font-normal ml-1">({p.name})</span>
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        )}

                        {/* 2. SUBMENUS */}
                        {hasChildren && item.children!.map((child, idx) => (
                             <PermissionNode 
                                key={`${child.name}-${idx}`} 
                                item={child} 
                                level={level + 1} 
                             />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleConfirmSave = () => {
        form.transform((data) => ({
            ...data,
            permissions: selectedIds,
        }));

        form.post(`/konfigurasi/role/${role.id}/permissions`, {
            onSuccess: () => {
                setConfirmOpen(false);
                setToastOpen(true);
                setTimeout(() => setToastOpen(false), 2000);
            },
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] px-6 pb-6 gap-4 max-w-4xl mx-auto w-full">
            <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex mb-2 cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900 self-start"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Hak Akses Role
                    </h1>
                     <p className="text-gray-500 text-sm mt-1">
                        Atur permission untuk role <span className="font-semibold text-gray-800 bg-gray-200 px-2 py-0.5 rounded">{role.name}</span>
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-white border border-gray-200 px-4 py-2 rounded">
                    <div className="text-sm font-medium text-gray-600">Terpilih:</div>
                    <div className="text-lg font-bold text-sky-700">{selectedIds.length} <span className="text-xs font-normal text-gray-400">items</span></div>
                </div>
            </div>

            {/* TREE CONTAINER */}
            <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded p-6">
                {panelMenu.map((item, index) => {
                    // Jika section (group besar), render sebagai judul
                    if (item.section) {
                         // Hanya render section jika ada isinya
                        if (!item.children || item.children.length === 0) return null;

                        return (
                            <div key={`section-${index}`} className="mb-8 last:mb-0">
                                {item.section && (
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                        {item.section}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {item.children?.map((child, cIdx) => (
                                        <PermissionNode key={`root-${cIdx}`} item={child} />
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    // Item tanpa section (root level langsung)
                    return <PermissionNode key={`root-${index}`} item={item} />;
                })}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-2">
                <button
                    onClick={() => window.history.back()}
                    className="px-5 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                >
                    Batal
                </button>

                <button
                    onClick={() => setConfirmOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-sky-600 text-white text-sm hover:bg-sky-700 font-semibold shadow shadow-purple-200 hover:shadow-lg transition-all"
                >
                    Simpan Perubahan
                </button>
            </div>

            {/* CONFIRM */}
            <ConfirmDialog
                open={confirmOpen}
                message={`Anda akan menyimpan ${selectedIds.length} permission untuk role ${role.name}. Lanjutkan?`}
                confirmText="Ya, Simpan"
                loading={form.processing}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmSave}
            />

            {/* TOAST */}
            <Toast
                open={toastOpen}
                message="Hak akses berhasil diperbarui!"
                type="success"
            />
        </div>
    );
}
