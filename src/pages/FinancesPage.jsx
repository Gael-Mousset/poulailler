import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { todayStr } from "../utils/storage";
import { depenses as depensesApi, ventes as ventesApi, categories as categoriesApi } from "../services/api";
import { fmt, ActionSheet } from "../components/finances/Modal";
import DepModal from "../components/finances/DepModal";
import VenteModal from "../components/finances/VenteModal";

const CAT_EMOJI = { Poules: "🐔", Nourriture: "🌽", Matériel: "🚜" };
const catEmoji = (cat) => CAT_EMOJI[cat] ?? "💸";
const dateFr = (date) =>
  new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });

export default function FinancesPage() {
  const { data } = useOutletContext();
  const [finances, setFinances] = useState({ categories: [], depenses: [], ventes: [] });
  const [loading, setLoading] = useState(true);
  const [actionSheet, setActionSheet] = useState(null);
  const [depModal, setDepModal] = useState(null);
  const [venteModal, setVenteModal] = useState(null);
  const [filterCat, setFilterCat] = useState(null);

  useEffect(() => {
    Promise.all([categoriesApi.getAll(), depensesApi.getAll(), ventesApi.getAll()])
      .then(([cats, deps, vts]) => setFinances({ categories: cats, depenses: deps, ventes: vts }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalEggsCollected = Object.values(data).reduce((a, b) => a + b, 0);
  const totalDepenses      = finances.depenses.reduce((s, d) => s + d.amount, 0);
  const totalVentesMontant = finances.ventes.reduce((s, v) => s + v.montant, 0);
  const totalOeufsVendus   = finances.ventes.reduce((s, v) => s + v.oeufs, 0);
  const benefice    = totalVentesMontant - totalDepenses;
  const coutRevient = totalEggsCollected > 0 ? -benefice / totalEggsCollected : 0;

  // ── Dépenses ─────────────────────────────────────────────────
  async function saveDep(dto) {
    if (dto.mode === "add") {
      try {
        const entry = await depensesApi.create(dto);
        setFinances((f) => ({ ...f, depenses: [entry, ...f.depenses] }));
        setDepModal(null);
      } catch {}
    } else {
      setFinances((f) => ({
        ...f,
        depenses: f.depenses.map((d) => d._id === dto.id ? { ...d, ...dto } : d),
      }));
      setDepModal(null);
      depensesApi.update(dto.id, dto).catch(() => {});
    }
  }

  function deleteDep(id) {
    setFinances((f) => ({ ...f, depenses: f.depenses.filter((d) => d._id !== id) }));
    depensesApi.remove(id).catch(() => {});
  }

  // ── Ventes ───────────────────────────────────────────────────
  async function saveVente(dto) {
    if (dto.mode === "add") {
      try {
        const entry = await ventesApi.create(dto);
        setFinances((f) => ({ ...f, ventes: [entry, ...f.ventes] }));
        setVenteModal(null);
      } catch {}
    } else {
      setFinances((f) => ({
        ...f,
        ventes: f.ventes.map((v) => v._id === dto.id ? { ...v, ...dto } : v),
      }));
      setVenteModal(null);
      ventesApi.update(dto.id, dto).catch(() => {});
    }
  }

  function deleteVente(id) {
    setFinances((f) => ({ ...f, ventes: f.ventes.filter((v) => v._id !== id) }));
    ventesApi.remove(id).catch(() => {});
  }

  function deleteCategory(id) {
    setFinances((f) => ({ ...f, categories: f.categories.filter((c) => c.id !== id) }));
    categoriesApi.remove(id).catch(() => {});
  }

  function DotsBtn({ label, onEdit, onDelete }) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setActionSheet({ label, onEdit, onDelete }); }}
        className="text-[#9a7a5a] hover:text-[#4a3320] text-[20px] border-0 bg-transparent cursor-pointer px-1 leading-none shrink-0"
      >⋮</button>
    );
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-[#9a7a5a] text-sm">Chargement…</div>;
  }

  return (
    <div className="px-4 py-3 flex-1 overflow-y-auto pb-8">

      {actionSheet && (
        <ActionSheet {...actionSheet} onClose={() => setActionSheet(null)} />
      )}

      {depModal && (
        <DepModal
          initial={depModal}
          categories={finances.categories}
          onClose={() => setDepModal(null)}
          onSave={saveDep}
          onCategoryCreated={(entry) =>
            setFinances((f) => ({ ...f, categories: [...f.categories, entry] }))
          }
        />
      )}

      {venteModal && (
        <VenteModal
          initial={venteModal}
          onClose={() => setVenteModal(null)}
          onSave={saveVente}
        />
      )}

      {/* ── Résumé ── */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-[18px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <div className="text-[11px] font-bold text-[#9a7a5a] mb-1">Bénéfice / Perte</div>
          <div className={`font-dancing text-[28px] leading-none ${benefice >= 0 ? "text-[#2e7d32]" : "text-[#c62828]"}`}>
            {benefice >= 0 ? "+" : ""}{fmt(benefice)}
          </div>
        </div>
        <div className="bg-white rounded-[18px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <div className="text-[11px] font-bold text-[#9a7a5a] mb-1">Coût / œuf récolté</div>
          <div className="font-dancing text-[28px] leading-none text-orange">{fmt(coutRevient)}</div>
          <div className="text-[10px] text-[#c4a882] mt-0.5">{totalEggsCollected} œufs récoltés</div>
        </div>
      </div>

      {/* ── Dépenses ── */}
      <div className="bg-white rounded-[18px] p-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold text-[#7a5c3a] text-[13px]">💸 Dépenses</div>
          <div className="flex items-center gap-2">
            <div className="font-bold text-[#c62828] text-[14px]">{fmt(totalDepenses)}</div>
            <button
              onClick={() => setDepModal({ mode: "add", date: todayStr(), name: "", category: "", amount: "" })}
              className="bg-[#fdebd0] text-orange border-0 rounded-[10px] px-3 py-1 text-[12px] font-bold cursor-pointer hover:bg-orange hover:text-white transition-all"
            >+ Ajouter</button>
          </div>
        </div>

        {finances.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {finances.categories.map((cat) => (
              <span
                key={cat.id}
                onClick={() => setFilterCat((f) => f === cat.name ? null : cat.name)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold cursor-pointer select-none transition-colors ${
                  filterCat === cat.name
                    ? "bg-orange text-white shadow-[0_2px_6px_rgba(240,123,40,0.3)]"
                    : "bg-[#f0e6d3] text-[#7a5c3a] hover:bg-[#e8d8c0]"
                }`}
              >{cat.name}</span>
            ))}
          </div>
        )}

        {finances.depenses.length > 0 && (
          <div className="border-t border-[#f0e6d3] pt-2 max-h-52 overflow-y-auto pr-1">
            {[...finances.depenses]
              .filter((d) => !filterCat || d.category === filterCat)
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((d) => (
                <div key={d._id} className="flex items-center gap-2 py-2 border-b border-[#f0e6d3] last:border-b-0">
                  <span className="text-[18px]">{catEmoji(d.category)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-[#4a3320] truncate">{d.name || d.category}</div>
                    <div className="text-[10px] text-[#9a7a5a]">{d.category} · {dateFr(d.date)}</div>
                  </div>
                  <div className="font-bold text-[#c62828] text-[13px]">{fmt(d.amount)}</div>
                  <DotsBtn
                    label={`${d.name || d.category} — ${fmt(d.amount)}`}
                    onEdit={() => setDepModal({ mode: "edit", id: d._id, date: d.date, name: d.name || "", category: d.category, amount: String(d.amount) })}
                    onDelete={() => deleteDep(d._id)}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ── Ventes ── */}
      <div className="bg-white rounded-[18px] p-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-[#7a5c3a] text-[13px]">🧾 Ventes d'œufs</div>
          <div className="flex items-center gap-2">
            <div className="font-bold text-[#2e7d32] text-[14px]">{fmt(totalVentesMontant)}</div>
            <button
              onClick={() => setVenteModal({ mode: "add", date: todayStr(), oeufs: "", montant: "" })}
              className="bg-[#e8f5e9] text-[#2e7d32] border-0 rounded-[10px] px-3 py-1 text-[12px] font-bold cursor-pointer hover:bg-[#2e7d32] hover:text-white transition-all"
            >+ Ajouter</button>
          </div>
        </div>
        <div className="text-[11px] text-[#9a7a5a] mb-3">
          {totalOeufsVendus} œuf{totalOeufsVendus !== 1 ? "s" : ""} vendu{totalOeufsVendus !== 1 ? "s" : ""} sur {totalEggsCollected} récoltés
        </div>

        {finances.ventes.length > 0 && (
          <div className="border-t border-[#f0e6d3] pt-2 max-h-52 overflow-y-auto pr-1">
            {[...finances.ventes]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((v) => (
                <div key={v._id} className="flex items-center gap-2 py-2 border-b border-[#f0e6d3] last:border-b-0">
                  <span className="text-[20px]">🥚</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-[#4a3320]">{v.oeufs} œuf{v.oeufs !== 1 ? "s" : ""}</div>
                    <div className="text-[10px] text-[#9a7a5a]">{dateFr(v.date)}</div>
                  </div>
                  <div className="font-bold text-[#2e7d32] text-[13px]">{fmt(v.montant)}</div>
                  <DotsBtn
                    label={`${v.oeufs} œufs — ${fmt(v.montant)}`}
                    onEdit={() => setVenteModal({ mode: "edit", id: v._id, date: v.date, oeufs: String(v.oeufs), montant: String(v.montant) })}
                    onDelete={() => deleteVente(v._id)}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
