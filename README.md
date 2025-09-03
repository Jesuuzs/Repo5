# Analyse de la crise en France (version HTML/CSS)

Ce dépôt contient une version simplifiée du site « Analyse de la crise en France » entièrement basée sur des fichiers HTML, CSS et JavaScript natif. Il n’y a plus de dépendances front‑end lourdes : pas de React, pas de Tailwind CSS et aucune bibliothèque 3D. L’objectif est d’offrir une interface légère et facile à déployer, tout en conservant les données et les fonctionnalités essentielles.

## Structure du dépôt

```
repo_html/
├── index.html            # Page d’accueil avec chiffres clés et lien vers la synthèse
├── synthese.html         # Dix points clefs résumant le rapport
├── graphiques.html       # Graphiques dynamiques utilisant Chart.js
├── anecdotes.html        # Anecdotes illustrant les données
├── sources.html          # Liste des sources
├── a-propos.html         # Méthodologie et limites
├── style.css             # Feuille de styles globale
├── script.js             # Script commun pour charger le fichier JSON et générer le contenu
├── assets/
│   └── images/
│       └── logo-marianne.svg   # Logo stylisé de Marianne
├── public/
│   ├── assets/
│   │   ├── backdrop-flag.png
│   │   └── social-crisis-abstract.png
│   └── data/
│       ├── raw.json             # Généré par l’extraction (non versionné)
│       └── report.json          # Données normalisées utilisées par le site
├── input/
│   ├── input.pdf               # PDF source
│   └── metadonnees.pdf         # Métadonnées de référence
├── scripts/
│   ├── extract-pdf.mjs         # Extraction hors‑ligne du texte du PDF
│   └── postprocess.mjs         # Normalisation et mise à jour de report.json
├── package.json
├── .github/workflows/gh-pages.yml
└── LICENSE
```

## Utilisation

1. **Cloner** le dépôt : `git clone <url> && cd repo_html`.
2. **Installer** les dépendances nécessaires à l’extraction (Node >= 18) :

   ```sh
   npm install
   ```

3. **Extraire** les données du PDF et mettre à jour le fichier JSON :

   ```sh
   npm run extract
   npm run postprocess
   ```

   Le fichier `public/data/report.json` sera mis à jour avec la date du jour.

4. **Ouvrir** `index.html` dans votre navigateur pour consulter le site localement. Aucun serveur n’est requis.

## Déploiement sur GitHub Pages

Le workflow GitHub situé dans `.github/workflows/gh-pages.yml` automatise l’extraction des données et le déploiement du site statique. À chaque push sur la branche `main` :

1. Les fichiers PDF sont traités par `extract-pdf.mjs` et `postprocess.mjs` pour mettre à jour `public/data/report.json`.
2. Un dossier `output` est préparé avec tous les fichiers HTML, CSS, JavaScript et assets.
3. Les fichiers du dossier `output` sont publiés sur la branche `gh-pages` via l’action officielle `deploy-pages`.

Vous retrouverez votre site à l’adresse affichée dans l’onglet **Pages** des paramètres GitHub.

## Personnalisation

- **PDF** : remplacez `input/input.pdf` par votre document. Les scripts d’extraction se chargent de régénérer le JSON.
- **Couleurs et styles** : modifiez `style.css` selon vos préférences. La palette utilise des teintes de bleu, rouge et neutre.
- **Données** : ajustez `public/data/report.json` pour ajouter ou modifier des indicateurs, anecdotes et sources. Le script JavaScript lira automatiquement les nouvelles entrées.

## Crédits et licences

Ce projet est distribué sous licence MIT. Les images abstraites du dossier `public/assets/` sont générées et libres de droits. Le logo Marianne stylisé est une création originale pour ce projet.