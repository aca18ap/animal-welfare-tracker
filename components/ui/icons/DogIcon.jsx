const DogIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    {/* Body */}
    <ellipse cx="50" cy="62" rx="26" ry="22" fill="#D4A574" stroke="#C49A6C" strokeWidth="2"/>
    {/* Head */}
    <circle cx="50" cy="36" r="20" fill="#E8C4A0" stroke="#D4A574" strokeWidth="2"/>
    {/* Ears */}
    <ellipse cx="30" cy="24" rx="8" ry="14" fill="#C49A6C" stroke="#B08860" strokeWidth="1.5" transform="rotate(-10 30 24)"/>
    <ellipse cx="70" cy="24" rx="8" ry="14" fill="#C49A6C" stroke="#B08860" strokeWidth="1.5" transform="rotate(10 70 24)"/>
    {/* Muzzle */}
    <ellipse cx="50" cy="44" rx="10" ry="7" fill="#F5DFC5" stroke="#E8C4A0" strokeWidth="1.5"/>
    {/* Nose */}
    <ellipse cx="50" cy="42" rx="5" ry="4" fill="#333"/>
    <circle cx="48" cy="41" r="1.5" fill="#555"/>
    {/* Eyes */}
    <circle cx="42" cy="32" r="4" fill="#333"/>
    <circle cx="58" cy="32" r="4" fill="#333"/>
    <circle cx="43" cy="31" r="1.5" fill="white"/>
    <circle cx="59" cy="31" r="1.5" fill="white"/>
    {/* Tongue */}
    <ellipse cx="50" cy="52" rx="4" ry="5" fill="#FF8E8E"/>
    {/* Legs */}
    <rect x="30" y="78" width="8" height="14" rx="3" fill="#D4A574" stroke="#C49A6C" strokeWidth="1.5"/>
    <rect x="62" y="78" width="8" height="14" rx="3" fill="#D4A574" stroke="#C49A6C" strokeWidth="1.5"/>
    {/* Tail */}
    <path d="M76 58 Q88 48 86 62" stroke="#C49A6C" strokeWidth="5" strokeLinecap="round" fill="none"/>
  </svg>
);
export default DogIcon;