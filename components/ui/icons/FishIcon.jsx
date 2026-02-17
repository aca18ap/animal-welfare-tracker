const FishIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    {/* Body */}
    <ellipse cx="50" cy="50" rx="32" ry="20" fill="#7EC8E8" stroke="#5BB5D8" strokeWidth="2"/>
    {/* Tail */}
    <path d="M18 50 L5 35 L5 65 Z" fill="#5BB5D8" stroke="#4AA5C8" strokeWidth="1.5"/>
    {/* Fin top */}
    <path d="M45 30 Q50 18 55 30" fill="#5BB5D8" stroke="#4AA5C8" strokeWidth="1.5"/>
    {/* Fin bottom */}
    <path d="M50 70 Q55 78 60 70" stroke="#5BB5D8" strokeWidth="2" fill="#7EC8E8"/>
    {/* Scales */}
    <ellipse cx="40" cy="50" rx="6" ry="8" fill="#9ED8F0" opacity="0.5"/>
    <ellipse cx="55" cy="50" rx="6" ry="8" fill="#9ED8F0" opacity="0.5"/>
    {/* Eye */}
    <circle cx="70" cy="46" r="7" fill="white" stroke="#5BB5D8" strokeWidth="1.5"/>
    <circle cx="72" cy="45" r="4" fill="#333"/>
    <circle cx="73" cy="44" r="1.5" fill="white"/>
    {/* Mouth */}
    <path d="M82 52 Q86 50 82 48" stroke="#4AA5C8" strokeWidth="2" strokeLinecap="round"/>
    {/* Bubbles */}
    <circle cx="90" cy="38" r="3" fill="#B5E8F7" stroke="#7EC8E8" strokeWidth="1"/>
    <circle cx="94" cy="46" r="2" fill="#B5E8F7" stroke="#7EC8E8" strokeWidth="1"/>
  </svg>
);
export default FishIcon;