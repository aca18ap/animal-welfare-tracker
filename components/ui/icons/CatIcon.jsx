
const CatIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    {/* Body */}
    <ellipse cx="50" cy="62" rx="24" ry="22" fill="#808080" stroke="#666666" strokeWidth="2"/>
    {/* Head */}
    <circle cx="50" cy="38" r="20" fill="#909090" stroke="#777777" strokeWidth="2"/>
    {/* Ears */}
    <path d="M30 30 L26 8 L42 24 Z" fill="#909090" stroke="#777777" strokeWidth="1.5"/>
    <path d="M70 30 L74 8 L58 24 Z" fill="#909090" stroke="#777777" strokeWidth="1.5"/>
    {/* Inner ears */}
    <path d="M32 26 L30 14 L40 22" fill="#FFB5B5"/>
    <path d="M68 26 L70 14 L60 22" fill="#FFB5B5"/>
    {/* Eyes */}
    <ellipse cx="42" cy="36" rx="5" ry="6" fill="#90EE90"/>
    <ellipse cx="58" cy="36" rx="5" ry="6" fill="#90EE90"/>
    <ellipse cx="42" cy="36" rx="2" ry="5" fill="#333"/>
    <ellipse cx="58" cy="36" rx="2" ry="5" fill="#333"/>
    {/* Nose */}
    <path d="M50 44 L47 48 L53 48 Z" fill="#FFB5B5"/>
    {/* Mouth */}
    <path d="M50 48 L50 52 M50 52 Q46 54 44 52 M50 52 Q54 54 56 52" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Whiskers */}
    <path d="M38 46 L24 44 M38 50 L24 52 M62 46 L76 44 M62 50 L76 52" stroke="#AAA" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Tail */}
    <path d="M74 62 Q92 50 88 70 Q86 82 92 88" stroke="#808080" strokeWidth="5" strokeLinecap="round" fill="none"/>
    {/* Paws */}
    <ellipse cx="34" cy="82" rx="6" ry="4" fill="#909090" stroke="#777777" strokeWidth="1.5"/>
    <ellipse cx="66" cy="82" rx="6" ry="4" fill="#909090" stroke="#777777" strokeWidth="1.5"/>
  </svg>
);
export default CatIcon;