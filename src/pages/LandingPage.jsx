import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { id: "app", label: "L'Application" },
  { id: "start", label: "Commencer" },
  { id: "about", label: "À propos" },
];

// ── Onglet 1 ─────────────────────────────────────────────────────────────────

function TabApp() {
  const features = [
    {
      icon: "🥚",
      title: "Saisie rapide",
      desc: "Comptez vos œufs du jour en quelques secondes avec le compteur animé.",
    },
    {
      icon: "📊",
      title: "Historique complet",
      desc: "Visualisez chaque journée de ponte et suivez l'évolution de votre production.",
    },
    {
      icon: "💰",
      title: "Suivi financier",
      desc: "Enregistrez dépenses et ventes d'œufs, organisées par catégories personnalisées.",
    },
    {
      icon: "🔐",
      title: "Compte personnel",
      desc: "Vos données vous appartiennent — chaque compte est strictement privé.",
    },
    {
      icon: "📱",
      title: "Installable",
      desc: "Ajoutez l'appli sur votre écran d'accueil comme une vraie app native (PWA).",
    },
    {
      icon: "☁️",
      title: "Synchronisé",
      desc: "Vos données sont sauvegardées en ligne et accessibles depuis n'importe quel appareil.",
    },
  ];

  const values = [
    {
      icon: "🌱",
      label: "Simple",
      text: "Pensé pour être utilisé sur le terrain, pas derrière un bureau.",
    },
    {
      icon: "🔓",
      label: "Gratuit",
      text: "Accès complet sans abonnement ni publicité.",
    },
    {
      icon: "🛡️",
      label: "Privé",
      text: "Aucune revente de données. Votre poulailler, vos données.",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <div className="text-center py-4">
        {/* <div className="text-6xl mb-3">🐔</div> */}
        <h2 className="font-dancing text-4xl text-orange font-bold mb-2">
          Le Poulailler
        </h2>
        <p className="text-[#6b5a47] font-nunito text-base max-w-xs mx-auto leading-relaxed">
          Votre compagnon numérique pour ne jamais perdre le fil de votre
          élevage.
        </p>
      </div>

      {/* Fonctionnalités */}
      <div>
        <h3 className="text-xs font-black text-[#9a7a5a] uppercase tracking-widest mb-5 text-center">
          Fonctionnalités
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1.5"
            >
              <span className="text-2xl">{f.icon}</span>
              <span className="font-bold text-sm text-[#4a3728]">
                {f.title}
              </span>
              <span className="text-xs text-[#9a7a5a] leading-relaxed">
                {f.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Valeurs */}
      <div>
        <h3 className="text-xs font-black text-[#9a7a5a] uppercase tracking-widest mb-5 text-center">
          Nos valeurs
        </h3>
        <div className="flex flex-col gap-3">
          {values.map((v) => (
            <div
              key={v.label}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-start gap-4"
            >
              <span className="text-2xl flex-shrink-0">{v.icon}</span>
              <div>
                <div className="font-bold text-[#4a3728] text-sm mb-0.5">
                  {v.label}
                </div>
                <div className="text-xs text-[#9a7a5a] leading-relaxed">
                  {v.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Onglet 2 ─────────────────────────────────────────────────────────────────

function TabStart() {
  const steps = [
    {
      n: "1",
      title: "Créer un compte",
      desc: "Inscrivez-vous gratuitement en 30 secondes.",
    },
    {
      n: "2",
      title: "Saisir votre première collecte",
      desc: "Ouvrez l'app, ajustez le compteur, validez.",
    },
    {
      n: "3",
      title: "Suivre votre activité",
      desc: "Consultez l'historique et vos finances à tout moment.",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Étapes */}
      <div>
        <h3 className="text-xs font-black text-[#9a7a5a] uppercase tracking-widest mb-5 text-center">
          Comment démarrer
        </h3>
        <div className="flex flex-col gap-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {s.n}
              </div>
              <div>
                <div className="font-bold text-[#4a3728] text-sm mb-0.5">
                  {s.title}
                </div>
                <div className="text-xs text-[#9a7a5a]">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-[#9a7a5a] uppercase tracking-widest mb-1 text-center">
          Accéder à l'application
        </h3>
        <Link
          to="/register"
          className="bg-orange text-white font-bold rounded-2xl py-4 text-center text-sm shadow-[0_4px_16px_rgba(240,123,40,0.35)] active:opacity-80"
        >
          🐣 Créer un compte gratuit
        </Link>
        <Link
          to="/login"
          className="bg-white text-orange font-bold rounded-2xl py-4 text-center text-sm border-2 border-orange active:opacity-80"
        >
          Se connecter
        </Link>
      </div>

      {/* Téléchargement */}
      <div>
        <h3 className="text-xs font-black text-[#9a7a5a] uppercase tracking-widest mb-4 text-center">
          Installer l'application
        </h3>

        <div className="flex flex-col gap-3">
          {/* PWA mobile */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📱</span>
              <div>
                <div className="font-bold text-sm text-[#4a3728]">
                  Sur mobile
                </div>
                <div className="text-xs text-[#9a7a5a]">iOS & Android</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs text-[#6b5a47]">
              <p>
                <span className="text-orange font-bold">iPhone </span>
                Ouvrir dans Safari → icône Partager → « Sur l'écran d'accueil »
              </p>
              <p>
                <span className="text-orange font-bold">Android </span>
                Ouvrir dans Chrome → menu ⋮ → « Ajouter à l'écran d'accueil »
              </p>
            </div>
          </div>

          {/* Web */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💻</span>
              <div>
                <div className="font-bold text-sm text-[#4a3728]">
                  Sur ordinateur
                </div>
                <div className="text-xs text-[#9a7a5a]">Chrome / Edge</div>
              </div>
            </div>
            <p className="text-xs text-[#6b5a47]">
              Cliquez sur l'icône d'installation dans la barre d'adresse pour
              épingler l'app en mode hors-ligne.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Onglet 3 ─────────────────────────────────────────────────────────────────

function TabAbout() {
  return (
    <div className="flex flex-col gap-8">
      {/* Profil */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-honey to-orange flex items-center justify-center text-4xl shadow-md">
          👨‍💻
        </div>
        <div>
          <h3 className="font-dancing text-2xl text-orange font-bold">
            Gaël Mousset
          </h3>
          <p className="text-xs text-[#9a7a5a] font-semibold uppercase tracking-wide mt-0.5">
            Développeur Full-Stack
          </p>
        </div>
        <p className="text-sm text-[#6b5a47] leading-relaxed">
          Passionné par la création d'outils utiles du quotidien, je développe
          Le Poulailler pour centraliser la gestion de mon propre élevage — et
          le partager avec d'autres amoureux des poules.
        </p>
        <div className="flex gap-3 mt-1">
          <span className="bg-[#fdf3e8] text-orange text-xs font-bold px-3 py-1.5 rounded-full">
            React
          </span>
          <span className="bg-[#fdf3e8] text-orange text-xs font-bold px-3 py-1.5 rounded-full">
            NestJS
          </span>
          <span className="bg-[#fdf3e8] text-orange text-xs font-bold px-3 py-1.5 rounded-full">
            MongoDB
          </span>
        </div>
      </div>

      {/* Mentions légales */}
      <div>
        <h3 className="text-xs font-black text-[#9a7a5a] uppercase tracking-widest mb-4 text-center">
          Mentions légales
        </h3>
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-sm text-[#4a3728] mb-2">Éditeur</h4>
            <p className="text-xs text-[#6b5a47] leading-relaxed">
              Le Poulailler est un projet personnel développé par Gaël Mousset.
              <br />
              Application non commerciale à usage privé et communautaire.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-sm text-[#4a3728] mb-2">
              Hébergement
            </h4>
            <p className="text-xs text-[#6b5a47] leading-relaxed">
              L'application est auto-hébergée via Docker sur un VPS personnel.
              <br />
              Nom de domaine :{" "}
              <span className="font-mono text-orange">
                monpoulailler.duckdns.org
              </span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-sm text-[#4a3728] mb-2">
              Données personnelles
            </h4>
            <p className="text-xs text-[#6b5a47] leading-relaxed">
              Seules votre adresse email et vos données d'élevage sont
              collectées. Aucune donnée n'est revendue ni partagée avec des
              tiers. Vous pouvez demander la suppression de votre compte à tout
              moment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-sm text-[#4a3728] mb-3">Contact</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#6b5a47]">
              <a
                href="mailto:gaelmousset@orange.fr"
                className="flex items-center gap-2 hover:text-orange transition-colors"
              >
                <span>✉️</span>
                <span>gaelmousset@orange.fr</span>
              </a>
              <a
                href="tel:+33685657325"
                className="flex items-center gap-2 hover:text-orange transition-colors"
              >
                <span>📞</span>
                <span>06 85 65 73 25</span>
              </a>
              <a
                href="https://github.com/Gael-Mousset"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange transition-colors"
              >
                <span>🐙</span>
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/gael-mousset/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange transition-colors"
              >
                <span>💼</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <p className="text-center text-[10px] text-[#b8a898] mt-2">
            © {new Date().getFullYear()} Le Poulailler — Gaël Mousset. Tous
            droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("app");

  useEffect(() => {
    if (isAuth) navigate("/app", { replace: true });
  }, [isAuth, navigate]);

  return (
    <div className="max-w-107.5 mx-auto min-h-dvh flex flex-col">
      {/* En-tête */}
      <div className="bg-linear-to-br from-honey to-orange px-5 pt-8 pb-6 rounded-b-4xl shadow-[0_6px_24px_rgba(240,123,40,0.28)] animate-sunrise text-center">
        <div className="text-[44px] leading-none mb-1">🐔</div>
        <h1 className="font-dancing text-[28px] text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.15)]">
          Le Poulailler
        </h1>
        <p className="text-white/80 text-[13px] font-semibold mt-0.5">
          Gestion d'élevage simplifiée
        </p>
      </div>

      {/* Navigation onglets */}
      <div className="flex gap-1.5 px-4 pt-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2.5 rounded-[14px] font-nunito font-bold text-[12px] transition-all ${
              activeTab === t.id
                ? "bg-orange text-white shadow-[0_3px_10px_rgba(240,123,40,0.35)]"
                : "bg-[#f0e6d3] text-[#9a7a5a]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="flex-1 px-4 pt-5 pb-8">
        {activeTab === "app" && <TabApp />}
        {activeTab === "start" && <TabStart />}
        {activeTab === "about" && <TabAbout />}
      </div>
    </div>
  );
}
