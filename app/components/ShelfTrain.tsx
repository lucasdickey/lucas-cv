/**
 * The red engine and cars for Plate III, drawn as an engraving: paper-filled
 * shapes (so the books behind are hidden), red outlines and red line shading.
 * Faces right; wheels, coupling rod and smoke are animated by the parent's CSS.
 */
type Props = { className: string; spin: string; rod: string; puff: string };

const RED = "#8b0000";
const PAPER = "#f5f5dc";

export default function ShelfTrain({ className, spin, rod, puff }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 67"
      fill="none"
      stroke={RED}
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="bsTrainH" width="4" height="3.2" patternUnits="userSpaceOnUse">
          <path d="M0 1.6H4" stroke={RED} strokeWidth={0.9} />
        </pattern>
        <pattern id="bsTrainV" width="5" height="4" patternUnits="userSpaceOnUse">
          <path d="M2.5 0V4" stroke={RED} strokeWidth={0.8} />
        </pattern>
        <pattern id="bsTrainD" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <path d="M0 1.8H3.6" stroke={RED} strokeWidth={1} />
        </pattern>
        <g id="bsTrainWheel6">
          <circle r="6" fill={PAPER} />
          <circle r="6" />
          <circle r="1.6" fill={RED} />
          <g className={spin}>
            <path d="M0-5.5V5.5M-5.5 0H5.5M-3.9-3.9 3.9 3.9M3.9-3.9-3.9 3.9" strokeWidth={0.9} />
          </g>
        </g>
        <g id="bsTrainWheel9">
          <circle r="9" fill={PAPER} />
          <circle r="9" />
          <circle r="7.4" strokeWidth={0.8} />
          <circle r="2" fill={RED} />
          <g className={spin}>
            <path
              d="M0-7.4V7.4M-7.4 0H7.4M-5.2-5.2 5.2 5.2M5.2-5.2-5.2 5.2M-2.8-6.8 2.8 6.8M2.8-6.8-2.8 6.8M-6.8-2.8 6.8 2.8M6.8-2.8-6.8 2.8"
              strokeWidth={0.8}
            />
          </g>
        </g>
        <g id="bsTrainBoxcar">
          <path d="M2 18 Q60 11 118 18 L118 21 L2 21 Z" fill={PAPER} />
          <path d="M2 18 Q60 11 118 18 L118 21 L2 21 Z" fill="url(#bsTrainH)" />
          <rect x="6" y="21" width="108" height="35" fill={PAPER} />
          <rect x="6" y="21" width="108" height="35" fill="url(#bsTrainV)" opacity={0.55} />
          <rect x="6" y="42" width="108" height="14" fill="url(#bsTrainH)" />
          <rect x="6" y="21" width="108" height="35" />
          <rect x="46" y="24" width="28" height="29" fill={PAPER} />
          <path d="M46 24h28v29H46zM46 24l28 29M74 24 46 53" strokeWidth={1.1} />
          <path d="M4 58h112" strokeWidth={2.4} />
          <use href="#bsTrainWheel6" x="22" y="61" />
          <use href="#bsTrainWheel6" x="38" y="61" />
          <use href="#bsTrainWheel6" x="82" y="61" />
          <use href="#bsTrainWheel6" x="98" y="61" />
        </g>
      </defs>

      {/* Two boxcars */}
      <use href="#bsTrainBoxcar" x="0" y="0" />
      <path d="M116 54h10" strokeWidth={2} />
      <use href="#bsTrainBoxcar" x="124" y="0" />
      <path d="M240 54h8" strokeWidth={2} />

      {/* Tender */}
      <path d="M250 30 L256 22 L298 22 L302 30 Z" fill="url(#bsTrainD)" />
      <path d="M250 30 L256 22 L298 22 L302 30" />
      <rect x="248" y="30" width="56" height="26" fill={PAPER} />
      <rect x="248" y="44" width="56" height="12" fill="url(#bsTrainH)" />
      <rect x="248" y="30" width="56" height="26" />
      <path d="M246 58h60" strokeWidth={2.4} />
      <use href="#bsTrainWheel6" x="262" y="61" />
      <use href="#bsTrainWheel6" x="290" y="61" />
      <path d="M304 54h6" strokeWidth={2} />

      {/* Cab */}
      <path d="M306 13 L354 13 L352 8 L308 8 Z" fill={PAPER} />
      <path d="M306 13 L354 13 L352 8 L308 8 Z" />
      <rect x="310" y="13" width="40" height="43" fill={PAPER} />
      <rect x="310" y="40" width="40" height="16" fill="url(#bsTrainH)" />
      <rect x="310" y="13" width="40" height="43" />
      <rect x="318" y="19" width="24" height="15" fill={PAPER} />
      <path d="M318 19h24v15h-24zM330 19v15" strokeWidth={1.1} />

      {/* Boiler, smokebox, domes and stack */}
      <rect x="350" y="27" width="86" height="25" fill={PAPER} />
      <rect x="350" y="40" width="86" height="12" fill="url(#bsTrainH)" />
      <rect x="350" y="27" width="86" height="25" />
      <path d="M372 27v25M396 27v25M418 27v25" strokeWidth={1} />
      <path d="M436 25 h8 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 h-8 Z" fill={PAPER} />
      <path d="M436 25 h8 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 h-8 Z" fill="url(#bsTrainD)" opacity={0.7} />
      <path d="M436 25 h8 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 h-8 Z" />
      <path d="M378 27 a8 8 0 0 1 16 0" fill={PAPER} />
      <path d="M378 27 a8 8 0 0 1 16 0" />
      <path d="M422 27 L424 11 L434 11 L436 27 Z" fill={PAPER} />
      <path d="M424 11 L434 11 L436 27 L422 27 Z" fill="url(#bsTrainV)" />
      <path d="M422 27 L424 11 L434 11 L436 27" />
      <path d="M419 11 h18 v-5 h-18 Z" fill={PAPER} />
      <path d="M419 11 h18 v-5 h-18 Z" />
      <rect x="444" y="17" width="9" height="8" fill={PAPER} />
      <rect x="444" y="17" width="9" height="8" />
      <path d="M453 21h3" strokeWidth={1} />

      {/* Running board, cylinder and pilot */}
      <path d="M350 53h100" strokeWidth={2.2} />
      <rect x="424" y="47" width="18" height="10" fill={PAPER} />
      <rect x="424" y="47" width="18" height="10" fill="url(#bsTrainH)" />
      <rect x="424" y="47" width="18" height="10" />
      <path d="M446 55 L470 66 L446 66 Z" fill={PAPER} />
      <path d="M446 55 L470 66 L446 66 Z" fill="url(#bsTrainD)" />
      <path d="M446 55 L470 66 L446 66 Z" />

      {/* Wheels and coupling rod */}
      <use href="#bsTrainWheel6" x="330" y="61" />
      <use href="#bsTrainWheel9" x="366" y="58" />
      <use href="#bsTrainWheel9" x="390" y="58" />
      <use href="#bsTrainWheel9" x="414" y="58" />
      <use href="#bsTrainWheel6" x="436" y="61" />
      <g className={rod}>
        <path d="M366 58H414" strokeWidth={2.6} />
        <circle cx="366" cy="58" r="1.6" fill={RED} />
        <circle cx="390" cy="58" r="1.6" fill={RED} />
        <circle cx="414" cy="58" r="1.6" fill={RED} />
      </g>

      {/* Smoke */}
      <circle className={puff} cx="428" cy="2" r="6" fill={PAPER} />
      <circle className={puff} cx="428" cy="2" r="6" fill={PAPER} />
      <circle className={puff} cx="428" cy="2" r="6" fill={PAPER} />
    </svg>
  );
}
