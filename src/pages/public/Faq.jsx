import { useState } from "react";
import { Search, ChevronDown, MessageCircleQuestion } from "lucide-react";

const FAQS = [
  {
    q: "SunuDémarche délivre-t-elle les documents officiels ?",
    a: "Non. SunuDémarche est une plateforme technologique connectée aux organismes compétents. Le document officiel est délivré par l'administration concernée ; la plateforme permet de déposer la demande et d'en suivre le traitement en temps réel.",
    category: "Général",
  },
  {
    q: "Comment suivre l'état de ma demande ?",
    a: "Depuis votre espace citoyen, section « Mes demandes », vous retrouvez l'état actuel de chaque demande ainsi que son historique complet de traitement.",
    category: "Suivi",
  },
  {
    q: "Que faire si on me demande une correction ?",
    a: "Vous recevez une notification détaillant les points à corriger. Rendez-vous dans le détail de la demande concernée, modifiez les champs indiqués, puis soumettez à nouveau votre dossier corrigé.",
    category: "Corrections",
  },
  {
    q: "Combien de temps prend le traitement ?",
    a: "Le délai de traitement est indiqué sur la fiche de chaque service. Il varie généralement selon la nature de la démarche et la charge du centre sélectionné.",
    category: "Délais",
  },
  {
    q: "Comment créer un compte citoyen ?",
    a: "Cliquez sur « S'inscrire » depuis la page d'accueil. Renseignez votre prénom, nom, adresse email et mot de passe. Votre compte est actif immédiatement.",
    category: "Compte",
  },
  {
    q: "Ma demande peut-elle être refusée ?",
    a: "Oui, dans certains cas (informations incorrectes ou incomplètes). En cas de refus, un motif vous est communiqué. Vous pouvez créer une nouvelle demande en prenant en compte les remarques formulées.",
    category: "Général",
  },
];

export default function Faq() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* En-tête */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-4 border border-primary/15">
          Centre d'aide
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Foire aux questions
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
          Retrouvez les réponses aux questions les plus fréquentes concernant l'utilisation de SunuDémarche.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher une question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-sm transition-all"
        />
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-14">
            <MessageCircleQuestion className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold text-sm">Aucun résultat pour "{query}"</p>
            <p className="text-slate-400 text-xs mt-1">Essayez avec d'autres mots-clés.</p>
          </div>
        ) : (
          filtered.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
                  ${isOpen ? "border-primary/25 shadow-sm shadow-primary/5" : "border-slate-100 hover:border-slate-200"}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-md border border-primary/15 shrink-0 hidden sm:inline">
                      {item.category}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm">{item.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-slate-400"}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 text-sm text-slate-500 leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* CTA support */}
      <div className="mt-12 text-center p-6 bg-primary/5 rounded-2xl border border-primary/10">
        <p className="text-sm font-semibold text-slate-700 mb-1">Vous n'avez pas trouvé votre réponse ?</p>
        <p className="text-xs text-slate-500 mb-4">Notre équipe de support vous répond dans les plus brefs délais.</p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
        >
          Contacter le support
        </a>
      </div>
    </div>
  );
}
