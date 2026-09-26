# SunuDémarche — Web

> « SunuDémarche — Vos démarches administratives, simplement. »

Application web (React + Vite + Tailwind CSS) pour la plateforme
SunuDémarche : espace public, espace citoyen, espace agent et espace
admin, branchés sur l'API REST `sunudemarche-api`.

## Installation

```bash
npm install
cp .env.example .env
# éditer .env si l'API tourne ailleurs qu'en localhost:8000

npm run dev
```

L'application est disponible sur `http://localhost:5173`.

Le backend `sunudemarche-api` doit tourner en parallèle (voir son propre
README) — CORS est déjà configuré côté backend pour accepter
`http://localhost:5173`.

## Comptes de démonstration

Après avoir lancé `python manage.py seed_demo` côté backend :

| Rôle  | Email                  | Mot de passe   |
|-------|------------------------|----------------|
| Agent | agent@sunudemarche.sn  | AgentDemo123!  |
| Admin | admin@sunudemarche.sn  | AdminDemo123!  |

Un compte citoyen se crée directement via la page **Inscription**.

## Structure

```
src/
├── api/            # client axios (refresh JWT auto) + fonctions d'appel par domaine
├── context/        # AuthContext (session, connexion, inscription, déconnexion)
├── components/     # UI partagée (Button, Input, Card...), layouts, StatusBadge
├── pages/
│   ├── public/     # Accueil, Services, À propos, FAQ, Contact, Connexion, Inscription
│   ├── citizen/    # Dashboard, Nouvelle demande, Mes demandes, Détail, Notifications, Profil, Paramètres
│   ├── agent/      # Dashboard, Liste des demandes, Détail/Traitement, Notifications, Profil
│   └── admin/      # Dashboard, Utilisateurs, Agents, Communes, Centres, Services, Demandes, Audit, Paramètres
└── App.jsx         # Routage complet + protection par rôle
```

## Parcours testés de bout en bout

- Inscription citoyen → connexion → nouvelle demande (wizard 4 étapes :
  service → centre → formulaire dynamique → résumé) → soumission →
  référence `REQ-2026-000001` → suivi dans « Mes demandes ».
- Connexion agent → traitement de la demande (vérification → traitement
  → validation → document disponible) avec commentaires/motifs
  obligatoires selon l'action.
- Connexion admin → statistiques, liste des utilisateurs/agents, journal
  d'audit.
- CORS et rafraîchissement automatique du token JWT vérifiés en
  conditions réelles contre le backend.

## Build de production

```bash
npm run build
```

Génère le dossier `dist/` prêt à être servi par n'importe quel serveur
statique ou intégré à un pipeline de déploiement.

## Prochaines évolutions (hors MVP)

Paiement en ligne, notifications SMS/email/push/WhatsApp, gestion CRUD
complète des communes/centres/services depuis l'admin — l'architecture
du client API et des pages est prête à les recevoir sans refonte.
