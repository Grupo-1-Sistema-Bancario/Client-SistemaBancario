import { useMemo } from "react";

export default function AvatarUser({ profilePicture, name }) {
  const initials = useMemo(() => {
    const words = (name || "").trim().split(" ").filter(Boolean);
    if (words.length === 0) return "US";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }, [name]);

  return (
    <div className="avatar">
      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-lg shadow-fuchsia-900/30 bg-gradient-to-br from-pink-600 via-purple-700 to-cyan-500">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={name || 'Usuario'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-sm font-black text-white uppercase tracking-[0.2em]">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
