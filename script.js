/*
 * script.js
 *
 * Ce fichier contient des fonctions utilitaires pour charger le fichier
 * public/data/report.json et injecter dynamiquement le contenu dans les
 * différentes pages du site. Il n’utilise ni framework ni dépendance
 * complexe, uniquement les API Web natives.
 */

// Récupère l’année en cours et la place dans le pied de page.
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

/**
 * Charge le rapport JSON depuis le dossier public. Le chemin relatif est le
 * même pour toutes les pages (public/data/report.json). Renvoie une
 * promesse résolue avec l’objet JSON.
 */
async function loadReport() {
  const response = await fetch('public/data/report.json');
  if (!response.ok) throw new Error('Impossible de charger le fichier report.json');
  return await response.json();
}

/**
 * Remplit la section des chiffres clés sur la page d’accueil.
 */
async function renderKeyFigures() {
  const container = document.getElementById('figures-container');
  if (!container) return;
  const report = await loadReport();
  report.chiffres_cles.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    const title = document.createElement('h3');
    title.textContent = item.intitule;
    const value = document.createElement('p');
    value.className = 'value';
    value.textContent = `${item.valeur}${item.unite}`;
    const period = document.createElement('p');
    period.textContent = `Période : ${item.periode}`;
    const source = document.createElement('p');
    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = item.source;
    source.appendChild(document.createTextNode('Source : '));
    source.appendChild(link);
    card.appendChild(title);
    card.appendChild(value);
    card.appendChild(period);
    card.appendChild(source);
    container.appendChild(card);
  });
}

/**
 * Crée les graphiques définis dans report.graphes et les injecte dans le
 * conteneur avec l’id charts-container. Utilise Chart.js (chargé via CDN).
 */
async function renderGraphs() {
  const container = document.getElementById('charts-container');
  if (!container || typeof Chart === 'undefined') return;
  const report = await loadReport();
  report.graphes.forEach((graph) => {
    const indicatorId = graph.serieRef.split(':')[1];
    const indicator = report.indicateurs.find((ind) => ind.id === indicatorId);
    if (!indicator) return;
    // Crée un conteneur pour ce graphique
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    const heading = document.createElement('h3');
    heading.textContent = indicator.label;
    chartContainer.appendChild(heading);
    // Crée un élément canvas pour Chart.js
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    // Ajoute éventuellement les annotations en-dessous
    if (graph.annotations && graph.annotations.length > 0) {
      const annList = document.createElement('ul');
      annList.style.listStyle = 'none';
      annList.style.paddingLeft = '0';
      annList.style.fontSize = '0.9rem';
      annList.style.color = '#555';
      graph.annotations.forEach((ann) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${ann.x}</strong> : ${ann.label}`;
        annList.appendChild(li);
      });
      chartContainer.appendChild(annList);
    }
    container.appendChild(chartContainer);
    // Prépare les données pour Chart.js
    const labels = indicator.series.map((pt) => pt.date);
    const dataValues = indicator.series.map((pt) => pt.val);
    const data = {
      labels,
      datasets: [
        {
          label: indicator.label,
          data: dataValues,
          borderColor: '#0055A4',
          backgroundColor: 'rgba(0,85,164,0.1)',
          tension: 0.2,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
    // Intègre les annotations dans l’infobulle : si la date correspond à
    // l’une des annotations, le texte de celle‑ci est affiché en bas de
    // l’infobulle.
    const annotations = graph.annotations || [];
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            footer: function (context) {
              const xLabel = context[0]?.label;
              const ann = annotations.find((a) => a.x === xLabel);
              return ann ? ann.label : '';
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Année' },
        },
        y: {
          title: { display: true, text: indicator.unite },
        },
      },
    };
    // Instancie le graphique
    new Chart(canvas.getContext('2d'), {
      type: graph.type || 'line',
      data,
      options,
    });
  });
}

/**
 * Affiche les anecdotes sous forme de cartes.
 */
async function renderAnecdotes() {
  const container = document.getElementById('anecdotes-container');
  if (!container) return;
  const report = await loadReport();
  report.anecdotes.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card fade-up';
    // Délai croissant pour chaque carte pour un effet en cascade
    card.style.animationDelay = `${index * 0.15}s`;
    const title = document.createElement('h3');
    title.textContent = item.titre;
    const text = document.createElement('p');
    // Supprime les références entre crochets (citations) pour une meilleure lisibilité
    text.textContent = item.texte.replace(/【[^】]+】/g, '');
    const source = document.createElement('p');
    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${item.source} (${item.date})`;
    source.appendChild(document.createTextNode('Source : '));
    source.appendChild(link);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(source);
    container.appendChild(card);
  });
}

/**
 * Affiche les sources bibliographiques.
 */
async function renderSources() {
  const list = document.getElementById('sources-list');
  if (!list) return;
  const report = await loadReport();
  report.sources.forEach((src) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = src.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${src.media} – ${src.titre} (${src.date})`;
    li.appendChild(link);
    list.appendChild(li);
  });
}

/**
 * Ajoute la liste des sources au conteneur dédié sur chaque page (à
 * l’exception de la page Sources). Si aucun conteneur n’existe, la
 * fonction retourne immédiatement.
 */
async function renderPageSources() {
  const container = document.getElementById('page-sources-list');
  if (!container) return;
  const report = await loadReport();
  const ul = document.createElement('ul');
  ul.className = 'source-list';
  report.sources.forEach((src) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = src.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${src.media} — ${src.titre} (${src.date})`;
    li.appendChild(link);
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

// Détermine quelle fonction appeler selon la page courante. Le body dispose d’un
// attribut data-page qui sert de clé.
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'home') {
    renderKeyFigures().catch((err) => console.error(err));
    renderPageSources().catch((err) => console.error(err));
  } else if (page === 'graphs') {
    renderGraphs().catch((err) => console.error(err));
    renderPageSources().catch((err) => console.error(err));
  } else if (page === 'anecdotes') {
    renderAnecdotes().catch((err) => console.error(err));
    renderPageSources().catch((err) => console.error(err));
  } else if (page === 'sources') {
    renderSources().catch((err) => console.error(err));
  } else if (page === 'apropos') {
    // La page À propos n’a pas de contenu dynamique, mais on ajoute la bibliographie
    renderPageSources().catch((err) => console.error(err));
  }
});