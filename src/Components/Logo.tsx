interface LogoProps {
  className?: string;
  onClick?: () => void;
}

/**
 * "DCD" in large letters with "MINISTRIES" directly below, stretched to the same width.
 * Size it with a width class (e.g. w-24); the height follows. Color comes from the text color.
 */
export default function Logo({ className = '', onClick }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 56"
      role="img"
      aria-label="DCD Ministries"
      onClick={onClick}
      className={`font-condensed font-black italic fill-current overflow-visible ${className}`}
    >
      <text x="2" y="38" fontSize="50" textLength="95" lengthAdjust="spacingAndGlyphs">
        DCD
      </text>
      <text x="0" y="54" fontSize="15" textLength="96" lengthAdjust="spacingAndGlyphs">
        MINISTRIES
      </text>
    </svg>
  );
}
