import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft, Send, FileText, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../api/endpoints";
import { Card, Button, Input, Alert } from "../../components/ui";

const STEPS = ["Service", "Centre", "Formulaire", "RÃ©sumÃ©"];

export default function NewRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingCenters, setLoadingCenters] = useState(false);

  // Charger les services au montage
  useEffect(() => {
    setLoadingServices(true);
    api.listServices()
      .then(({ data }) => {
        const results = data.results || data.data || data;
        setServices(Array.isArray(results) ? results : []);
      })
      .catch((err) => {
        console.error("Erreur chargement services:", err);
        setError("Impossible de charger la liste des services.");
      })
      .finally(() => setLoadingServices(false));
  }, []);

  // Charger les centres compatibles avec le service sÃ©lectionnÃ©
  useEffect(() => {
    if (!selectedService) return;
    setLoadingCenters(true);
    setSelectedCenter(null); // reset si on change de service
    const serviceParam = selectedService.code || selectedService.id;
    api.listCenters({ service: serviceParam })
      .then(({ data }) => {
        const results = data.results || data.data || data;
        setCenters(Array.isArray(results) ? results : []);
      })
      .catch((err) => {
        console.error("Erreur chargement centres:", err);
        setCenters([]);
      })
      .finally(() => setLoadingCenters(false));
  }, [selectedService]);

  const schemaFields = selectedService?.required_fields_schema?.fields || [];

  function updateField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreateAndSubmit() {
    setError("");
    setLoading(true);
    try {
      const { data: created } = await api.createRequest({
        service: selectedService.id,
        center: selectedCenter.id,
        form_data: formData,
      });
      const reqId = created.id || created.data?.id;
      await api.submitRequest(reqId);
      
      toast.success("Demande crÃ©Ã©e et soumise avec succÃ¨s !");
      navigate(`/citoyen/demandes/${reqId}`);
    } catch (err) {
      setError(
        err.response?.data?.errors?.detail ||
        err.response?.data?.detail ||
        "Une erreur est survenue lors de la soumission de la demande."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      {/* En-tÃªte */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nouvelle demande</h1>
        <p className="text-slate-500 text-sm mt-1">
          Suivez les Ã©tapes pour soumettre votre dÃ©marche administrative en toute simplicitÃ©.
        </p>
      </div>

      {/* Stepper Moderne */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const isCompleted = i < step;
            const isCurrent = i === step;

            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center sm:flex-row sm:gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                        : isCurrent
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : i + 1}
                  </div>
                  <div className="text-center sm:text-left mt-1.5 sm:mt-0">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold hidden sm:block">Ã‰tape {i + 1}</div>
                    <div className={`text-xs sm:text-sm font-semibold ${isCurrent ? "text-slate-900" : "text-slate-500"}`}>
                      {s}
                    </div>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-slate-100 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && <Alert variant="error" className="rounded-xl border border-red-100 shadow-sm">{error}</Alert>}

      {/* Carte Contenu de l'Ã©tape */}
      <Card className="p-8 rounded-2xl border border-slate-100 shadow-sm bg-white space-y-6">
        
        {/* Ã‰TAPE 0 : CHOIX DU SERVICE */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Choisissez un service</h2>
              <p className="text-slate-500 text-xs mt-0.5">SÃ©lectionnez le type de dÃ©marche que vous souhaitez effectuer.</p>
            </div>
            
            {loadingServices ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
                <p className="text-xs">Chargement des services...</p>
              </div>
            ) : services.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Aucun service disponible pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedService?.id === s.id 
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" 
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedService?.id === s.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      <FileText size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-500 mt-1 leading-relaxed">{s.description}</div>
                    </div>
                    <input
                      type="radio"
                      name="service"
                      className="mt-2 text-primary focus:ring-primary"
                      checked={selectedService?.id === s.id}
                      onChange={() => setSelectedService(s)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ã‰TAPE 1 : CHOIX DU CENTRE */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Choisissez un centre de dÃ©pÃ´t</h2>
              <p className="text-slate-500 text-xs mt-0.5">OÃ¹ souhaitez-vous dÃ©poser ou retirer votre dossier ?</p>
            </div>
            
            {loadingCenters ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-7 h-7 animate-spin mb-2 text-primary" />
                <p className="text-xs">Recherche des centres disponibles...</p>
              </div>
            ) : centers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-700 font-semibold text-sm">Aucun centre disponible.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {centers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCenter(c)}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedCenter?.id === c.id 
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" 
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedCenter?.id === c.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {c.commune_name || c.commune} â€” {c.address}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="center"
                      className="mt-2 text-primary focus:ring-primary"
                      checked={selectedCenter?.id === c.id}
                      onChange={() => setSelectedCenter(c)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ã‰TAPE 2 : FORMULAIRE DYNAMIQUE */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Informations requises</h2>
              <p className="text-slate-500 text-xs mt-0.5">Service sÃ©lectionnÃ© : <span className="font-semibold text-slate-700">{selectedService?.name}</span></p>
            </div>

            {schemaFields.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                Aucun champ supplÃ©mentaire requis pour ce service. Vous pouvez passer Ã  l'Ã©tape suivante.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schemaFields.map((f) => (
                  <div key={f.name} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      {f.label} {f.required && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      type={f.type === "date" ? "date" : "text"}
                      required={f.required}
                      placeholder={f.placeholder || f.label}
                      value={formData[f.name] || ""}
                      onChange={(e) => updateField(f.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ã‰TAPE 3 : RÃ‰SUMÃ‰ */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">RÃ©sumÃ© de votre demande</h2>
              <p className="text-slate-500 text-xs mt-0.5">VÃ©rifiez vos informations avant la soumission dÃ©finitive.</p>
            </div>
            
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Service choisi</span>
                <span className="font-bold text-slate-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Centre de dÃ©pÃ´t</span>
                <span className="font-bold text-slate-900 text-right">{selectedCenter?.name} <span className="block text-xs font-normal text-slate-500">{selectedCenter?.address}</span></span>
              </div>
              
              <div className="space-y-2 pt-1">
                <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold block mb-2">DÃ©tails du formulaire</span>
                {schemaFields.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun champ additionnel.</p>
                ) : (
                  schemaFields.map((f) => (
                    <div key={f.name} className="flex justify-between text-xs py-1.5 border-b border-slate-200/30 last:border-0">
                      <span className="text-slate-600 font-medium">{f.label} :</span>
                      <span className="font-semibold text-slate-900">{formData[f.name] || "â€”"}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* BOUTONS DE NAVIGATION */}
        <div className="flex justify-between pt-6 border-t border-slate-100">
          <Button 
            variant="outline" 
            disabled={step === 0} 
            onClick={() => setStep((s) => s - 1)}
            className="rounded-xl px-5"
          >
            <ArrowLeft size={16} className="mr-2" />
            PrÃ©cÃ©dent
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              disabled={(step === 0 && !selectedService) || (step === 1 && !selectedCenter)}
              onClick={() => setStep((s) => s + 1)}
              className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-sm"
            >
              Suivant
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleCreateAndSubmit} 
              disabled={loading}
              className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-sm flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Soumission en cours...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Soumettre la demande</span>
                </>
              )}
            </Button>
          )}
        </div>

      </Card>
    </div>
  );
}
