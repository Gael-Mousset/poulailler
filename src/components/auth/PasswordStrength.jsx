import { useState } from "react";

const RULES = [
  { id: "len",     label: "Au moins 8 caractères",          test: p => p.length >= 8 },
  { id: "upper",   label: "Une lettre majuscule (A-Z)",      test: p => /[A-Z]/.test(p) },
  { id: "lower",   label: "Une lettre minuscule (a-z)",      test: p => /[a-z]/.test(p) },
  { id: "digit",   label: "Un chiffre (0-9)",                test: p => /\d/.test(p) },
  { id: "special", label: "Un caractère spécial (!@#$…)",    test: p => /[^A-Za-z0-9]/.test(p) },
];

const LEVELS = [
  { label: "Très faible", color: "#ef4444", bg: "bg-red-500"    },
  { label: "Faible",      color: "#f97316", bg: "bg-orange-500" },
  { label: "Moyen",       color: "#eab308", bg: "bg-yellow-500" },
  { label: "Fort",        color: "#84cc16", bg: "bg-lime-500"   },
  { label: "Très fort",   color: "#22c55e", bg: "bg-green-500"  },
];

export function getScore(password) {
  return RULES.filter(r => r.test(password)).length;
}

export default function PasswordStrength({ password }) {
  const [showRules, setShowRules] = useState(false);

  if (!password) return null;

  const score = getScore(password);
  const level = LEVELS[score - 1] ?? LEVELS[0];

  return (
    <div className="flex flex-col gap-2">
      {/* Jauge */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {LEVELS.map((l, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < score ? l.bg : "bg-[#e8ddd0]"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold" style={{ color: level.color }}>
            {level.label}
          </span>
          <button
            type="button"
            onClick={() => setShowRules(s => !s)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-colors ${
              showRules
                ? "border-orange bg-orange text-white"
                : "border-[#c8a87a] text-[#c8a87a] hover:border-orange hover:text-orange"
            }`}
            aria-label="Voir les règles du mot de passe"
          >
            i
          </button>
        </div>
      </div>

      {/* Règles */}
      {showRules && (
        <div className="bg-[#fdf8f0] border border-[#e8ddd0] rounded-xl p-3 flex flex-col gap-1.5 animate-slide-up">
          {RULES.map(rule => {
            const ok = rule.test(password);
            return (
              <div key={rule.id} className="flex items-center gap-2 text-xs">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                  ok ? "bg-green-500 text-white" : "bg-[#e8ddd0] text-[#b8a898]"
                }`}>
                  {ok ? "✓" : "✗"}
                </span>
                <span className={ok ? "text-green-700 font-semibold" : "text-[#9a7a5a]"}>
                  {rule.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
