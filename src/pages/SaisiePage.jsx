import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import EggSvg, { EGG_COLORS } from "../components/EggSvg";
import { todayStr, saveData, saveCollecte } from "../utils/storage";

export default function SaisiePage() {
  const { data, setData, selectedDate, setSelectedDate, addFloater } = useOutletContext();
  const [pressing, setPressing] = useState(null);
  const pressInterval = useRef(null);

  const count = data[selectedDate] || 0;

  function changeCount(delta, e) {
    if (delta > 0 && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      addFloater(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    setData(prev => {
      const newVal = Math.max(0, (prev[selectedDate] || 0) + delta);
      const updated = { ...prev };
      if (newVal === 0) delete updated[selectedDate];
      else updated[selectedDate] = newVal;
      saveData(updated);
      saveCollecte(selectedDate, newVal);
      return updated;
    });
  }

  function startPress(type) {
    setPressing(type);
    pressInterval.current = setInterval(() => {
      setData(prev => {
        const delta = type === "add" ? 1 : -1;
        const newVal = Math.max(0, (prev[selectedDate] || 0) + delta);
        const updated = { ...prev };
        if (newVal === 0) delete updated[selectedDate];
        else updated[selectedDate] = newVal;
        saveData(updated);
        saveCollecte(selectedDate, newVal);
        return updated;
      });
    }, 150);
  }

  function stopPress() {
    setPressing(null);
    clearInterval(pressInterval.current);
  }

  return (
    <>
      <div className="px-4 pt-4 flex items-center gap-2.5">
        <input
          type="date"
          value={selectedDate}
          max={todayStr()}
          onChange={e => setSelectedDate(e.target.value)}
          className="flex-1 py-2.5 px-3.5 border-2 border-[#e8d8c0] rounded-[14px] font-nunito text-[15px] bg-white text-[#5a3e28] outline-none font-semibold focus:border-orange"
        />
        {selectedDate === todayStr() ? (
          <span className="bg-[#4caf50] text-white py-2.25 px-3.5 rounded-[14px] text-xs font-extrabold whitespace-nowrap">
            Aujourd'hui
          </span>
        ) : (
          <button
            onClick={() => setSelectedDate(todayStr())}
            className="bg-orange text-white py-2.25 px-3.5 rounded-[14px] text-xs font-extrabold whitespace-nowrap border-0 cursor-pointer hover:bg-honey transition-colors"
          >
            ↩ Aujourd'hui
          </button>
        )}
      </div>

      <div className="mx-4 mt-4 bg-white rounded-3xl py-7 px-5 pb-5 shadow-[0_4px_20px_rgba(0,0,0,0.07)] flex flex-col items-center gap-5">
        <div className="flex items-center gap-5">
          <button
            className={`w-17 h-17 rounded-[20px] border-0 cursor-pointer text-4xl font-black flex items-center justify-center transition-all duration-120 select-none touch-manipulation bg-[#ffeaea] text-[#e05050] shadow-[0_2px_8px_rgba(224,80,80,0.15)] active:scale-[0.88] disabled:opacity-25 disabled:cursor-not-allowed ${pressing === "remove" ? "scale-90" : ""}`}
            disabled={count === 0}
            onClick={() => changeCount(-1, null)}
            onMouseDown={() => { if (count > 0) startPress("remove"); }}
            onMouseUp={stopPress} onMouseLeave={stopPress}
            onTouchStart={() => { if (count > 0) startPress("remove"); }}
            onTouchEnd={stopPress}
          >−</button>

          <div>
            <div className="font-dancing text-[80px] text-orange leading-none min-w-24 text-center">
              {count}
            </div>
            <div className="text-[13px] font-bold text-[#b89a7a] text-center -mt-1.5">
              œuf{count > 1 ? "s" : ""} pondus
            </div>
          </div>

          <button
            className={`w-17 h-17 rounded-[20px] border-0 cursor-pointer text-4xl font-black flex items-center justify-center transition-all duration-120 select-none touch-manipulation bg-linear-to-br from-honey to-orange text-white shadow-[0_4px_16px_rgba(240,123,40,0.45)] active:scale-[0.88] ${pressing === "add" ? "scale-90" : ""}`}
            onClick={(e) => changeCount(1, e)}
            onMouseDown={() => startPress("add")}
            onMouseUp={stopPress} onMouseLeave={stopPress}
            onTouchStart={() => startPress("add")}
            onTouchEnd={stopPress}
          >+</button>
        </div>

        <div className="text-[11px] text-[#c4a882] font-semibold">
          Appui long pour compter rapidement
        </div>

        {count > 0 && (
          <div className="flex flex-wrap gap-1 justify-center max-w-70 min-h-7">
            {Array.from({ length: Math.min(count, 20) }).map((_, i) => (
              <span key={i} className="animate-egg-pop">
                <EggSvg color={EGG_COLORS[i % EGG_COLORS.length]} size={24} />
              </span>
            ))}
            {count > 20 && (
              <span className="text-xs text-[#b89a7a] font-bold self-center">+{count - 20}</span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
