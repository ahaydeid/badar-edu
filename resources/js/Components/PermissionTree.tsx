import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { panelMenu, MenuItem } from "@/Menus/menus";

type Permission = { id: number; name: string };

type Props = {
    allPermissions: Permission[];
    selectedIds: number[];
    onToggleIds: (ids: number[], checked: boolean) => void;
};

const formatPermissionLabel = (fullPermission: string, prefix: string) => {
    let suffix = fullPermission.replace(prefix, "");
    suffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
    
    const map: Record<string, string> = {
        "View": "Lihat", "Index": "Lihat", "Show": "Detail",
        "Create": "Buat", "Store": "Simpan", "Edit": "Ubah",
        "Update": "Perbarui", "Delete": "Hapus", "Destroy": "Hapus",
        "Manage": "Kelola", "Run": "Jalankan", "Slip": "Slip Gaji"
    };
    return map[suffix] || suffix;
};

const getAllPermissionIdsInNode = (
    item: MenuItem, 
    allPermissions: Permission[],
    claimedPermissions: Set<string>
): number[] => {
    let ids: number[] = [];
    
    // 1. Collect permissions from this node
    if (item.permission) {
        const parts = item.permission.split('.');
        const prefix = parts.slice(0, parts.length - 1).join('.') + '.';
        
        const related = allPermissions
            .filter(p => {
                if (!p.name.startsWith(prefix)) return false;
                // Skip if this permission is claimed by a child menu item
                if (p.name !== item.permission && claimedPermissions.has(p.name)) {
                    return false;
                }
                return true;
            })
            .map(p => p.id);
            
        if (related.length === 0) {
            const exact = allPermissions.find(p => p.name === item.permission);
            if (exact) ids.push(exact.id);
        } else {
            ids = [...ids, ...related];
        }
    }

    // 2. Recursively collect from children
    if (item.children) {
        item.children.forEach((child) => {
            const childIds = getAllPermissionIdsInNode(child, allPermissions, claimedPermissions);
            ids = [...ids, ...childIds];
        });
    }
    
    return [...new Set(ids)]; // Remove duplicates
};

export default function PermissionTree({ allPermissions, selectedIds, onToggleIds }: Props) {
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

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

    const toggleExpand = (label: string) => {
        setExpandedNodes((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    };

    const handleParentToggle = (item: MenuItem) => {
        const nodeIds = getAllPermissionIdsInNode(item, allPermissions, claimedPermissions);
        if (nodeIds.length === 0) return;
        const allSelected = nodeIds.every((id) => selectedIds.includes(id));
        onToggleIds(nodeIds, !allSelected);
    };
    
    const handleIndividualToggle = (id: number) => {
        const isSelected = selectedIds.includes(id);
        onToggleIds([id], !isSelected);
    };

    const PermissionNode = ({ item, level = 0 }: { item: MenuItem; level?: number }) => {
        let relatedPermissions: Permission[] = [];
        let prefix = "";

        if (item.permission) {
            const parts = item.permission.split('.');
            prefix = parts.slice(0, parts.length - 1).join('.') + '.';
            
            relatedPermissions = allPermissions.filter(p => {
                if (!p.name.startsWith(prefix)) return false;
                // Skip if this permission is claimed by a child menu item
                if (p.name !== item.permission && claimedPermissions.has(p.name)) return false;
                return true;
            });
            
            if (relatedPermissions.length === 0) {
                const exact = allPermissions.find(p => p.name === item.permission);
                if (exact) relatedPermissions = [exact];
            }
        }

        const allNodeIds = getAllPermissionIdsInNode(item, allPermissions, claimedPermissions);
        const selectedCount = allNodeIds.filter(id => selectedIds.includes(id)).length;
        const isAllSelected = selectedCount === allNodeIds.length && allNodeIds.length > 0;
        const isIndeterminate = selectedCount > 0 && selectedCount < allNodeIds.length;

        const label = item.name || item.section || "Menu";
        const hasChildren = !!item.children && item.children.length > 0;
        const isExpanded = expandedNodes.includes(label);
        const ExpandIcon = isExpanded ? ChevronDown : ChevronRight;

        // Don't show checkbox if no permissions
        const hasPermissions = allNodeIds.length > 0;

        return (
            <div className="select-none mb-1">
                <div
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors border border-transparent
                    ${level === 0 ? "bg-white border-gray-100 mb-2" : "hover:bg-gray-50"}
                    `}
                    style={{ marginLeft: `${level * 24}px` }}
                >
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

                    {hasPermissions && (
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
                    )}

                    <div 
                        className={`flex-1 cursor-pointer font-medium ${level === 0 ? 'text-gray-800' : 'text-gray-700 text-sm'}`}
                        onClick={() => toggleExpand(label)}
                    >
                        {label}
                    </div>
                </div>

                {isExpanded && (
                    <div className="relative">
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
                                    );
                                })}
                            </div>
                        )}

                        {hasChildren && item.children!.map((child, idx) => (
                            <PermissionNode key={`${child.name}-${idx}`} item={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {panelMenu.map((item, index) => {
                if (item.section) {
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
                return <PermissionNode key={`root-${index}`} item={item} />;
            })}
        </>
    );
}
