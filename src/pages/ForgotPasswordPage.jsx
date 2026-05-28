import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-107.5 mx-auto min-h-dvh flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🐔</div>
          <h1 className="font-dancing text-3xl text-orange font-bold">Le Poulailler</h1>
          <p className="text-[#9a7a5a] text-sm mt-1 font-nunito">Réinitialiser le mot de passe</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {sent ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="text-4xl">📬</div>
              <p className="text-sm text-[#6b5a47] font-nunito">
                Si cet email est enregistré, un lien de réinitialisation a été envoyé.
              </p>
              <Link to="/login" className="text-orange font-bold text-sm hover:underline">
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <p className="text-sm text-[#9a7a5a] font-nunito">
                Entrez votre email pour recevoir un lien de réinitialisation.
              </p>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#9a7a5a] uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  required
                  className="border-2 border-[#e8ddd0] rounded-xl px-4 py-3 text-sm font-nunito outline-none focus:border-orange transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-orange text-white font-bold rounded-xl py-3 text-sm transition-opacity disabled:opacity-60 active:opacity-80"
              >
                {loading ? "Envoi…" : "Envoyer le lien"}
              </button>

              <Link to="/login" className="text-center text-xs text-orange font-semibold hover:underline">
                ← Retour à la connexion
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
