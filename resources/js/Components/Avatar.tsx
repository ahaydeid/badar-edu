type AvatarProps = {
    name?: string;
    photo?: string | null;
    size?: "small" | "medium" | "large";
    className?: string;
};

export default function Avatar({
    name = "",
    photo = null,
    size = "medium",
    className = "",
}: AvatarProps) {
    const sizeClasses = {
        small: "w-8 h-8 text-xs",
        medium: "w-12 h-12 text-sm",
        large: "w-32 h-32 text-2xl",
    };

    // Generate avatar URL using ui-avatars.com API
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "User"
    )}&background=0ea5e9&color=fff&size=256`;

    const photoUrl = photo
        ? photo.startsWith("http")
            ? photo
            : `/storage/${photo}`
        : avatarUrl;

    return (
        <img
            src={photoUrl}
            alt={name || "User"}
            className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        />
    );
}
