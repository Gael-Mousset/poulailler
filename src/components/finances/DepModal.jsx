import { useState } from "react";
import { categories as categoriesApi } from "../../services/api";
import { Modal, BtnRow, Label, iCls } from "./Modal";

export default function DepModal({ initial, categories: initCats, onClose, onSave, onCategoryCreated }) {
  const [form, setForm] = useState(initial);
  const [cats, setCats] = useState(initCats);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function addCat() {
    const name = newCatName.trim();
    if (!name || cats.some((c) => c.name === name)) return;
    try {
      const entry = await categoriesApi.create(name);
      setCats((c) => [...c, entry]);
      setForm((f) => ({ ...f, category: name }));
      onCategoryCreated(entry);
      setNewCatName("");
      setShowNewCat(false);
    } catch {}
  }

  function handleSave() {
    const amount = parseFloat(form.amount) || 0;
    if (!form.name.trim() || !form.category || amount <= 0) return;
    onSave({ ...form, amount, name: form.name.trim() });
  }

  const isAdd = form.mode === "add";

  return (
    <>
      <Modal
        title={isAdd ? "Nouvelle dépense" : "Modifier la dépense"}
        onClose={onClose}
      >
        <div className="flex flex-col gap-3">
          <div>
            <Label>Date</Label>
            <input type="date" value={form.date} onChange={set("date")} className={iCls} />
          </div>
          <div>
            <Label>Nom</Label>
            <input
              autoFocus
              type="text"
              placeholder="Ex. Grains, Vétérinaire…"
              value={form.name}
              onChange={set("name")}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className={iCls}
            />
          </div>
          <div>
            <Label>Catégorie</Label>
            <div className="flex flex-wrap gap-2">
              {cats.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setForm((f) => ({ ...f, category: f.category === cat.name ? "" : cat.name }))
                  }
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold border-0 cursor-pointer transition-colors ${
                    form.category === cat.name
                      ? "bg-orange text-white shadow-[0_2px_8px_rgba(240,123,40,0.3)]"
                      : "bg-[#f0e6d3] text-[#7a5c3a] hover:bg-[#e8d8c0]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              <button
                onClick={() => setShowNewCat(true)}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-bold border border-dashed border-orange text-orange bg-transparent cursor-pointer hover:bg-orange/10 transition-colors"
              >+ Nouvelle</button>
            </div>
          </div>
          <div>
            <Label>Montant</Label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={set("amount")}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className={iCls + " pr-10"}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a7a5a] font-bold">€</span>
            </div>
          </div>
          <BtnRow
            onCancel={onClose}
            onSubmit={handleSave}
            label={isAdd ? "Ajouter" : "Enregistrer"}
          />
        </div>
      </Modal>

      {showNewCat && (
        <Modal
          title="Nouvelle catégorie"
          onClose={() => { setShowNewCat(false); setNewCatName(""); }}
          zClass="z-60"
        >
          <div className="flex flex-col gap-3">
            <div>
              <Label>Nom</Label>
              <input
                autoFocus
                type="text"
                placeholder="Ex. Vétérinaire, Eau…"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addCat();
                  if (e.key === "Escape") { setShowNewCat(false); setNewCatName(""); }
                }}
                className={iCls}
              />
            </div>
            <BtnRow
              onCancel={() => { setShowNewCat(false); setNewCatName(""); }}
              onSubmit={addCat}
              label="Ajouter"
            />
          </div>
        </Modal>
      )}
    </>
  );
}
