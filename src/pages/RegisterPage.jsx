import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/auth/PasswordInput";
import PasswordStrength, { getScore } from "../components/auth/PasswordStrength";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email) { setError("L'adresse email est requise"); return; }
    if (!password) { setError("Le mot de passe est requis"); return; }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères");
      return;
    }
    if (getScore(password) < 3) {
      setError("Le mot de passe est trop faible — ajoute majuscules, chiffres ou symboles");
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-107.5 mx-auto min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🐔</div>
          <h1 className="font-dancing text-3xl text-orange font-bold">Le Poulailler</h1>
          <p className="text-[#9a7a5a] text-sm mt-1 font-nunito">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#9a7a5a] uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              className="border-2 border-[#e8ddd0] rounded-xl px-4 py-3 text-sm font-nunito outline-none focus:border-orange transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#9a7a5a] uppercase tracking-wide">Mot de passe</label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              name="new-password"
            />
            <PasswordStrength password={password} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#9a7a5a] uppercase tracking-wide">Confirmer</label>
            <PasswordInput
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              name="confirm"
              required
            />
            {confirm && confirm !== password && (
              <p className="text-xs text-red-500 font-semibold mt-0.5">
                Les mots de passe ne correspondent pas
              </p>
            )}
            {confirm && confirm === password && password.length > 0 && (
              <p className="text-xs text-green-600 font-semibold mt-0.5">
                ✓ Les mots de passe correspondent
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange text-white font-bold rounded-xl py-3 text-sm transition-opacity disabled:opacity-60 active:opacity-80"
          >
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-[#9a7a5a] mt-4 font-nunito">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-orange font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
