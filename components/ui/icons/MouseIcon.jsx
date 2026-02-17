
const MouseIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    {/* Body */}
    <ellipse cx="50" cy="58" rx="28" ry="22" fill="#C4C4C4" stroke="#AAAAAA" strokeWidth="2"/>
    {/* Head */}
    <ellipse cx="50" cy="40" rx="18" ry="16" fill="#D4D4D4" stroke="#BBBBBB" strokeWidth="2"/>
    {/* Ears */}
    <circle cx="32" cy="28" r="12" fill="#FFD4D4" stroke="#FFBBBB" strokeWidth="1.5"/>
    <circle cx="68" cy="28" r="12" fill="#FFD4D4" stroke="#FFBBBB" strokeWidth="1.5"/>
    <circle cx="32" cy="28" r="7" fill="#FFB5B5"/>
    <circle cx="68" cy="28" r="7" fill="#FFB5B5"/>
    {/* Eyes */}
    <circle cx="44" cy="38" r="4" fill="#333"/>
    <circle cx="56" cy="38" r="4" fill="#333"/>
    <circle cx="45" cy="37" r="1.5" fill="white"/>
    <circle cx="57" cy="37" r="1.5" fill="white"/>
    {/* Nose */}
    <circle cx="50" cy="48" r="3" fill="#FFAAAA"/>
    <circle cx="49" cy="47" r="1" fill="white" opacity="0.5"/>
    {/* Whiskers */}
    <path d="M40 48 L26 46 M40 50 L26 52 M60 48 L74 46 M60 50 L74 52" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Tail */}
    <path d="M78 58 Q95 52 98 65 Q100 78 92 88" stroke="#FFAAAA" strokeWidth="3" strokeLinecap="round" fill="none"/>
    {/* Paws */}
    <ellipse cx="36" cy="78" rx="5" ry="3" fill="#FFD4D4" stroke="#FFBBBB" strokeWidth="1"/>
    <ellipse cx="64" cy="78" rx="5" ry="3" fill="#FFD4D4" stroke="#FFBBBB" strokeWidth="1"/>
  </svg>
);
export default MouseIcon;