export function NoiseFilter() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-50 h-full w-full paper-texture"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise">
        <feTurbulence
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
          type="fractalNoise"
        ></feTurbulence>
      </filter>
      <rect filter="url(#noise)" height="100%" width="100%"></rect>
    </svg>
  );
}
