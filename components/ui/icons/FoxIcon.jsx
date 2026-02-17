
const FoxIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    {/* Body */}
    <ellipse cx="50" cy="62" rx="26" ry="22" fill="#E87A3D" stroke="#D66A2D" strokeWidth="2"/>
    {/* White belly */}
    <ellipse cx="50" cy="68" rx="16" ry="12" fill="#FFF5EE"/>
    {/* Head */}
    <circle cx="50" cy="38" r="20" fill="#E87A3D" stroke="#D66A2D" strokeWidth="2"/>
    {/* White face */}
    <path d="M38 42 L50 56 L62 42 Q50 48 38 42" fill="#FFF5EE"/>
    {/* Ears */}
    <path d="M32 32 L24 8 L42 26 Z" fill="#E87A3D" stroke="#D66A2D" strokeWidth="1.5"/>
    <path d="M68 32 L76 8 L58 26 Z" fill="#E87A3D" stroke="#D66A2D" strokeWidth="1.5"/>
    {/* Inner ears */}
    <path d="M32 28 L28 14 L38 24" fill="#FFB088"/>
    <path d="M68 28 L72 14 L62 24" fill="#FFB088"/>
    {/* Nose */}
    <circle cx="50" cy="50" r="3" fill="#333"/>
    {/* Eyes */}
    <ellipse cx="42" cy="36" rx="4" ry="5" fill="#333"/>
    <ellipse cx="58" cy="36" rx="4" ry="5" fill="#333"/>
    <circle cx="43" cy="35" r="1.5" fill="white"/>
    <circle cx="59" cy="35" r="1.5" fill="white"/>
    {/* Tail */}
    <path d="M76 58 Q95 45 92 65 Q90 80 95 85" stroke="#E87A3D" strokeWidth="8" strokeLinecap="round" fill="none"/>
    <path d="M92 80 Q90 85 95 85" stroke="#FFF5EE" strokeWidth="4" strokeLinecap="round"/>
    {/* Legs */}
    <rect x="32" y="78" width="7" height="14" rx="3" fill="#333" stroke="#222" strokeWidth="1"/>
    <rect x="61" y="78" width="7" height="14" rx="3" fill="#333" stroke="#222" strokeWidth="1"/>
  </svg>
);
export default FoxIcon;