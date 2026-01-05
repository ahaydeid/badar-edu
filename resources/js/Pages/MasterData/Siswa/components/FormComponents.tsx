import React from "react";

export function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-semibold">{title}</h3>
            {children}
        </div>
    );
}

export function Grid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    );
}

export function Input(props: any) {
    return (
        <label className="block">
            <span className="text-sm">{props.label}</span>
            <input
                {...props}
                className="input border border-gray-200 rounded-lg py-1 px-2 w-full"
            />
        </label>
    );
}

export function Textarea(props: any) {
    return (
        <label className="block md:col-span-3">
            <span className="text-sm">{props.label}</span>
            <textarea
                {...props}
                className="input border border-gray-200 rounded-lg p-2 w-full h-24"
            />
        </label>
    );
}

export function Select(props: any) {
    return (
        <label className="block">
            <span className="text-sm">{props.label}</span>
            <select
                {...props}
                className="input border border-gray-200 rounded-lg p-2 w-full"
            >
                {props.children}
            </select>
        </label>
    );
}
