import { useState } from "react";
import { Input, Textarea, Button, Alert } from "../../components/ui";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Simulation d'un délai d'envoi réseau (ex: API backend ou service d'email)
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      
      {/* En-tête de la page */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold mb-3">
          Support & Assistance
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Une question concernant une démarche, un suivi de dossier ou un centre d'état civil ? Notre équipe vous répond dans les plus brefs délais.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Colonne de gauche : Informations de contact institutionnelles */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-semibold text-text text-base border-b border-slate-100 pb-3">
            Informations utiles
          </h2>

          <div className="flex items-start gap-3 text-sm text-text-secondary">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-text">Adresse</p>
              <p className="text-xs mt-0.5">Dakar, Sénégal</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-text-secondary">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-text">Email officiel</p>
              <p className="text-xs mt-0.5">support@sunudemarche.sn</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-text-secondary">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-text">Téléphone</p>
              <p className="text-xs mt-0.5">+221 78 523 42 03</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-text-secondary">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-text">Horaires d'ouverture</p>
              <p className="text-xs mt-0.5">Lun - Ven : 08h00 - 17h00</p>
            </div>
          </div>
        </div>

        {/* Colonne de droite : Formulaire de contact */}
        <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {sent ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-secondary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-text">Message bien envoyé !</h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Merci pour votre message. Un accusé de réception a été simulé et notre équipe technique ou support vous contactera très rapidement.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSent(false)} 
                className="mt-4 text-xs"
              >
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-semibold text-text text-base mb-4">
                Envoyez-nous un message
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input 
                  label="Nom complet" 
                  placeholder="ex: Aminata Diallo" 
                  required 
                />
                <Input 
                  label="Adresse email" 
                  type="email" 
                  placeholder="ex: aminata@gmail.com" 
                  required 
                />
              </div>

              <Input 
                label="Objet de votre demande" 
                placeholder="ex: Suivi de demande d'extrait de naissance" 
                required 
              />

              <Textarea 
                label="Votre message" 
                placeholder="Décrivez votre situation en détail..." 
                rows={5} 
                required 
              />

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </>
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