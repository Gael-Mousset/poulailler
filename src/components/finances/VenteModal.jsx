import { useState } from "react";
import { Modal, BtnRow, Label, iCls } from "./Modal";

export default function VenteModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSave() {
    const oeufs = parseInt(form.oeufs) || 0;
    const montant = parseFloat(form.montant) || 0;
    if (oeufs <= 0 || montant <= 0) return;
    onSave({ ...form, oeufs, montant });
  }

  const isAdd = form.mode === "add";

  return (
    <Modal
      title={isAdd ? "Nouvelle vente" : "Modifier la vente"}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>
          <Label>Date</Label>
          <input type="date" value={form.date} onChange={set("date")} className={iCls} />
        </div>
        <div>
          <Label>Nombre d'œufs</Label>
          <input
            autoFocus
            type="number"
            min="1"
            step="1"
            placeholder="12"
            value={form.oeufs}
            onChange={set("oeufs")}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className={iCls}
          />
        </div>
        <div>
          <Label>Montant</Label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={form.montant}
              onChange={set("montant")}
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
          green
        />
      </div>
    </Modal>
  );
}
