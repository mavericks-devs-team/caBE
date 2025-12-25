interface MaterialIconProps {
    icon: string;
    className?: string;
    filled?: boolean;
}

export function MaterialIcon({ icon, className = "", filled = false }: MaterialIconProps) {
    return (
        <span
            className={`material-symbols-outlined ${filled ? 'material-symbols-filled' : ''} ${className}`}
            style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
        >
            {icon}
        </span>
    );
}
