import { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate, useOutletContext } from "react-router-dom";
import { todayStr } from "../utils/storage";

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const MONTHS_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

function BarChart({ bars, title }) {
  const max = Math.max(...bars.map((b) => b.total), 1);
  return (
    <div className="bg-white rounded-[18px] p-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <div className="font-bold text-[#7a5c3a] text-[13px] mb-3">{title}</div>
      <div className="flex gap-1 items-end h-17.5">
        {bars.map((b, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
          >
            <div className="text-[9px] font-bold text-[#5a3e28]">
              {b.total || ""}
            </div>
            <div
              className="w-full rounded-t-md min-h-1 transition-[height] duration-500 bg-linear-to-b from-honey to-orange"
              style={{ height: `${(b.total / max) * 54}px` }}
            />
            <div className="text-[9px] font-bold text-[#9a7a5a] text-center leading-tight">
              {b.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListRow({ keyDate, label, total, onClick, selectedDate }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[14px] px-4 py-3.25 mb-2 shadow-[0_1px_6px_rgba(0,0,0,0.05)] flex items-center gap-3 cursor-pointer transition-transform duration-100 active:scale-[0.98] ${keyDate && keyDate === selectedDate ? "border-2 border-orange" : ""}`}
    >
      <span className="text-[24px]">{total > 0 ? "🥚" : "⬜"}</span>
      <div className="flex-1 font-bold text-[#4a3320] text-[14px]">{label}</div>
      <div
        className={`font-dancing text-[28px] ${total > 0 ? "text-orange" : "text-[#d4c4b0]"}`}
      >
        {total}
      </div>
    </div>
  );
}

export default function HistoriquePage() {
  const { data, selectedDate, setSelectedDate } = useOutletContext();
  const navigate = useNavigate();
  const [view, setView] = useState("année");
  const [drillYear, setDrillYear] = useState(null);
  const [drillMonth, setDrillMonth] = useState(null);

  const allDates = Object.keys(data).sort((a, b) => b.localeCompare(a));
  const grandTotal = Object.values(data).reduce((a, b) => a + b, 0);
  const today = todayStr();

  // ── 7 derniers jours ──────────────────────────────────────────────────
  const weekStats = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key,
        label: d.toLocaleDateString("fr-FR", { weekday: "short" }),
        total: data[key] || 0,
      });
    }
    return days;
  })();
  const maxWeek = Math.max(...weekStats.map((d) => d.total), 1);

  // ── Données par année ─────────────────────────────────────────────────
  function getYearRows() {
    const acc = {};
    Object.keys(data).forEach((date) => {
      const y = date.slice(0, 4);
      acc[y] = (acc[y] || 0) + data[date];
    });
    return Object.keys(acc)
      .sort((a, b) => b.localeCompare(a))
      .map((y) => ({ key: y, label: y, total: acc[y] }));
  }

  // ── Données par mois d'une année ──────────────────────────────────────
  function getMonthRowsForYear(year) {
    const acc = {};
    Object.keys(data).forEach((date) => {
      if (date.startsWith(year)) {
        const k = date.slice(5, 7);
        acc[k] = (acc[k] || 0) + data[date];
      }
    });
    return Object.keys(acc)
      .sort((a, b) => b.localeCompare(a))
      .map((k) => ({
        key: k,
        label: MONTHS_FR[parseInt(k) - 1],
        monthIndex: parseInt(k) - 1,
        total: acc[k],
      }));
  }

  // ── Données par jour d'un mois ────────────────────────────────────────
  function getDayRowsForMonth(year, monthIndex) {
    const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    return allDates
      .filter((d) => d.startsWith(prefix))
      .map((date) => ({
        key: date,
        label: new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        total: data[date],
      }));
  }

  // ── Bar charts ────────────────────────────────────────────────────────
  const yearBars = (() => {
    const acc = {};
    Object.keys(data).forEach((date) => {
      const y = date.slice(0, 4);
      acc[y] = (acc[y] || 0) + data[date];
    });
    return Object.keys(acc)
      .sort()
      .map((y) => ({ label: y, total: acc[y] }));
  })();

  function getMonthBarsForYear(year) {
    const acc = {};
    Object.keys(data).forEach((date) => {
      if (date.startsWith(year)) {
        const k = date.slice(5, 7);
        acc[k] = (acc[k] || 0) + data[date];
      }
    });
    return Array.from({ length: 12 }, (_, i) => ({
      label: MONTHS_SHORT[i],
      total: acc[String(i + 1).padStart(2, "0")] || 0,
    }));
  }

  // ── Navigation ────────────────────────────────────────────────────────
  function switchView(v) {
    setView(v);
    setDrillYear(null);
    setDrillMonth(null);
  }

  function openYear(year) {
    setDrillYear(year);
    setDrillMonth(null);
    setView("mois");
  }

  function openMonth(monthIndex) {
    setDrillMonth(monthIndex);
    setView("jour");
  }

  function goToDate(date) {
    setSelectedDate(date);
    navigate("/");
  }

  // ── Export ────────────────────────────────────────────────────────────
  function exportCSV() {
    let csv = "Date,Œufs pondus\n";
    allDates.forEach((date) => {
      csv += `${date},${data[date]}\n`;
    });
    csv += `TOTAL,${grandTotal}`;
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pontes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportExcel() {
    const rows = [["Date", "Œufs pondus"]];
    allDates.forEach((date) => rows.push([date, data[date]]));
    rows.push(["TOTAL", grandTotal]);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 14 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pontes");
    XLSX.writeFile(wb, "pontes.xlsx");
  }

  // ── Composants ────────────────────────────────────────────────────────
  const ViewBtn = ({ v, label }) => (
    <button
      onClick={() => switchView(v)}
      className={`flex-1 py-1.5 rounded-[10px] text-xs font-bold border-0 cursor-pointer transition-all ${
        view === v ? "bg-orange text-white" : "bg-transparent text-[#9a7a5a]"
      }`}
    >
      {label}
    </button>
  );

  const empty = (
    <div className="text-center py-12 px-5 text-[#c4a882]">
      <div className="text-[56px] mb-2.5">🥚</div>
      <p className="text-[14px] font-semibold leading-relaxed">
        Aucune ponte enregistrée.
        <br />
        Va dans Saisie pour commencer !
      </p>
    </div>
  );

  // ── Données selon contexte ────────────────────────────────────────────
  const yearRows = getYearRows();
  const activeYear = drillYear || today.slice(0, 4);
  const monthRows = getMonthRowsForYear(activeYear);
  const dayRows =
    drillYear && drillMonth != null
      ? getDayRowsForMonth(drillYear, drillMonth)
      : allDates
          .filter((d) => d.startsWith(today.slice(0, 7)))
          .map((date) => ({
            key: date,
            label: new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            total: data[date],
          }));

  // ── Fil d'Ariane ──────────────────────────────────────────────────────
  const Breadcrumb = () => {
    if (view === "année") return null;
    return (
      <div className="flex items-center gap-1.5 text-[12px] font-bold mb-3 flex-wrap">
        <span
          className="text-orange cursor-pointer"
          onClick={() => switchView("année")}
        >
          Années
        </span>
        {drillYear && (
          <>
            <span className="text-[#c4a882]">›</span>
            <span
              className={
                view === "mois"
                  ? "text-[#4a3320]"
                  : "text-orange cursor-pointer"
              }
              onClick={() => {
                if (view === "jour") openYear(drillYear);
              }}
            >
              {drillYear}
            </span>
          </>
        )}
        {drillYear && drillMonth != null && (
          <>
            <span className="text-[#c4a882]">›</span>
            <span className="text-[#4a3320]">{MONTHS_FR[drillMonth]}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 py-3 flex-1 overflow-y-auto">
      {/* Sélecteur de vue */}
      <div className="bg-[#f0e6d3] rounded-[14px] p-1 flex gap-1 mb-3">
        <ViewBtn v="jour" label="📅 Jours" />
        <ViewBtn v="mois" label="📆 Mois" />
        <ViewBtn v="année" label="🗓 Année" />
      </div>

      <Breadcrumb />

      {/* Graphe 7 jours — vue jour sans drill mois */}
      {view === "jour" && !(drillYear && drillMonth != null) && (
        <div className="bg-white rounded-[18px] p-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <div className="font-bold text-[#7a5c3a] text-[13px] mb-3">
            📈 7 derniers jours
          </div>
          <div className="flex gap-1.5 items-end h-17.5">
            {weekStats.map((d) => (
              <div
                key={d.key}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end cursor-pointer"
                onClick={() => goToDate(d.key)}
              >
                <div className="text-[11px] font-bold text-[#5a3e28]">
                  {d.total || ""}
                </div>
                <div
                  className={`w-full rounded-t-md min-h-1 transition-[height] duration-500 ${d.key === today ? "bg-linear-to-b from-[#66bb6a] to-[#2e8b57]" : "bg-linear-to-b from-honey to-orange"} ${d.key === selectedDate ? "outline-3 outline-orange outline-offset-2" : ""}`}
                  style={{ height: `${(d.total / maxWeek) * 54}px` }}
                />
                <div className="text-[10px] font-bold text-[#9a7a5a]">
                  {d.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graphe mois de l'année sélectionnée */}
      {view === "mois" && (
        <BarChart
          bars={getMonthBarsForYear(activeYear)}
          title={`📈 ${activeYear}`}
        />
      )}

      {/* Graphe par année */}
      {view === "année" && yearBars.length > 0 && (
        <BarChart bars={yearBars} title="📈 Par année" />
      )}

      {/* Liste */}
      <div className="max-h-96 overflow-y-auto pr-1">
        {view === "année" &&
          (yearRows.length === 0
            ? empty
            : yearRows.map(({ key, label, total }) => (
                <ListRow
                  key={key}
                  label={label}
                  total={total}
                  onClick={() => openYear(key)}
                  selectedDate={selectedDate}
                />
              )))}

        {view === "mois" &&
          (monthRows.length === 0
            ? empty
            : monthRows.map(({ key, label, monthIndex, total }) => (
                <ListRow
                  key={key}
                  label={label}
                  total={total}
                  onClick={() => openMonth(monthIndex)}
                  selectedDate={selectedDate}
                />
              )))}

        {view === "jour" &&
          (dayRows.length === 0
            ? empty
            : dayRows.map(({ key, label, total }) => (
                <ListRow
                  key={key}
                  keyDate={key}
                  label={label}
                  total={total}
                  onClick={() => goToDate(key)}
                  selectedDate={selectedDate}
                />
              )))}
      </div>

      {/* Export */}
      <div className="pt-3 pb-7 flex gap-2">
        <button
          className="flex-1 py-3.25 border-0 rounded-[14px] cursor-pointer font-nunito font-bold text-[13px] flex items-center justify-center gap-1.5 transition-all duration-200 bg-[#e8f5e9] text-[#2e7d32] enabled:hover:bg-[#2e7d32] enabled:hover:text-white enabled:hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={exportCSV}
          disabled={allDates.length === 0}
        >
          <span>📄</span> CSV
        </button>
        <button
          className="flex-1 py-3.25 border-0 rounded-[14px] cursor-pointer font-nunito font-bold text-[13px] flex items-center justify-center gap-1.5 transition-all duration-200 bg-[#e3f2fd] text-[#1565c0] enabled:hover:bg-[#1565c0] enabled:hover:text-white enabled:hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={exportExcel}
          disabled={allDates.length === 0}
        >
          <span>📊</span> Excel
        </button>
      </div>
    </div>
  );
}
