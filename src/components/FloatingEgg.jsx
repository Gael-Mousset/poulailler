import { useEffect } from "react";
import EggSvg, { EGG_COLORS } from "./EggSvg";

export default function FloatingEgg({ x, y, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-999 animate-float-up"
      style={{ left: x - 16, top: y - 16 }}
    >
      <EggSvg color={EGG_COLORS[Math.floor(Math.random() * EGG_COLORS.length)]} size={32} />
    </div>
  );
}
