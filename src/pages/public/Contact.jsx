import { useState } from "react";
import { Input, Textarea, Button } from "../../components/ui";
import { 
  Mail, Phone, MapPin, Clock, Send, CheckCircle2, 
  Loader2, MessageCircle, ShieldCheck, AlertCircle, Headphones 
} from "lucide-react";
import toast from "react-hot-toast";

const INFO = [
  { Icon: MapPin, title: "Siège Administratif", text: "Dakar, Sénégal" },
  { Icon: Mail,   title: "Email Officiel", text: "support@sunudemarche.sn" },
  { Icon: Phone,  title: "Ligne Directe", text: "+221 78 523 42 03" },
  { Icon: Clock,  title: "Horaires", text: "Lun – Ven : 08h00 – 17h00" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://sunudemarche-api.onrender.com/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom_complet: form.name,
          email: form.email,
          objet: form.subject,
          message: form.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message ||
          errorData?.detail ||
          errorData?.errors?.[0] ||
          "Une erreur est survenue lors de l'envoi du message.";
        throw new Error(errorMessage);
      }

      setSent(true);
      toast.success("Message transmis avec succès !");
    } catch (err) {
      console.error("Erreur de contact :", err);
      setError(err.message || "Impossible de joindre le serveur. Vérifiez votre connexion.");
      toast.error("Échec de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-50 via-white to-primary/5 py-12 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* En-tête institutionnel */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-3xl font-extrabold text-slate-600 tracking-tight mb-4">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Une question sur une démarche, un suivi de dossier ou un centre d'état civil ? Notre équipe vous répond avec attention.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Colonne d'informations & carte de statut */}
          <div className="lg:col-span-1 space-y-5">
            <div className="space-y-3">
              {INFO.map(({ Icon, title, text }) => (
                <div 
                  key={title} 
                  className="flex items-start gap-4 p-5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
                    <p className="text-sm text-slate-800 font-semibold mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carte de statut et délai de traitement */}
            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                  <Headphones size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Support en direct</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-emerald-300 font-medium">Agents disponibles</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nos agents traitent vos demandes sous 24h à 48h ouvrées. Pensez à préciser votre numéro de dossier si disponible.
              </p>
            </div>
          </div>

          {/* Formulaire de contact principal */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-2xl shadow-slate-900/10 p-6 sm:p-10">
            {sent ? (
              <div className="text-center py-20 space-y-6 animate-fade-in">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                  <CheckCircle2 size={38} />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-slate-900">Message transmis avec succès !</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Merci <span className="font-semibold text-slate-700">{form.name}</span>. Notre équipe de support analysera votre requête et vous recontactera à l'adresse <span className="font-semibold text-slate-700">{form.email}</span>.
                  </p>
                </div>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    size="md" 
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="rounded-xl px-6"
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">Formulaire de contact direct</h2>
                    <p className="text-xs text-slate-400">Remplissez les champs ci-dessous pour joindre les services administratifs</p>
                  </div>
                </div>

                {error && (
                  <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-shake">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <Input 
                    label="Nom complet" 
                    placeholder="Mouhamed NIANG" 
                    value={form.name} 
                    onChange={updateField("name")} 
                    required 
                  />
                  <Input 
                    label="Adresse email" 
                    type="email" 
                    placeholder="mouhamed.niang@domaine.sn" 
                    value={form.email} 
                    onChange={updateField("email")} 
                    required 
                  />
                </div>

                <Input 
                  label="Objet de la demande" 
                  placeholder="Ex : Suivi de demande d'extrait de naissance n°2841" 
                  value={form.subject} 
                  onChange={updateField("subject")} 
                  required 
                />
                
                <Textarea 
                  label="Votre message" 
                  placeholder="Décrivez votre situation ou votre demande administrative en détail..." 
                  rows={5} 
                  value={form.message} 
                  onChange={updateField("message")} 
                  required 
                />

                <div className="pt-3 flex items-center justify-end">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full sm:w-auto px-9 py-3.5 rounded-xl shadow-lg shadow-primary/25 font-semibold text-sm transition-all hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Envoyer le message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}








// import { useState } from "react";
// import { Input, Textarea, Button, Alert } from "../../components/ui";
// import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, MessageCircle } from "lucide-react";

// const INFO = [
//   { Icon: MapPin, title: "Adresse", text: "Dakar, Sénégal" },
//   { Icon: Mail,   title: "Email officiel", text: "support@sunudemarche.sn" },
//   { Icon: Phone,  title: "Téléphone", text: "+221 78 523 42 03" },
//   { Icon: Clock,  title: "Horaires", text: "Lun – Ven : 08h00 – 17h00" },
// ];

// export default function Contact() {
//   const [sent, setSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setTimeout(() => { setLoading(false); setSent(true); }, 1000);
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-12">

//       {/* En-tête */}
//       <div className="text-center max-w-2xl mx-auto mb-14">
//         <span className="inline-block px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-4 border border-primary/15">
//           Support & Assistance
//         </span>
//         <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
//           Comment pouvons-nous vous aider ?
//         </h1>
//         <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
//           Une question sur une démarche, un suivi de dossier ou un centre d'état civil ? Notre équipe vous répond rapidement.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-3 gap-8 items-start">

//         {/* Infos contact */}
//         <div className="md:col-span-1 space-y-3">
//           {INFO.map(({ Icon, title, text }) => (
//             <div key={title} className="flex items-start gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-card">
//               <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
//                 <Icon size={16} />
//               </div>
//               <div>
//                 <p className="text-xs font-bold text-slate-700">{title}</p>
//                 <p className="text-xs text-slate-500 mt-0.5">{text}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Formulaire */}
//         <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card p-6 sm:p-8">
//           {sent ? (
//             <div className="text-center py-10 space-y-4 animate-fade-in">
//               <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
//                 <CheckCircle2 size={28} />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-slate-900">Message envoyé !</h3>
//                 <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
//                   Merci pour votre message. Notre équipe de support vous répondra dans les meilleurs délais.
//                 </p>
//               </div>
//               <Button variant="outline" size="sm" onClick={() => setSent(false)}>
//                 Envoyer un autre message
//               </Button>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center">
//                   <MessageCircle size={17} />
//                 </div>
//                 <h2 className="font-bold text-slate-900 text-base">Envoyez-nous un message</h2>
//               </div>

//               <div className="grid sm:grid-cols-2 gap-4">
//                 <Input label="Nom complet" placeholder="Aminata Diallo" required />
//                 <Input label="Adresse email" type="email" placeholder="aminata@gmail.com" required />
//               </div>

//               <Input label="Objet" placeholder="Ex : Suivi de demande d'extrait de naissance" required />
//               <Textarea label="Votre message" placeholder="Décrivez votre situation en détail..." rows={5} required />

//               <div className="pt-1">
//                 <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8">
//                   {loading ? (
//                     <><Loader2 size={15} className="animate-spin" /> Envoi en cours...</>
//                   ) : (
//                     <><Send size={15} /> Envoyer le message</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }
