import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import EggSvg, { EGG_COLORS } from "../components/EggSvg";
import { todayStr, saveData, saveCollecte } from "../utils/storage";

let _aid = 0;

function Basket() {
  return (
    <svg width="120" height="68" viewBox="0 0 120 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 23 Q60 3 92 23" stroke="#b8752a" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <rect x="6" y="20" width="108" height="12" rx="6" fill="#c8893a"/>
      <path d="M8 31 Q60 25 112 31 L105 65 Q60 70 15 65 Z" fill="#d4a055"/>
      <path d="M10 43 Q60 37 110 43" stroke="#b07030" strokeWidth="1.5" fill="none"/>
      <path d="M11 54 Q60 48 109 54" stroke="#b07030" strokeWidth="1.5" fill="none"/>
      <path d="M12 63 Q60 59 108 63" stroke="#b07030" strokeWidth="1.5" fill="none"/>
      <line x1="32" y1="31" x2="25" y2="66" stroke="#b07030" strokeWidth="1.5"/>
      <line x1="60" y1="26" x2="60" y2="69" stroke="#b07030" strokeWidth="1.5"/>
      <line x1="88" y1="31" x2="95" y2="66" stroke="#b07030" strokeWidth="1.5"/>
    </svg>
  );
}

export default function SaisiePage() {
  const { data, setData, selectedDate, setSelectedDate } = useOutletContext();

  const savedCount = data[selectedDate] ?? 0;
  const [pendingCount, setPendingCount] = useState(savedCount);
  const [anims, setAnims] = useState([]);
  const [pressing, setPressing] = useState(null);
  const pressRef = useRef(null);
  const pendingRef = useRef(pendingCount);
  const hasEditedRef = useRef(false);

  useEffect(() => { pendingRef.current = pendingCount; }, [pendingCount]);

  useEffect(() => {
    hasEditedRef.current = false;
    setPendingCount(data[selectedDate] ?? 0);
    setAnims([]);
    clearInterval(pressRef.current);
  }, [selectedDate]); // eslint-disable-line

  useEffect(() => {
    if (!hasEditedRef.current) {
      setPendingCount(savedCount);
    }
  }, [savedCount]);

  function spawnAnim(type) {
    const id = _aid++;
    setAnims(a => [...a, { id, type }]);
    setTimeout(() => setAnims(a => a.filter(x => x.id !== id)), 750);
  }

  function startPress(type) {
    setPressing(type);
    pressRef.current = setInterval(() => {
      if (type === "add") {
        setPendingCount(c => c + 1);
        hasEditedRef.current = true;
        spawnAnim("add");
      } else {
        if (pendingRef.current <= 0) return;
        setPendingCount(c => Math.max(0, c - 1));
        hasEditedRef.current = true;
        spawnAnim("remove");
      }
    }, 150);
  }

  function stopPress() {
    setPressing(null);
    clearInterval(pressRef.current);
  }

  function doAdd() {
    setPendingCount(c => c + 1);
    hasEditedRef.current = true;
    spawnAnim("add");
  }

  function doRemove() {
    if (pendingRef.current <= 0) return;
    setPendingCount(c => Math.max(0, c - 1));
    hasEditedRef.current = true;
    spawnAnim("remove");
  }

  function handleValider() {
    setData(prev => {
      const next = { ...prev };
      if (pendingCount === 0) delete next[selectedDate];
      else next[selectedDate] = pendingCount;
      saveData(next);
      saveCollecte(selectedDate, pendingCount);
      return next;
    });
    hasEditedRef.current = false;
  }

  const count = pendingCount;
  const isDirty = count !== savedCount;

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

        {/* Counter row */}
        <div className="flex items-center gap-5">
          <button
            className={`w-17 h-17 rounded-[20px] border-0 cursor-pointer text-4xl font-black flex items-center justify-center transition-all duration-120 select-none touch-manipulation bg-[#ffeaea] text-[#e05050] shadow-[0_2px_8px_rgba(224,80,80,0.15)] active:scale-[0.88] disabled:opacity-25 disabled:cursor-not-allowed ${pressing === "remove" ? "scale-90" : ""}`}
            disabled={count === 0}
            onClick={doRemove}
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
            onClick={doAdd}
            onMouseDown={() => startPress("add")}
            onMouseUp={stopPress} onMouseLeave={stopPress}
            onTouchStart={() => startPress("add")}
            onTouchEnd={stopPress}
          >+</button>
        </div>

        {/* Basket zone */}
        <div className="relative w-full flex justify-center" style={{ height: 90 }}>

          {/* Flying eggs */}
          {anims.map(a => {
            const offsetX = ((a.id * 17) % 50) - 25;
            return (
              <div
                key={a.id}
                className="absolute pointer-events-none"
                style={{ left: `calc(50% + ${offsetX}px)`, top: 0 }}
              >
                <div className={a.type === "add" ? "animate-egg-fall-in" : "animate-egg-fly-out"}>
                  <EggSvg color={EGG_COLORS[a.id % EGG_COLORS.length]} size={30} />
                </div>
              </div>
            );
          })}

          {/* Basket */}
          <div className="absolute" style={{ top: 0 }}>
            <Basket />
          </div>

          {count === 0 && (
            <div className="absolute text-[#c4a882] text-xs font-semibold" style={{ bottom: 4 }}>
              Panier vide
            </div>
          )}
        </div>

        {/* Valider button */}
        {isDirty && (
          <button
            onClick={handleValider}
            className="w-full py-3.5 rounded-2xl bg-linear-to-br from-[#4caf50] to-[#388e3c] text-white font-extrabold text-[15px] border-0 cursor-pointer shadow-[0_4px_16px_rgba(76,175,80,0.4)] active:scale-[0.97] transition-all duration-120 animate-sunrise"
          >
            ✓ Valider
          </button>
        )}

        <div className="text-[11px] text-[#c4a882] font-semibold">
          Appui long pour compter rapidement
        </div>
      </div>
    </>
  );
}
