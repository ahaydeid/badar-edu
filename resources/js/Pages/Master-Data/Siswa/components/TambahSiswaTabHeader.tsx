type Props = {
    tabs: string[];
    active: number;
    onChange: (index: number) => void;
};

export default function TambahSiswaTabHeader({
    tabs,
    active,
    onChange,
}: Props) {
    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200">
            <div className="flex overflow-x-auto">
                {tabs.map((t, i) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => onChange(i)}
                        className={`
                            flex-1 min-w-[140px] px-4 py-3 text-sm font-medium
                            transition-all duration-200
                            border-b-2
                            ${
                                active === i
                                    ? "border-sky-600 text-sky-600 bg-sky-50"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }
                        `}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
    );
}
