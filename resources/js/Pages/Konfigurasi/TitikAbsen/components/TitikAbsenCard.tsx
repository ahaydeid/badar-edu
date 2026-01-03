import { 
    MapPin, 
    Pencil, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    Navigation,
} from "lucide-react";

interface Location {
    id: number;
    nama: string;
    latitude: number;
    longitude: number;
    radius: number;
    is_active: boolean;
}

interface Props {
    loc: Location;
    onEdit: (loc: Location) => void;
    onDelete: (id: number) => void;
}

export default function TitikAbsenCard({ loc, onEdit, onDelete }: Props) {
    return (
        <div className="bg-white rounded-lg border border-slate-100 overflow-hidden hover:shadow-sm hover:border-sky-100 transition-all group">
            <div className="h-40 bg-slate-100 relative">
                <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}&hl=id;z=16&output=embed`}
                    className="grayscale-[0.5] group-hover:grayscale-0 transition-all"
                ></iframe>
                <div className="absolute top-3 right-3">
                    {loc.is_active ? (
                        <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 backdrop-blur-sm">
                            <CheckCircle2 className="w-3 h-3" /> Aktif
                        </span>
                    ) : (
                        <span className="bg-slate-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 backdrop-blur-sm">
                            <XCircle className="w-3 h-3" /> Nonaktif
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">{loc.nama}</h3>
                <div className="space-y-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-sky-500" />
                        {loc.latitude}, {loc.longitude}
                    </p>
                    <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-sky-500" />
                        Radius: <span className="font-bold text-slate-700">{loc.radius} meter</span>
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => onEdit(loc)}
                        className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-sm font-semibold transition-colors flex justify-center items-center gap-2 border border-slate-100 cursor-pointer"
                    >
                        <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                        onClick={() => onDelete(loc.id)}
                        className="px-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-sm font-semibold transition-colors border border-slate-100 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
