const sizeClasses = {
  sm: "w-10 h-10 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-lg",
}

export default function AvatarUser({
  name = "Usuario",
  profilePicture,
  imageSrc,
  fallbackLabel,
  size = "md",
  className = "",
  isAdmin = false,
}) {
  const source = profilePicture || imageSrc
  const initials = (fallbackLabel || name || "US").trim().slice(0, 2).toUpperCase()

  return (
    <div
      className={`overflow-hidden rounded-full border border-white/10 shadow-[0_0_24px_rgba(216,27,96,0.18)] ${sizeClasses[size] || sizeClasses.md} ${className}`}
      aria-hidden="true"
    >
      {source ? (
        <img src={source} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className={`flex h-full w-full items-center justify-center ${isAdmin ? "bg-gradient-to-br from-[#F8D66D] via-[#D81B60] to-[#7B3FEC]" : "bg-gradient-to-br from-[#D81B60] via-[#7B3FEC] to-[#00BFA5]"}`}>
          <span className="font-black tracking-[0.16em] text-white">{initials}</span>
        </div>
      )}
    </div>
  )
}
