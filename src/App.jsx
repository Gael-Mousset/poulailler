import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "./components/Header";
import FloatingEgg from "./components/FloatingEgg";
import { loadData, syncFromFile, todayStr } from "./utils/storage";

const tabClass = ({ isActive }) =>
  `flex-1 py-2.5 flex items-center justify-center no-underline outline-none rounded-[14px] cursor-pointer font-nunito font-bold text-sm transition-all ${
    isActive
      ? "bg-orange text-white shadow-[0_3px_10px_rgba(240,123,40,0.35)]"
      : "bg-[#f0e6d3] text-[#9a7a5a]"
  }`;

export default function App() {
  const [data, setData] = useState(loadData);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [floaters, setFloaters] = useState([]);
  const nextId = useRef(0);

  // Sync depuis data.json au démarrage
  useEffect(() => {
    syncFromFile().then(fileData => {
      if (fileData && Object.keys(fileData).length > 0) {
        setData(fileData);
        localStorage.setItem("eggData", JSON.stringify(fileData));
      }
    });
  }, []);

  const grandTotal = Object.values(data).reduce((a, b) => a + b, 0);

  function addFloater(x, y) {
    const id = nextId.current++;
    setFloaters(f => [...f, { id, x, y }]);
  }

  function removeFloater(id) {
    setFloaters(f => f.filter(item => item.id !== id));
  }

  return (
    <div className="max-w-107.5 mx-auto min-h-dvh flex flex-col">
      {floaters.map(f => (
        <FloatingEgg key={f.id} x={f.x} y={f.y} onDone={() => removeFloater(f.id)} />
      ))}

      <Header grandTotal={grandTotal} />

      <nav className="flex gap-2 px-4 pt-4">
        <NavLink to="/" end className={tabClass}>🥚 Saisie</NavLink>
        <NavLink to="/historique" className={tabClass}>📊 Historique</NavLink>
      </nav>

      <Outlet context={{ data, setData, selectedDate, setSelectedDate, addFloater }} />
    </div>
  );
}
