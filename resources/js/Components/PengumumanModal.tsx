import ModalPortal from "./ModalPortal";

type Pengumuman = {
    id: number;
    judul: string;
    isi: string;
    tanggal_mulai: string;
    gambar?: string;
};

function formatDateShort(dateString: string) {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("id-ID", { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

interface Props {
    open: boolean;
    data: Pengumuman | null;
    onClose: () => void;
}

export default function PengumumanModal({ open, data, onClose }: Props) {
    if (!open || !data) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
                <div className="bg-white w-full max-w-lg rounded shadow-lg">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">
                            {data.judul}
                        </h3>
                    </div>

                    <div className="px-4 py-4 space-y-3 text-sm text-gray-700">
                        <div className="text-xs text-gray-400">
                            {formatDateShort(data.tanggal_mulai)}
                        </div>
                        {data.gambar && (
                            <img 
                                src={`/storage/${data.gambar}`} 
                                alt={data.judul}
                                className="w-full h-auto max-h-[500px] object-contain rounded border border-gray-100 bg-gray-50"
                            />
                        )}
                        <p className="whitespace-pre-line">{data.isi}</p>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-200 text-right">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
