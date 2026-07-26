import clsx from "clsx";

const StatusBadge = ({ active }) => {
    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition",
                active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "bg-rose-50 text-rose-700 border border-rose-200/60"
            )}
        >
            <span
                className={clsx(
                    "h-1.5 w-1.5 rounded-full",
                    active ? "bg-emerald-600" : "bg-rose-600"
                )}
            />
            {active ? "Active" : "Inactive"}
        </span>
    );
};

export default StatusBadge;