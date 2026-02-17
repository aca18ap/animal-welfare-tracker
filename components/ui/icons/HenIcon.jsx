const HenIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    {/* Body */}
    <ellipse cx="50" cy="58" rx="28" ry="24" fill="#FFF5E6"/>
    <ellipse cx="50" cy="58" rx="28" ry="24" stroke="#E8B86D" strokeWidth="2"/>
    {/* Wing */}
    <ellipse cx="38" cy="60" rx="10" ry="14" fill="#FFE4B5" stroke="#E8B86D" strokeWidth="1.5"/>
    {/* Head */}
    <circle cx="68" cy="38" r="14" fill="#FFF5E6" stroke="#E8B86D" strokeWidth="2"/>
    {/* Comb */}
    <path d="M66 24 Q70 18 74 24 Q78 18 82 24" stroke="#E85D5D" strokeWidth="4" strokeLinecap="round" fill="#FF6B6B"/>
    {/* Beak */}
    <path d="M80 38 L90 36 L80 42 Z" fill="#F4A835"/>
    {/* Eye */}
    <circle cx="72" cy="36" r="3" fill="#333"/>
    <circle cx="73" cy="35" r="1" fill="white"/>
    {/* Wattle */}
    <ellipse cx="78" cy="46" rx="3" ry="5" fill="#FF6B6B"/>
    {/* Feet */}
    <path d="M38 80 L34 92 M38 80 L38 92 M38 80 L42 92" stroke="#F4A835" strokeWidth="3" strokeLinecap="round"/>
    <path d="M58 80 L54 92 M58 80 L58 92 M58 80 L62 92" stroke="#F4A835" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);
export default HenIcon;