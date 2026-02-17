
const PigIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    {/* Body */}
    <ellipse cx="50" cy="58" rx="32" ry="26" fill="#FFD4D4" stroke="#FFB5B5" strokeWidth="2"/>
    {/* Head */}
    <circle cx="50" cy="42" r="22" fill="#FFD4D4" stroke="#FFB5B5" strokeWidth="2"/>
    {/* Ears */}
    <ellipse cx="30" cy="28" rx="8" ry="10" fill="#FFACAC" stroke="#FF9999" strokeWidth="1.5" transform="rotate(-15 30 28)"/>
    <ellipse cx="70" cy="28" rx="8" ry="10" fill="#FFACAC" stroke="#FF9999" strokeWidth="1.5" transform="rotate(15 70 28)"/>
    {/* Snout */}
    <ellipse cx="50" cy="50" rx="12" ry="8" fill="#FFACAC" stroke="#FF9999" strokeWidth="1.5"/>
    {/* Nostrils */}
    <ellipse cx="46" cy="50" rx="2" ry="3" fill="#E07070"/>
    <ellipse cx="54" cy="50" rx="2" ry="3" fill="#E07070"/>
    {/* Eyes */}
    <circle cx="40" cy="38" r="4" fill="#333"/>
    <circle cx="60" cy="38" r="4" fill="#333"/>
    <circle cx="41" cy="37" r="1.5" fill="white"/>
    <circle cx="61" cy="37" r="1.5" fill="white"/>
    {/* Cheeks */}
    <circle cx="32" cy="48" r="5" fill="#FF9999" opacity="0.5"/>
    <circle cx="68" cy="48" r="5" fill="#FF9999" opacity="0.5"/>
    {/* Legs */}
    <rect x="28" y="78" width="8" height="12" rx="3" fill="#FFACAC" stroke="#FF9999" strokeWidth="1.5"/>
    <rect x="64" y="78" width="8" height="12" rx="3" fill="#FFACAC" stroke="#FF9999" strokeWidth="1.5"/>
    {/* Tail */}
    <path d="M82 55 Q90 50 88 58 Q86 66 92 62" stroke="#FFACAC" strokeWidth="3" strokeLinecap="round" fill="none"/>
  </svg>
);
export default PigIcon;