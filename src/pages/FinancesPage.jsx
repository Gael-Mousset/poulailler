import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { todayStr } from "../utils/storage";

const DEFAULT_CATEGORIES = ["Poules", "Nourriture", "Matériel"];

function loadFinances() {
  try {
    const raw = JSON.parse(localStorage.getItem("financeData") || "null");
    if (!raw)
      return { categories: DEFAULT_CATEGORIES, depenses: [], ventes: [] };
    if (raw.depenses?.length > 0 && "label" in raw.depenses[0]) {
      return {
        categories: DEFAULT_CATEGORIES,
        depenses: [],
        ventes: raw.ventes || [],
      };
    }
    return {
      categories: raw.categories || DEFAULT_CATEGORIES,
      depenses: raw.depenses || [],
      ventes: raw.ventes || [],
    };
  } catch {
    return { categories: DEFAULT_CATEGORIES, depenses: [], ventes: [] };
  }
}

function saveFinances(f) {
  const json = JSON.stringify(f);
  localStorage.setItem("financeData", json);
  fetch("/api/finances", { method: "POST", headers: { "Content-Type": "application/json" }, body: json }).catch(() => {});
}

const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";

export default function FinancesPage() {
  const { data } = useOutletContext();
  const [finances, setFinances] = useState(loadFinances);
  const [depForm, setDepForm] = useState({
    date: todayStr(),
    category: "",
    name: "",
    amount: "",
  });
  const [venteForm, setVenteForm] = useState({
    date: todayStr(),
    oeufs: "",
    montant: "",
  });
  const [addingCat, setAddingCat] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingDep, setEditingDep] = useState(null);
  const [editingVente, setEditingVente] = useState(null);

  // Sync depuis finances.json au démarrage (+ migration localStorage → fichier)
  useEffect(() => {
    fetch("/api/finances")
      .then(r => r.ok ? r.json() : null)
      .then(fileData => {
        if (fileData) {
          setFinances(fileData);
          localStorage.setItem("financeData", JSON.stringify(fileData));
        } else {
          // Fichier absent : on pousse le localStorage vers le fichier
          const local = loadFinances();
          const hasData = local.depenses.length > 0 || local.ventes.length > 0;
          if (hasData) saveFinances(local);
        }
      })
      .catch(() => {});
  }, []);

  const totalEggsCollected = Object.values(data).reduce((a, b) => a + b, 0);
  const totalDepenses = finances.depenses.reduce((s, d) => s + d.amount, 0);
  const totalVentesMontant = finances.ventes.reduce((s, v) => s + v.montant, 0);
  const totalOeufsVendus = finances.ventes.reduce((s, v) => s + v.oeufs, 0);
  const benefice = totalVentesMontant - totalDepenses;
  const coutRevient =
    totalEggsCollected > 0 ? -benefice / totalEggsCollected : 0;

  function update(next) {
    setFinances(next);
    saveFinances(next);
  }

  // ── Dépenses ────────────────────────────────────────────────────────
  function addDepense() {
    const amount = parseFloat(depForm.amount) || 0;
    if (!depForm.name.trim() || !depForm.category || amount <= 0) return;
    const entry = {
      id: Date.now(),
      date: depForm.date,
      category: depForm.category,
      name: depForm.name.trim(),
      amount,
    };
    update({ ...finances, depenses: [entry, ...finances.depenses] });
    setDepForm((f) => ({ ...f, name: "", amount: "" }));
  }

  function deleteDepense(id) {
    update({
      ...finances,
      depenses: finances.depenses.filter((d) => d.id !== id),
    });
  }

  function saveEditDep() {
    const amount = parseFloat(editingDep.amount) || 0;
    if (!editingDep.name.trim() || !editingDep.category || amount <= 0) return;
    update({
      ...finances,
      depenses: finances.depenses.map((d) =>
        d.id === editingDep.id
          ? {
              ...d,
              date: editingDep.date,
              name: editingDep.name.trim(),
              category: editingDep.category,
              amount,
            }
          : d,
      ),
    });
    setEditingDep(null);
  }

  function addCategory() {
    const label = newCatLabel.trim();
    if (!label || finances.categories.includes(label)) return;
    update({ ...finances, categories: [...finances.categories, label] });
    setNewCatLabel("");
    setAddingCat(false);
  }

  function deleteCategory(cat) {
    update({
      ...finances,
      categories: finances.categories.filter((c) => c !== cat),
    });
  }

  // ── Ventes ──────────────────────────────────────────────────────────
  function addVente() {
    const oeufs = parseInt(venteForm.oeufs) || 0;
    const montant = parseFloat(venteForm.montant) || 0;
    if (oeufs <= 0 || montant <= 0) return;
    const entry = { id: Date.now(), date: venteForm.date, oeufs, montant };
    update({ ...finances, ventes: [entry, ...finances.ventes] });
    setVenteForm((f) => ({ ...f, oeufs: "", montant: "" }));
  }

  function deleteVente(id) {
    update({ ...finances, ventes: finances.ventes.filter((v) => v.id !== id) });
  }

  function saveEditVente() {
    const oeufs = parseInt(editingVente.oeufs) || 0;
    const montant = parseFloat(editingVente.montant) || 0;
    if (oeufs <= 0 || montant <= 0) return;
    update({
      ...finances,
      ventes: finances.ventes.map((v) =>
        v.id === editingVente.id
          ? { ...v, date: editingVente.date, oeufs, montant }
          : v,
      ),
    });
    setEditingVente(null);
  }

  const dateFr = (date) =>
    new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const CAT_EMOJI = { Poules: "🐔", Nourriture: "🌽", Matériel: "🚜" };
  const catEmoji = (cat) => CAT_EMOJI[cat] ?? "💸";

  const inputCls =
    "border border-[#e8ddd0] rounded-lg px-1.5 py-1 text-[11px] text-[#4a3320] outline-none focus:border-orange";

  // ── Menu 3 points ────────────────────────────────────────────────────
  function DotsMenu({ id, onEdit, onDelete }) {
    const open = openMenuId === id;
    return (
      <div className="relative shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(open ? null : id);
          }}
          className="text-[#9a7a5a] hover:text-[#4a3320] text-[18px] border-0 bg-transparent cursor-pointer px-1 leading-none"
        >
          ⋮
        </button>
        {open && (
          <div className="absolute right-0 top-6 bg-white rounded-xl shadow-lg z-20 py-1 w-32 border border-[#f0e6d3]">
            <button
              onClick={() => {
                onEdit();
                setOpenMenuId(null);
              }}
              className="w-full text-left px-3 py-1.5 text-[12px] font-bold text-[#4a3320] hover:bg-[#f0e6d3] border-0 bg-transparent cursor-pointer"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpenMenuId(null);
              }}
              className="w-full text-left px-3 py-1.5 text-[12px] font-bold text-[#c62828] hover:bg-[#fde8e8] border-0 bg-transparent cursor-pointer"
            >
              🗑 Supprimer
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 py-3 flex-1 overflow-y-auto pb-8">
      {/* Backdrop fermeture menu */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenuId(null)}
        />
      )}

      {/* Résumé */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-[18px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <div className="text-[11px] font-bold text-[#9a7a5a] mb-1">
            Bénéfice / Perte
          </div>
          <div
            className={`font-dancing text-[28px] leading-none ${benefice >= 0 ? "text-[#2e7d32]" : "text-[#c62828]"}`}
          >
            {benefice >= 0 ? "+" : ""}
            {fmt(benefice)}
          </div>
        </div>
        <div className="bg-white rounded-[18px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <div className="text-[11px] font-bold text-[#9a7a5a] mb-1">
            Coût / œuf récolté
          </div>
          <div className="font-dancing text-[28px] leading-none text-orange">
            {fmt(coutRevient)}
          </div>
          <div className="text-[10px] text-[#c4a882] mt-0.5">
            {totalEggsCollected} œufs récoltés
          </div>
        </div>
      </div>

      {/* Dépenses */}
      <div className="bg-white rounded-[18px] p-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold text-[#7a5c3a] text-[13px]">
            💸 Dépenses
          </div>
          <div className="font-bold text-[#c62828] text-[14px]">
            {fmt(totalDepenses)}
          </div>
        </div>

        <div className="flex gap-1.5 mb-2">
          <input
            type="date"
            value={depForm.date}
            onChange={(e) =>
              setDepForm((f) => ({ ...f, date: e.target.value }))
            }
            className="w-30 border border-[#e8ddd0] rounded-lg px-2 py-1.5 text-[12px] text-[#4a3320] outline-none focus:border-orange"
          />
          <input
            type="text"
            placeholder="Nom de la dépense"
            value={depForm.name}
            onChange={(e) =>
              setDepForm((f) => ({ ...f, name: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && addDepense()}
            className="flex-1 min-w-0 border border-[#e8ddd0] rounded-lg px-2 py-1.5 text-[12px] text-[#4a3320] outline-none focus:border-orange"
          />
        </div>
        <div className="flex gap-1.5 mb-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Montant"
            value={depForm.amount}
            onChange={(e) =>
              setDepForm((f) => ({ ...f, amount: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && addDepense()}
            className="flex-1 border border-[#e8ddd0] rounded-lg px-2 py-1.5 text-[12px] font-bold text-[#4a3320] outline-none focus:border-orange"
          />
          <span className="self-center text-[12px] text-[#9a7a5a]">€</span>
          <button
            onClick={addDepense}
            className="bg-[#fdebd0] text-orange border-0 rounded-[10px] px-4 py-1.5 text-[18px] font-bold cursor-pointer hover:bg-orange hover:text-white transition-all leading-none"
          >
            +
          </button>
        </div>

        {/* Catégories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {finances.categories.map((cat) => (
            <span
              key={cat}
              onClick={() =>
                setDepForm((f) => ({
                  ...f,
                  category: f.category === cat ? "" : cat,
                }))
              }
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold cursor-pointer transition-colors select-none ${
                depForm.category === cat
                  ? "bg-orange text-white"
                  : "bg-[#f0e6d3] text-[#7a5c3a] hover:bg-[#e8d8c0]"
              }`}
            >
              {cat}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCategory(cat);
                }}
                className="border-0 bg-transparent cursor-pointer p-0 text-[13px] leading-none opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
          {addingCat ? (
            <span className="flex items-center gap-1">
              <input
                autoFocus
                type="text"
                placeholder="Nom…"
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addCategory();
                  if (e.key === "Escape") {
                    setAddingCat(false);
                    setNewCatLabel("");
                  }
                }}
                className="w-24 border border-orange rounded-full px-2.5 py-0.5 text-[11px] outline-none"
              />
              <button
                onClick={addCategory}
                className="text-orange text-[13px] border-0 bg-transparent cursor-pointer font-bold"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setAddingCat(false);
                  setNewCatLabel("");
                }}
                className="text-[#9a7a5a] text-[13px] border-0 bg-transparent cursor-pointer"
              >
                ×
              </button>
            </span>
          ) : (
            <button
              onClick={() => setAddingCat(true)}
              className="text-orange border border-orange border-dashed rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-transparent cursor-pointer hover:bg-orange/10 transition-colors"
            >
              + Catégorie
            </button>
          )}
        </div>

        {/* Historique dépenses */}
        {finances.depenses.length > 0 && (
          <div className="border-t border-[#f0e6d3] pt-2 max-h-36 overflow-y-auto pr-1">
            {[...finances.depenses]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((d) => (
                <div
                  key={d.id}
                  className="py-2 border-b border-[#f0e6d3] last:border-b-0"
                >
                  {editingDep?.id === d.id ? (
                    <div>
                      <div className="flex gap-1 mb-1">
                        <input
                          type="date"
                          value={editingDep.date}
                          onChange={(e) =>
                            setEditingDep((f) => ({
                              ...f,
                              date: e.target.value,
                            }))
                          }
                          className={`w-30 ${inputCls}`}
                        />
                        <input
                          type="text"
                          value={editingDep.name}
                          onChange={(e) =>
                            setEditingDep((f) => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                          className={`flex-1 min-w-0 ${inputCls}`}
                        />
                      </div>
                      <div className="flex gap-1 items-center">
                        <select
                          value={editingDep.category}
                          onChange={(e) =>
                            setEditingDep((f) => ({
                              ...f,
                              category: e.target.value,
                            }))
                          }
                          className={`flex-1 ${inputCls} bg-white`}
                        >
                          <option value="">Catégorie…</option>
                          {finances.categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingDep.amount}
                          onChange={(e) =>
                            setEditingDep((f) => ({
                              ...f,
                              amount: e.target.value,
                            }))
                          }
                          className={`w-16 text-right ${inputCls}`}
                        />
                        <span className="text-[11px] text-[#9a7a5a]">€</span>
                        <button
                          onClick={saveEditDep}
                          className="text-[#2e7d32] font-bold text-[15px] border-0 bg-transparent cursor-pointer"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingDep(null)}
                          className="text-[#9a7a5a] text-[15px] border-0 bg-transparent cursor-pointer"
                        >
                          ✗
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[18px]">
                        {catEmoji(d.category)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-[#4a3320] truncate">
                          {d.name || d.category}
                        </div>
                        <div className="text-[10px] text-[#9a7a5a]">
                          {d.category} · {dateFr(d.date)}
                        </div>
                      </div>
                      <div className="font-bold text-[#c62828] text-[13px]">
                        {fmt(d.amount)}
                      </div>
                      <DotsMenu
                        id={d.id}
                        onEdit={() =>
                          setEditingDep({
                            id: d.id,
                            date: d.date,
                            name: d.name || "",
                            category: d.category,
                            amount: String(d.amount),
                          })
                        }
                        onDelete={() => deleteDepense(d.id)}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Ventes */}
      <div className="bg-white rounded-[18px] p-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-[#7a5c3a] text-[13px]">
            🧾 Ventes d'œufs
          </div>
          <div className="font-bold text-[#2e7d32] text-[14px]">
            {fmt(totalVentesMontant)}
          </div>
        </div>
        <div className="text-[11px] text-[#9a7a5a] mb-3">
          {totalOeufsVendus} œuf{totalOeufsVendus !== 1 ? "s" : ""} vendu
          {totalOeufsVendus !== 1 ? "s" : ""} sur {totalEggsCollected} récoltés
        </div>

        <input
          type="date"
          value={venteForm.date}
          onChange={(e) =>
            setVenteForm((f) => ({ ...f, date: e.target.value }))
          }
          className="w-full border border-[#e8ddd0] rounded-lg px-2 py-1.5 text-[12px] text-[#4a3320] outline-none focus:border-orange mb-2"
        />
        <div className="flex gap-1.5 mb-2">
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Nb œufs"
            value={venteForm.oeufs}
            onChange={(e) =>
              setVenteForm((f) => ({ ...f, oeufs: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && addVente()}
            className="flex-1 min-w-0 border border-[#e8ddd0] rounded-lg px-2 py-2 text-[12px] font-bold text-[#4a3320] outline-none focus:border-orange"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Montant €"
            value={venteForm.montant}
            onChange={(e) =>
              setVenteForm((f) => ({ ...f, montant: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && addVente()}
            className="flex-1 min-w-0 border border-[#e8ddd0] rounded-lg px-2 py-2 text-[12px] font-bold text-[#4a3320] outline-none focus:border-orange"
          />
          <button
            onClick={addVente}
            className="shrink-0 bg-[#e8f5e9] text-[#2e7d32] border-0 rounded-lg px-3 py-2 text-[18px] font-bold cursor-pointer hover:bg-[#2e7d32] hover:text-white transition-all leading-none"
          >
            +
          </button>
        </div>

        {finances.ventes.length > 0 && (
          <div className="border-t border-[#f0e6d3] pt-2 max-h-36 overflow-y-auto pr-1">
            {[...finances.ventes]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((v) => (
                <div
                  key={v.id}
                  className="py-2 border-b border-[#f0e6d3] last:border-b-0"
                >
                  {editingVente?.id === v.id ? (
                    <div>
                      <input
                        type="date"
                        value={editingVente.date}
                        onChange={(e) =>
                          setEditingVente((f) => ({
                            ...f,
                            date: e.target.value,
                          }))
                        }
                        className={`w-full ${inputCls} mb-1`}
                      />
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Nb œufs"
                          value={editingVente.oeufs}
                          onChange={(e) =>
                            setEditingVente((f) => ({
                              ...f,
                              oeufs: e.target.value,
                            }))
                          }
                          className={`flex-1 ${inputCls}`}
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Montant"
                          value={editingVente.montant}
                          onChange={(e) =>
                            setEditingVente((f) => ({
                              ...f,
                              montant: e.target.value,
                            }))
                          }
                          className={`flex-1 ${inputCls}`}
                        />
                        <span className="text-[11px] text-[#9a7a5a]">€</span>
                        <button
                          onClick={saveEditVente}
                          className="text-[#2e7d32] font-bold text-[15px] border-0 bg-transparent cursor-pointer"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingVente(null)}
                          className="text-[#9a7a5a] text-[15px] border-0 bg-transparent cursor-pointer"
                        >
                          ✗
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[20px]">🥚</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-[#4a3320]">
                          {v.oeufs} œuf{v.oeufs !== 1 ? "s" : ""}
                        </div>
                        <div className="text-[10px] text-[#9a7a5a]">
                          {dateFr(v.date)}
                        </div>
                      </div>
                      <div className="font-bold text-[#2e7d32] text-[13px]">
                        {fmt(v.montant)}
                      </div>
                      <DotsMenu
                        id={v.id}
                        onEdit={() =>
                          setEditingVente({
                            id: v.id,
                            date: v.date,
                            oeufs: String(v.oeufs),
                            montant: String(v.montant),
                          })
                        }
                        onDelete={() => deleteVente(v.id)}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
