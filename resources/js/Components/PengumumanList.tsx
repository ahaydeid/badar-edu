import { useState } from "react";

type Pengumuman = {
    id: number;
    judul: string;
    isi: string;
    tanggal_mulai: string;
    is_active: boolean;
};

function truncateWords(text: string, limit = 12) {
    const words = text.split(" ");
    return words.length > limit ? words.slice(0, limit).join(" ") + "…" : text;
}

function formatDateShort(dateString: string) {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("id-ID", { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

interface Props {
    items: Pengumuman[];
    onSelect: (item: Pengumuman) => void;
}

export default function PengumumanList({ items, onSelect }: Props) {
    const [showAll, setShowAll] = useState(false);

    if (items.length === 0) {
        return (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
                Tidak ada pengumuman.
            </div>
        );
    }

    const sortedItems = [...items].sort((a, b) => {
        if (a.is_active !== b.is_active) {
            return a.is_active ? -1 : 1;
        }

        return (
            new Date(b.tanggal_mulai).getTime() -
            new Date(a.tanggal_mulai).getTime()
        );
    });

    const visibleItems = showAll ? sortedItems : sortedItems.slice(0, 3);
    const hasMore = sortedItems.length > 3;

    return (
        <div>
            {visibleItems.map((p) => (
                <button
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className="relative w-full text-left px-4 py-3 hover:bg-sky-50 border-b border-gray-200 last:border-0"
                >
                    {/* indikator status aktif */}
                    <span
                        className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
                            p.is_active ? "bg-green-500" : "bg-gray-300"
                        }`}
                        title={p.is_active ? "Aktif" : "Tidak aktif"}
                    />

                    <div className="font-medium text-gray-800 pr-4">
                        {p.judul}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {truncateWords(p.isi)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {formatDateShort(p.tanggal_mulai)}
                    </div>
                </button>
            ))}

            {/* tombol tampilkan lainnya */}
            {hasMore && (
                <button
                    onClick={() => setShowAll((v) => !v)}
                    className="w-full text-center py-2 text-sm text-gray-600 hover:bg-sky-50 border-t border-gray-200"
                >
                    {showAll ? "Sembunyikan" : "Tampilkan lainnya"}
                </button>
            )}
        </div>
    );
}
