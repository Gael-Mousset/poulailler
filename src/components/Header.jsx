import { useAuth } from "../context/AuthContext";

export default function Header({ grandTotal }) {
  const { email, logout } = useAuth();

  return (
    <div className="bg-linear-to-br from-honey to-orange px-5 pt-7 pb-5 rounded-b-4xl shadow-[0_6px_24px_rgba(240,123,40,0.28)] animate-sunrise text-center relative">
      <button
        onClick={logout}
        className="absolute top-4 right-4 text-white/70 text-xs font-semibold hover:text-white transition-colors"
        title={email}
      >
        Déconnexion
      </button>
      <div className="text-[44px] leading-none mb-1">🐔</div>
      <h1 className="font-dancing text-[28px] text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.15)]">
        Le Poulailler
      </h1>
      <div className="text-white/85 text-[13px] font-semibold mt-0.5">
        Suivi de ponte quotidien
      </div>
      <div className="inline-block mt-2.5 bg-white/25 text-white py-1.25 px-4 rounded-full text-[13px] font-bold">
        🥚 {grandTotal} œuf{grandTotal > 1 ? "s" : ""} au total
      </div>
    </div>
  );
}
