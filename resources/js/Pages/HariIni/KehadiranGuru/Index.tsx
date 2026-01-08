import { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import { 
    Search, 
    Calendar, 
    ChevronUp, 
    ChevronDown, 
    UserCheck,
    Clock,
    HelpCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface Stats {
    total: number;
    hadir: number;
    terlambat: number;
    sakit: number;
    izin: number;
    alfa: number;
}

interface GuruData {
    id: number;
    nama: string;
    mapel: string;
    stats: Stats;
}

interface PageProps {
    gurus: GuruData[];
    globalStats: {
        hadir: number;
        terlambat: number;
        sakit: number;
        izin: number;
        alfa: number;
        period: string;
    };
    filters: {
        start_date: string;
        end_date: string;
        search: string;
        jabatan: string;
        sort_by: string;
        sort_order: string;
    };
}

export default function KehadiranGuru({ gurus, globalStats, filters }: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [sortBy, setSortBy] = useState(filters.sort_by);
    const [sortOrder, setSortOrder] = useState(filters.sort_order);

    // Pagination State
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const handleFilter = () => {
        setPage(1); // Reset to first page on filter
        router.get(route('kehadiran-guru.index'), {
            search: searchTerm,
            start_date: startDate,
            end_date: endDate,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (field: string) => {
        const order = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(order);
        
        router.get(route('kehadiran-guru.index'), {
            search: searchTerm,
            start_date: startDate,
            end_date: endDate,
            sort_by: field,
            sort_order: order,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const statsCards = [
        { label: "Hadir", value: globalStats.hadir, icon: UserCheck, color: "bg-emerald-600" },
        { label: "Terlambat", value: globalStats.terlambat, icon: Clock, color: "bg-amber-500" },
        { label: "Sakit", value: globalStats.sakit, icon: HelpCircle, color: "bg-sky-600" },
        { label: "Izin", value: globalStats.izin, icon: Calendar, color: "bg-indigo-600" },
        { label: "Alfa", value: globalStats.alfa, icon: AlertCircle, color: "bg-rose-600" },
    ];

    const formatStat = (val: number) => (val === 0 ? "-" : val);

    // Pagination Logic
    const paginatedGurus = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return gurus.slice(start, start + rowsPerPage);
    }, [gurus, page, rowsPerPage]);

    const totalPages = Math.max(1, Math.ceil(gurus.length / rowsPerPage));

    return (
        <div className="p-6 space-y-6">
            <Head title="Kehadiran Guru" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">KEHADIRAN GURU</h1>
                <div className="bg-gray-100 px-4 py-2 rounded text-xs font-bold text-gray-600 uppercase tracking-widest">
                    Periode: {globalStats.period}
                </div>
            </div>

            {/* Stats Cards - Solid Colors */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statsCards.map((card, idx) => (
                    <div key={idx} className={`${card.color} text-white p-4 rounded shadow-sm relative overflow-hidden group`}>
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-90">{card.label}</div>
                            <div className="text-3xl font-bold">{card.value}%</div>
                        </div>
                        <card.icon className="absolute -right-2 -bottom-2 w-16 h-16 opacity-20 transition-transform group-hover:scale-110" />
                    </div>
                ))}
            </div>

            {/* Filters Row - Solid & Clean */}
            <div className="bg-white p-5 rounded border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1.5 md:col-span-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dari Tanggal</label>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-sky-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sampai Tanggal</label>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-sky-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Urutkan</label>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-sky-500 outline-none"
                        >
                            <option value="nama">Nama Guru</option>
                            <option value="hadir">Paling Hadir</option>
                            <option value="terlambat">Paling Terlambat</option>
                            <option value="sakit">Sakit</option>
                            <option value="izin">Izin</option>
                            <option value="alfa">Alfa</option>
                        </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-1 relative">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cari Nama</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Cari..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-sky-500 outline-none pl-9"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <button 
                            onClick={handleFilter}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-xs h-[38px]"
                        >
                            Terapkan Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Rows Per Page Selector */}
            <div className="flex justify-end">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Tampilkan</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border border-gray-200 px-2 py-1 rounded outline-none text-xs"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-gray-500">Baris</span>
                </div>
            </div>

            {/* Table - Solid Headers & Clean Rows */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse text-sm">
                        <thead className="bg-sky-100 text-gray-700 border-b border-gray-200 uppercase font-bold text-[11px] tracking-widest">
                            <tr>
                                <th className="p-4 border-r border-white whitespace-nowrap text-center w-12 text-gray-500">No</th>
                                <th className="p-4 border-r border-white whitespace-nowrap text-left cursor-pointer hover:bg-sky-200" onClick={() => handleSort('nama')}>
                                    <div className="flex items-center gap-2">
                                        NAMA GURU
                                        {sortBy === 'nama' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </div>
                                </th>
                                <th className="p-4 border-r border-white whitespace-nowrap text-left">MATA PELAJARAN</th>
                                <th className="p-4 border-r border-white whitespace-nowrap text-center">TOTAL</th>
                                <th className="p-4 border-r border-white whitespace-nowrap text-center">HADIR</th>
                                <th className="p-4 border-r border-white whitespace-nowrap text-center">TErLAMBAT</th>
                                <th className="p-4 border-r border-white whitespace-nowrap text-center text-sky-600">SAKIT</th>
                                <th className="p-4 border-r border-white whitespace-nowrap text-center text-indigo-600">IZIN</th>
                                <th className="p-4 whitespace-nowrap text-center text-rose-600">ALFA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedGurus.length > 0 ? paginatedGurus.map((guru, idx) => (
                                <tr key={guru.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center whitespace-nowrap text-gray-400">
                                        {(page - 1) * rowsPerPage + idx + 1}
                                    </td>
                                    <td className="p-4 whitespace-nowrap font-bold text-gray-800 uppercase text-[12px]">{guru.nama}</td>
                                    <td className="p-4 italic text-gray-500 truncate max-w-[250px]">{guru.mapel}</td>
                                    <td className="p-4 text-center whitespace-nowrap font-bold text-gray-800">{formatStat(guru.stats.total)}</td>
                                    <td className="p-4 text-center whitespace-nowrap font-bold text-gray-800">{formatStat(guru.stats.hadir)}</td>
                                    <td className="p-4 text-center whitespace-nowrap font-bold text-gray-800">{formatStat(guru.stats.terlambat)}</td>
                                    <td className="p-4 text-center whitespace-nowrap font-bold text-gray-800">{formatStat(guru.stats.sakit)}</td>
                                    <td className="p-4 text-center whitespace-nowrap font-bold text-gray-800">{formatStat(guru.stats.izin)}</td>
                                    <td className="p-4 text-center whitespace-nowrap font-bold text-gray-800">{formatStat(guru.stats.alfa)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={9} className="p-10 text-center text-gray-400 font-medium italic">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded">
                <div className="text-sm text-gray-500 font-medium">
                    Menampilkan <span className="font-bold text-gray-800">{paginatedGurus.length}</span> dari <span className="font-bold text-gray-800">{gurus.length}</span> data
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2 text-sm text-gray-800">
                        {page} <span className="text-gray-400 font-normal">/</span> {totalPages}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper function for Ziggy routes
declare function route(name: string, params?: any): string;
