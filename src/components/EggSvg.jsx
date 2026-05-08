export const EGG_COLORS = ["#f5e6c8","#f2d5a0","#e8c97c","#d4b896","#c8a87a","#e8d5a0","#f0c878"];

export default function EggSvg({ color, size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 36" fill="none">
      <ellipse cx="16" cy="19" rx="13" ry="16" fill={color} />
      <ellipse cx="12" cy="14" rx="4" ry="3" fill="white" opacity="0.25" transform="rotate(-20 12 14)" />
    </svg>
  );
}
