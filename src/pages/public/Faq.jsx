import { useState } from "react";
import { Search, ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "SunuDémarche délivre-t-elle les documents officiels ?",
    a: "Non. SunuDémarche est une plateforme technologique connectée aux organismes compétents. Le document officiel est délivré par l'administration concernée ; la plateforme permet de déposer la demande et d'en suivre le traitement.",
  },
  {
    q: "Comment suivre l'état de ma demande ?",
    a: "Depuis votre espace citoyen, section « Mes demandes », vous retrouvez l'état actuel de chaque demande ainsi que son historique complet.",
  },
  {
    q: "Que faire si on me demande une correction ?",
    a: "Vous recevez une notification détaillant ce qui doit être corrigé. Modifiez votre formulaire depuis le détail de la demande, puis soumettez-le à nouveau.",
  },
  {
    q: "Combien de temps prend le traitement ?",
    a: "Le délai varie selon le service demandé ; il est indiqué sur la fiche de chaque service.",
  },
];

export default function Faq() {
  const [searchQuery, setSearchQuery] = useState("");
  // Permet de garder l'index de la question ouverte (ou null si aucune n'est ouverte)
  const [openIndex, setOpenIndex] = useState(0); // La première est ouverte par défaut

  // Filtrer les questions selon la recherche
  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold mb-3">
          Centre d'aide
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
          Foire aux questions
        </h1>
        <p className="text-text-secondary text-sm md:text-base">
          Retrouvez les réponses aux questions les plus fréquentes concernant l'utilisation de SunuDémarche.
        </p>
      </div>

      {/* Barre de recherche interactive */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une question (ex: délai, suivi...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-primary shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Liste des FAQ */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-text text-sm md:text-base flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                    {item.q}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`} 
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-text-secondary border-t border-slate-100 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-text-secondary text-sm">
              Aucune question ne correspond à votre recherche "{searchQuery}".
            </p>
          </div>
        )}
      </div>

    </div>
  );
}