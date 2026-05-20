export const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";

export const iCls =
  "w-full border-2 border-[#e8ddd0] rounded-xl px-4 py-3 text-[14px] text-[#4a3320] outline-none focus:border-orange bg-white font-semibold";

export function Label({ children }) {
  return (
    <div className="text-[11px] font-bold text-[#9a7a5a] uppercase tracking-wide mb-1">
      {children}
    </div>
  );
}

export function Modal({ title, onClose, children, zClass = "z-50" }) {
  return (
    <div className={`fixed inset-0 ${zClass} flex items-end justify-center`}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl px-5 pt-6 pb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#4a3320] text-[17px]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0e6d3] text-[#7a5c3a] font-bold text-[13px] border-0 cursor-pointer hover:bg-[#e8d8c0]"
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ActionSheet({ label, onEdit, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg px-4 pb-6 animate-slide-up">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-3">
          {label && (
            <div className="px-5 py-3.5 border-b border-[#f0e6d3]">
              <div className="text-[12px] font-bold text-[#9a7a5a] text-center truncate">{label}</div>
            </div>
          )}
          <button
            onClick={() => { onEdit(); onClose(); }}
            className="w-full px-5 py-4 text-[15px] font-bold text-[#4a3320] border-b border-[#f0e6d3] bg-white hover:bg-[#f9f4ee] cursor-pointer border-x-0 border-t-0 text-left flex items-center gap-3 transition-colors"
          >
            <span className="text-[20px]">✏️</span> Modifier
          </button>
          <button
            onClick={() => { onDelete(); onClose(); }}
            className="w-full px-5 py-4 text-[15px] font-bold text-[#c62828] bg-white hover:bg-[#fde8e8] cursor-pointer border-0 text-left flex items-center gap-3 transition-colors"
          >
            <span className="text-[20px]">🗑</span> Supprimer
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-white text-[#4a3320] font-extrabold text-[15px] border-0 cursor-pointer shadow-lg hover:bg-[#f9f4ee] transition-colors"
        >Annuler</button>
      </div>
    </div>
  );
}

export function BtnRow({ onCancel, onSubmit, label, green = false }) {
  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={onCancel}
        className="flex-1 py-3 rounded-2xl bg-[#f0e6d3] text-[#7a5c3a] font-bold text-[14px] border-0 cursor-pointer hover:bg-[#e8d8c0] transition-colors"
      >Annuler</button>
      <button
        onClick={onSubmit}
        className={`flex-1 py-3 rounded-2xl font-extrabold text-[14px] border-0 cursor-pointer active:scale-[0.97] transition-all ${
          green
            ? "bg-linear-to-br from-[#2e7d32] to-[#4caf50] text-white shadow-[0_4px_12px_rgba(46,125,50,0.3)]"
            : "bg-linear-to-br from-orange to-honey text-white shadow-[0_4px_12px_rgba(240,123,40,0.35)]"
        }`}
      >{label}</button>
    </div>
  );
}
