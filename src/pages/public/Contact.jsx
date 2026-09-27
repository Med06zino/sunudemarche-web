import { useState } from "react";
import { Input, Textarea, Button, Alert } from "../../components/ui";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, MessageCircle } from "lucide-react";

const INFO = [
  { Icon: MapPin, title: "Adresse", text: "Dakar, Sénégal" },
  { Icon: Mail,   title: "Email officiel", text: "support@sunudemarche.sn" },
  { Icon: Phone,  title: "Téléphone", text: "+221 78 523 42 03" },
  { Icon: Clock,  title: "Horaires", text: "Lun – Ven : 08h00 – 17h00" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-4 border border-primary/15">
          Support & Assistance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
          Une question sur une démarche, un suivi de dossier ou un centre d'état civil ? Notre équipe vous répond rapidement.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">

        {/* Infos contact */}
        <div className="md:col-span-1 space-y-3">
          {INFO.map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-10 space-y-4 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Message envoyé !</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Merci pour votre message. Notre équipe de support vous répondra dans les meilleurs délais.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center">
                  <MessageCircle size={17} />
                </div>
                <h2 className="font-bold text-slate-900 text-base">Envoyez-nous un message</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nom complet" placeholder="Aminata Diallo" required />
                <Input label="Adresse email" type="email" placeholder="aminata@gmail.com" required />
              </div>

              <Input label="Objet" placeholder="Ex : Suivi de demande d'extrait de naissance" required />
              <Textarea label="Votre message" placeholder="Décrivez votre situation en détail..." rows={5} required />

              <div className="pt-1">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8">
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> Envoi en cours...</>
                  ) : (
                    <><Send size={15} /> Envoyer le message</>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
