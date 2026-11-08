/**
 * Tectonique des Plaques - SVT 4ème
 * Animation pédagogique interactive avec respect rigoureux des échelles géologiques
 */

// Polyfill Canvas roundRect pour compatibilité anciens navigateurs scolaires
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r = 4) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

// Données pédagogiques et étapes pour chaque vue
const VIEWS_DATA = {
  global: {
    title: "Coupe Hémisphérique de la Terre (0 à 6371 km) : Le Moteur Convectif",
    text: "Depuis la surface du noyau très chaud (2900 km de profondeur), la chaleur réchauffe la base du manteau. Moins dense, la matière chaude monte sous forme de courant ascendant dans l'asthénosphère ductile. Bloqué en surface par la lithosphère rigide, ce courant s'écarte, refroidit, devient plus dense et redescend vers le noyau.",
    indicators: [
      "Rayon terrestre : 6371 km",
      "Noyau terrestre : 2900 à 6371 km (source de chaleur)",
      "Asthénosphère : ductile (siège de la convection)",
      "Lithosphère rigide : 100 à 150 km (bloque le flux)"
    ],
    steps: [
      {
        num: 1,
        title: "Chaleur du noyau & Ascension",
        desc: "La matière chauffée à 2900 km devient moins dense et s'élève.",
        info: "À la frontière noyau-manteau (2900 km), la chaleur intense diminue la masse volumique de la roche mantellique. Elle commence une très lente ascension (courant chaud ascendant)."
      },
      {
        num: 2,
        title: "Blocage sous la lithosphère rigide",
        desc: "Le flux thermique est arrêté par la lithosphère et dévie latéralement.",
        info: "Arrivé vers 100-150 km sous la surface, le courant chaud bute contre la lithosphère rigide et s'écarte à gauche et à droite. Ce frottement met les plaques lithosphériques en mouvement d'écartement (divergence)."
      },
      {
        num: 3,
        title: "Refroidissement & Courant descendant",
        desc: "En s'éloignant, la matière refroidit, devient plus dense et plonge.",
        info: "Sur les côtés, la matière s'est refroidie au contact de la surface. Devenue plus dense, elle replonge vers les profondeurs en direction du noyau, entraînant la subduction de la lithosphère océanique refroidie."
      }
    ]
  },
  divergence: {
    title: "Zoom 1 : Remontée Chaude, Étirement Continental & Dorsale Océanique",
    text: "À l'endroit du courant ascendant chaud, la lithosphère continentale rigide (150 km) s'étire et s'amincit. Elle se fracture en deux blocs qui s'écartent. L'océan s'installe et la chaleur s'évacue à la dorsale : le magma liquide forme par volcanisme effusif la lithosphère océanique (100 km).",
    indicators: [
      "Échelle verticale : 0 à 150 km (Lithosphère)",
      "Échelle horizontale : 0 à 400 km",
      "Magma fluide / Basaltes en coussins",
      "Création continue de lithosphère océanique (100 km)"
    ],
    steps: [
      {
        num: 1,
        title: "Bombement & Étirement continental",
        desc: "Le continent de 150 km d'épaisseur s'étire et se fracture en failles normales.",
        info: "L'arrivée de la chaleur mantellique provoque un bombement thermique et une extension horizontale. La roche rigide casse : formation d'un fossé d'effondrement (rift continental)."
      },
      {
        num: 2,
        title: "Séparation des deux blocs & Inondation",
        desc: "Les deux blocs continentaux s'écartent, l'eau de mer s'engouffre.",
        info: "L'amincissement est maximal. La rupture est consommée : les deux blocs continentaux se séparent et l'eau de mer pénètre, initiant un jeune océan."
      },
      {
        num: 3,
        title: "Dorsale active & Nouvelle lithosphère (100 km)",
        desc: "Évacuation de la chaleur interne par volcanisme effusif sous-marin.",
        info: "À l'axe de la dorsale, la décompression fait fondre le manteau : le magma liquide très fluide s'épanche sous la mer (laves en coussins) et cristallise en formant progressivement la lithosphère océanique de 100 km d'épaisseur."
      }
    ]
  },
  subduction: {
    title: "Zoom 2 : Courant Descendant, Subduction & Volcanisme Explosif",
    text: "Là où le courant convectif redescend dans l'asthénosphère, la lithosphère océanique refroidie et dense (100 km) plonge sous la lithosphère continentale (150 km). En s'enfonçant, elle se déshydrate : l'eau libérée fait fondre le manteau et engendre un magma très visqueux très explosif en surface.",
    indicators: [
      "Lithosphère océanique plongeante : 100 km (dense)",
      "Lithosphère continentale chevauchante : 150 km",
      "Déshydratation de la plaque plongeante",
      "Magma visqueux riche en gaz ➔ Explosions"
    ],
    steps: [
      {
        num: 1,
        title: "Plongement de la lithosphère dense",
        desc: "La lithosphère océanique (100 km) s'enfonce dans l'asthénosphère ductile.",
        info: "Refroidie depuis des millions d'années en s'éloignant de la dorsale, la lithosphère océanique est devenue plus dense que l'asthénosphère chaude. Elle plonge sous le continent, guidée par le courant convectif descendant."
      },
      {
        num: 2,
        title: "Déshydratation & Fusion partielle",
        desc: "L'eau libérée abaisse le point de fusion du manteau sus-jacent.",
        info: "Sous la pression et la chaleur croissantes, les roches océaniques hydratées expulsent leur eau. Cette eau remonte dans le manteau sus-jacent et provoque sa fusion partielle à plus basse température."
      },
      {
        num: 3,
        title: "Ascension & Éruption explosive",
        desc: "Le magma visqueux riche en silice monte et explose en surface.",
        info: "Ce magma très visqueux piège les gaz sous pression. Arrivé en surface sur le continent, il forme un dôme de lave et explose violemment (nuées ardentes, gigantesque panache de cendres)."
      }
    ]
  },
  seisme: {
    title: "Zoom 3 : Rupture au Foyer, Propagation des Ondes & Sismogrammes",
    text: "Dans la lithosphère continentale rigide (150 km) soumise aux contraintes de compression, la faille se bloque. La roche rigide casse au FOYER (hypocentre) en profondeur, libérant l'énergie sous forme d'ondes sismiques. L'ÉPICENTRE subit les dégâts maximaux.",
    indicators: [
      "Foyer (Hypocentre) : rupture dans la lithosphère rigide",
      "Épicentre : point vertical en surface (dégâts max)",
      "Ondes sismiques concentriques (P et S)",
      "Bâtiments ordinaires vs Parasismiques",
      "Enregistrements décalés dans le temps (Δt)"
    ],
    steps: [
      {
        num: 1,
        title: "Contraintes de compression",
        desc: "Les contraintes s'accumulent le long de la faille bloquée.",
        info: "Seule la lithosphère rigide peut accumuler des contraintes élastiques sans fluer. L'asthénosphère en dessous ne casse jamais."
      },
      {
        num: 2,
        title: "Rupture au Foyer & Ondes sismiques",
        desc: "La roche cède brutalement, libérant des trains d'ondes concentriques.",
        info: "La limite de résistance élastique est franchie : la roche casse d'un coup sec au foyer. L'énergie emmagasinée rayonne sous forme de vibrations qui se propagent dans toutes les directions."
      },
      {
        num: 3,
        title: "Épicentre, Dégâts & Sismogrammes différés",
        desc: "Arrivée décalée des ondes à la Ville A (25 km) et la Ville B (95 km).",
        info: "L'épicentre subit les secousses les plus violentes. La Ville A (proche) enregistre le séisme très tôt. La Ville B (éloignée) l'enregistre avec un retard mesurable (Δt) car les ondes voyagent à vitesse finie dans la roche."
      }
    ]
  }
};

// Questions du Quiz SVT 4ème
const QUIZ_QUESTIONS = [
  {
    question: "Quelle enveloppe terrestre est RIGIDE et la SEULE capable de casser pour provoquer des séismes ?",
    options: [
      "L'asthénosphère (couche chaude et ductile qui se déforme sans casser)",
      "La lithosphère (plaques rigides de 100 à 150 km d'épaisseur)",
      "Le noyau externe (liquide)",
      "L'atmosphère terrestre"
    ],
    correct: 1,
    explanation: "Exact ! Seule la lithosphère est rigide et cassante. L'asthénosphère sous-jacente est moins rigide (ductile) et se déforme plastiquement sans jamais casser."
  },
  {
    question: "D'où provient la chaleur qui crée les mouvements de convection ascendants dans l'asthénosphère ?",
    options: [
      "Du rayonnement solaire à la surface",
      "Des frottements des marées océaniques",
      "De la surface du noyau en profondeur (à 2900 km)",
      "Du vent atmosphérique"
    ],
    correct: 2,
    explanation: "Bravo ! La surface du noyau terrestre, très chaude (~4000°C), réchauffe la base du manteau à 2900 km de profondeur. La roche chaude, devenue moins dense, commence son ascension."
  },
  {
    question: "Que se passe-t-il lorsque le courant chaud ascendant arrive sous la lithosphère ?",
    options: [
      "Il s'échappe directement dans l'espace",
      "Il est bloqué par la lithosphère rigide et s'écarte à droite et à gauche en entraînant les plaques",
      "Il fait fondre la Terre entière instantanément",
      "Il s'arrête net sans bouger"
    ],
    correct: 1,
    explanation: "Exactement ! Le flux chaud est bloqué par la lithosphère rigide, ce qui le force à s'orienter horizontalement. Ce mouvement entraîne l'écartement des plaques (divergence) au niveau des dorsales."
  },
  {
    question: "Au niveau de la dorsale océanique (lieu d'évacuation de la chaleur), que forme le magma liquide effusif ?",
    options: [
      "Il explose et détruit les océans",
      "Il refroidit sous l'eau et forme au fur et à mesure la lithosphère océanique (~100 km)",
      "Il transforme l'eau de mer en glace",
      "Il ne forme rien car il s'évapore dans l'air"
    ],
    correct: 1,
    explanation: "Parfait ! Le magma liquide très fluide s'épanche sous la mer (laves en coussins / pillow-lavas). En refroidissant, il crée en continu la nouvelle lithosphère océanique de 100 km d'épaisseur."
  },
  {
    question: "Pourquoi une station sismologique éloignée enregistre-t-elle le séisme après la station proche ?",
    options: [
      "Parce que le sismomètre est moins sensible",
      "Parce que les ondes sismiques se propagent à une vitesse finie à travers les roches (décalage temporel Δt)",
      "Parce que la terre tourne à l'envers",
      "Parce que le foyer attend avant d'envoyer les ondes"
    ],
    correct: 1,
    explanation: "Très bien ! Les ondes sismiques mettent du temps à voyager dans la roche (entre 3 et 8 km/s). Plus la ville est éloignée de l'épicentre, plus le temps d'arrivée est retardé (temps de retard Δt) et plus l'amplitude diminue."
  }
];

class TectoniqueSimulation {
  constructor() {
    this.canvas = document.getElementById("simCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.currentView = "global"; // global, divergence, subduction, seisme
    this.currentStep = 1;
    this.isPlaying = true;
    this.time = 0;
    this.speed = 1.0;

    // Toggles d'affichage
    this.showLabels = true;
    this.showThermal = true;
    this.showGrid = true;

    // Étoiles de fond pour la vue globale
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.8 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.7
      });
    }

    // Particules de convection pour la coupe hémisphérique
    this.convectionParticles = [];
    this.initConvectionParticles();

    // État du séisme
    this.seismeState = {
      triggered: false,
      ruptureTime: 0,
      foyer: { x: 0, y: 0 },
      epicentre: { x: 0, y: 0 },
      waveRadius: 0,
      stationA: { x: 0, y: 0, dist: 25, reached: false },
      stationB: { x: 0, y: 0, dist: 95, reached: false },
      shakingIntensity: 0
    };

    // Canvas Sismogrammes
    this.canvasSeismoA = document.getElementById("canvasSeismoA");
    this.ctxSeismoA = this.canvasSeismoA.getContext("2d");
    this.canvasSeismoB = document.getElementById("canvasSeismoB");
    this.ctxSeismoB = this.canvasSeismoB.getContext("2d");

    this.historySeismoA = new Array(150).fill(0);
    this.historySeismoB = new Array(150).fill(0);

    // Quiz state
    this.quizIndex = 0;
    this.quizScore = 0;

    this.initEventListeners();
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.updateViewUI();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // Initialisation des particules de convection pour l'hémisphère
  initConvectionParticles() {
    this.convectionParticles = [];
    // Deux cellules de convection géantes : gauche et droite
    for (let i = 0; i < 140; i++) {
      const cell = i % 2 === 0 ? "left" : "right";
      this.convectionParticles.push({
        cell: cell,
        // progression cyclique le long de la cellule (0 à 1)
        progress: Math.random(),
        speed: 0.0018 + Math.random() * 0.0015,
        offset: (Math.random() - 0.5) * 0.12, // variation radiale
        size: 2.2 + Math.random() * 2.2
      });
    }
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  initEventListeners() {
    // Navigation par onglets
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Clics interactifs directement sur le canvas pour les zooms
    this.canvas.addEventListener("click", (e) => {
      if (this.currentView === "global") {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const cx = this.width * 0.5;
        const cy = this.height * 0.88;
        const R = Math.min(this.width * 0.44, this.height * 0.70);

        // Zone Sommet (Dorsale / Zoom 1)
        const dorsaleX = cx;
        const dorsaleY = cy - R;
        if (Math.hypot(mx - dorsaleX, my - (dorsaleY + 20)) < 60) {
          this.switchView("divergence");
          return;
        }

        // Zone Flanc Droit (Subduction / Zoom 2)
        const subX = cx + Math.cos(-Math.PI * 0.22) * R;
        const subY = cy + Math.sin(-Math.PI * 0.22) * R;
        if (Math.hypot(mx - subX, my - subY) < 60) {
          this.switchView("subduction");
          return;
        }

        // Zone Flanc Gauche (Séisme / Zoom 3)
        const seisX = cx + Math.cos(-Math.PI * 0.78) * R;
        const seisY = cy + Math.sin(-Math.PI * 0.78) * R;
        if (Math.hypot(mx - seisX, my - seisY) < 60) {
          this.switchView("seisme");
          return;
        }
      }
    });

    // Contrôles Play / Pause / Reset
    const btnPlayPause = document.getElementById("btnPlayPause");
    btnPlayPause.addEventListener("click", () => {
      this.isPlaying = !this.isPlaying;
      document.getElementById("playIcon").textContent = this.isPlaying ? "⏸" : "▶";
      document.getElementById("playLabel").textContent = this.isPlaying ? "Pause" : "Lecture";
      btnPlayPause.classList.toggle("paused", !this.isPlaying);
      sounds.playClick();
    });

    document.getElementById("btnReset").addEventListener("click", () => {
      this.time = 0;
      this.resetSeisme();
      sounds.playClick();
    });

    // Vitesses
    document.querySelectorAll(".speed-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".speed-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.speed = parseFloat(btn.dataset.speed);
        sounds.playClick();
      });
    });

    // Toggles
    document.getElementById("chkLabels").addEventListener("change", (e) => {
      this.showLabels = e.target.checked;
    });
    document.getElementById("chkThermal").addEventListener("change", (e) => {
      this.showThermal = e.target.checked;
    });
    document.getElementById("chkGrid").addEventListener("change", (e) => {
      this.showGrid = e.target.checked;
    });

    // Bouton de déclenchement du séisme
    document.getElementById("btnTriggerSeisme").addEventListener("click", () => {
      this.triggerSeisme();
    });

    // Bouton Son
    const btnSound = document.getElementById("btnSound");
    btnSound.addEventListener("click", () => {
      const isEnabled = sounds.toggle();
      document.getElementById("soundIcon").textContent = isEnabled ? "🔊" : "🔇";
      document.getElementById("soundLabel").textContent = isEnabled ? "Son : Activé" : "Son : Désactivé";
    });

    // Modale Lexique
    const modalGlossary = document.getElementById("modalGlossary");
    document.getElementById("btnGlossary").addEventListener("click", () => {
      modalGlossary.classList.add("open");
      sounds.playClick();
    });
    document.getElementById("btnCloseGlossary").addEventListener("click", () => {
      modalGlossary.classList.remove("open");
    });
    modalGlossary.addEventListener("click", (e) => {
      if (e.target === modalGlossary) modalGlossary.classList.remove("open");
    });

    // Modale Quiz
    const modalQuiz = document.getElementById("modalQuiz");
    document.getElementById("btnQuiz").addEventListener("click", () => {
      modalQuiz.classList.add("open");
      this.startQuiz();
      sounds.playClick();
    });
    document.getElementById("btnCloseQuiz").addEventListener("click", () => {
      modalQuiz.classList.remove("open");
    });
    modalQuiz.addEventListener("click", (e) => {
      if (e.target === modalQuiz) modalQuiz.classList.remove("open");
    });

    // Plein écran
    document.getElementById("btnFullscreen").addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Fermeture de l'info-card
    document.getElementById("btnCloseCard").addEventListener("click", () => {
      const card = document.getElementById("infoCard");
      card.style.display = card.style.display === "none" ? "block" : "none";
    });
  }

  switchView(viewName) {
    this.currentView = viewName;
    this.currentStep = 1;

    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.view === viewName);
    });

    const seismeOverlay = document.getElementById("seismeTriggerOverlay");
    seismeOverlay.style.display = viewName === "seisme" ? "flex" : "none";

    const seismoPanel = document.getElementById("seismoPanel");
    seismoPanel.style.display = viewName === "seisme" ? "flex" : "none";

    if (viewName === "seisme") {
      this.resetSeisme();
    }

    this.updateViewUI();
    sounds.playClick();
  }

  updateViewUI() {
    const data = VIEWS_DATA[this.currentView];
    if (!data) return;

    document.getElementById("infoTitle").textContent = data.title;
    document.getElementById("infoText").textContent = data.text;

    // Badges d'indicateurs
    const container = document.getElementById("infoIndicators");
    container.innerHTML = "";
    data.indicators.forEach((ind) => {
      const span = document.createElement("span");
      span.className = "indicator-pill";
      span.textContent = ind;
      container.appendChild(span);
    });

    // Étapes dans la colonne latérale
    const stepButtonsContainer = document.getElementById("stepButtons");
    stepButtonsContainer.innerHTML = "";
    document.getElementById("stepCounter").textContent = `Étape ${this.currentStep}/${data.steps.length}`;

    data.steps.forEach((step) => {
      const btn = document.createElement("button");
      btn.className = `step-nav-btn ${step.num === this.currentStep ? "active" : ""}`;
      btn.innerHTML = `
        <span class="step-num-badge">${step.num}</span>
        <div class="step-btn-text">
          <strong>${step.title}</strong>
          <small>${step.desc}</small>
        </div>
      `;
      btn.addEventListener("click", () => {
        this.currentStep = step.num;
        this.updateStepUI();
        sounds.playClick();
      });
      stepButtonsContainer.appendChild(btn);
    });

    this.updateStepUI();
  }

  updateStepUI() {
    const data = VIEWS_DATA[this.currentView];
    const currentStepObj = data.steps.find((s) => s.num === this.currentStep) || data.steps[0];

    document.getElementById("stepCounter").textContent = `Étape ${this.currentStep}/${data.steps.length}`;
    document.querySelectorAll(".step-nav-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", idx + 1 === this.currentStep);
    });

    document.getElementById("infoBadge").textContent = `Étape ${this.currentStep} : ${currentStepObj.title}`;
    document.getElementById("infoText").textContent = currentStepObj.info;
  }

  // === SEISME LOGIQUE ===
  triggerSeisme() {
    this.seismeState.triggered = true;
    this.seismeState.ruptureTime = this.time;
    this.seismeState.waveRadius = 0;
    this.seismeState.shakingIntensity = 1.0;
    this.seismeState.stationA.reached = false;
    this.seismeState.stationB.reached = false;

    document.getElementById("statusA").textContent = "Propagation des ondes...";
    document.getElementById("statusB").textContent = "Propagation des ondes...";
    document.getElementById("statusA").style.color = "#fbbf24";
    document.getElementById("statusB").style.color = "#fbbf24";

    sounds.playSeisme();
  }

  resetSeisme() {
    this.seismeState.triggered = false;
    this.seismeState.waveRadius = 0;
    this.seismeState.shakingIntensity = 0;
    this.seismeState.stationA.reached = false;
    this.seismeState.stationB.reached = false;
    this.historySeismoA.fill(0);
    this.historySeismoB.fill(0);

    const sA = document.getElementById("statusA");
    const sB = document.getElementById("statusB");
    if (sA && sB) {
      sA.textContent = "En attente de l'arrivée des ondes...";
      sB.textContent = "En attente de l'arrivée des ondes...";
      sA.style.color = "#64748b";
      sB.style.color = "#64748b";
    }
  }

  // === BOUCLE PRINCIPALE D'ANIMATION ===
  animate() {
    if (this.isPlaying) {
      this.time += 0.016 * this.speed;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.currentView) {
      case "global":
        this.renderGlobalHemiView();
        break;
      case "divergence":
        this.renderDivergenceView();
        break;
      case "subduction":
        this.renderSubductionView();
        break;
      case "seisme":
        this.renderSeismeView();
        break;
    }

    if (this.currentView === "seisme") {
      this.updateAndDrawSismograms();
    }

    requestAnimationFrame(this.animate);
  }

  // =========================================================================
  // VUE 1 : COUPE HÉMISPHÉRIQUE DE LA TERRE (DEMI-SPHÈRE, RAYON 6371 KM)
  // CELLULES DE CONVECTION DEPUIS LA SURFACE DU NOYAU (2900 KM)
  // MOUVEMENTS BLOQUÉS EN SURFACE PAR LA LITHOSPHÈRE RIGIDE
  // =========================================================================
  renderGlobalHemiView() {
    const w = this.width;
    const h = this.height;

    // 1. Fond étoilé de l'espace
    this.ctx.fillStyle = "#030712";
    this.ctx.fillRect(0, 0, w, h);

    this.stars.forEach((s) => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * (0.6 + Math.sin(this.time * 2 + s.x * 10) * 0.4)})`;
      this.ctx.fillRect(s.x * w, s.y * h * 0.75, s.size, s.size);
    });

    // Paramètres géométriques de la demi-sphère
    // Centre du globe au bas de la zone visible
    const cx = w * 0.5;
    const cy = h * 0.88;
    const R = Math.min(w * 0.44, h * 0.70); // Rayon terrestre = 6371 km

    // Proportions physiques réelles :
    // R_noyau_graine ~ 1220 km  => 1220 / 6371 = 0.191 R
    // R_noyau_externe ~ 3470 km (prof 2900 km) => 3470 / 6371 = 0.545 R
    // R_manteau_astheno ~ 5700 km (prof 670 km) => 0.895 R
    // R_lithosphere ~ 6221 à 6271 km (100 à 150 km) => visuellement magnifiée pour visibilité claire
    const rGraine = R * 0.191;
    const rNoyau = R * 0.545; // Surface du noyau à 2900 km de profondeur
    const rAsthLimite = R * 0.895; // Limite manteau inf / asthénosphère
    const rLithoBase = R * 0.945; // Base de la lithosphère (150 km)

    // Clip demi-sphère supérieure (angle PI à 0)
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.lineTo(cx + R, cy);
    this.ctx.lineTo(cx - R, cy);
    this.ctx.closePath();
    this.ctx.clip();

    // A. MANTEAU / ASTHÉNOSPHÈRE (de rNoyau à R)
    const mantleGrad = this.ctx.createRadialGradient(cx, cy, rNoyau, cx, cy, R);
    mantleGrad.addColorStop(0, "#d9480f"); // Chaud à la frontière noyau-manteau
    mantleGrad.addColorStop(0.5, "#993d18");
    mantleGrad.addColorStop(1, "#5c1d0a");
    this.ctx.fillStyle = mantleGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.fill();

    // B. CELLULES DE CONVECTION MANTELLIQUE (partant de rNoyau vers la surface)
    if (this.showThermal) {
      this.drawHemisphereConvection(cx, cy, rNoyau, rLithoBase);
    }

    // C. NOYAU EXTERNE LIQUIDE (2900 à 5150 km de profondeur : SOURCE DE CHALEUR)
    const coreOutGrad = this.ctx.createRadialGradient(cx, cy, rGraine, cx, cy, rNoyau);
    coreOutGrad.addColorStop(0, "#fef08a");
    coreOutGrad.addColorStop(0.6, "#f59e0b");
    coreOutGrad.addColorStop(1, "#ea580c"); // Surface chaude en contact avec le manteau
    this.ctx.fillStyle = coreOutGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, rNoyau, Math.PI, 0, false);
    this.ctx.fill();

    // D. NOYAU INTERNE (GRAINE SOLIDE, 5150 à 6371 km)
    const seedGrad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, rGraine);
    seedGrad.addColorStop(0, "#ffffff");
    seedGrad.addColorStop(1, "#fef08a");
    this.ctx.fillStyle = seedGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, rGraine, Math.PI, 0, false);
    this.ctx.fill();

    // E. LITHOSPHÈRE RIGIDE EN SURFACE (BLOQUANT LE FLUX)
    // Lithosphère continentale (150 km) et océanique (100 km)
    this.drawHemiLithosphere(cx, cy, R, rLithoBase);

    this.ctx.restore(); // fin du clip

    // Contour de la demi-sphère
    this.ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.lineTo(cx + R, cy);
    this.ctx.lineTo(cx - R, cy);
    this.ctx.stroke();

    // 2. GRADUATION DES ÉCHELLES KILOMÉTRIQUES SUR L'AXE CENTRAL
    if (this.showGrid) {
      this.drawHemiDepthScale(cx, cy, R, rNoyau, rGraine, rLithoBase);
    }

    // 3. PASTILLES DE ZOOM INTERACTIVES CLICABLES SUR LE GLOBE
    this.drawZoomPillsOnGlobe(cx, cy, R);

    // 4. LÉGENDES ET ANNOTATIONS PÉDAGOGIQUES
    if (this.showLabels) {
      this.drawHemiLabels(cx, cy, R, rNoyau, rGraine);
    }
  }

  // Tracé des cellules de convection en coordonnées polaires dans le manteau
  drawHemisphereConvection(cx, cy, rInner, rOuter) {
    const totalW = rOuter - rInner;

    // Particules de convection le long des deux cellules
    this.convectionParticles.forEach((p) => {
      p.progress = (p.progress + p.speed * this.speed) % 1.0;

      // Trajet d'une cellule :
      // 0.0 -> 0.25 : Ascension centrale verticale (panache chaud montant depuis le noyau)
      // 0.25 -> 0.50 : Étalement sous la lithosphère (bloqué vers la gauche ou la droite)
      // 0.50 -> 0.75 : Descente vers le noyau sur les côtés (refroidissement, plus dense)
      // 0.75 -> 1.00 : Retour à la surface du noyau vers le centre
      let curR, curAngle;
      const isLeft = p.cell === "left";
      const sign = isLeft ? -1 : 1;

      if (p.progress < 0.25) {
        // Phase 1 : Ascension centrale
        const frac = p.progress / 0.25;
        curR = rInner + frac * totalW;
        curAngle = -Math.PI * 0.5 + sign * (0.04 + p.offset);
      } else if (p.progress < 0.50) {
        // Phase 2 : Bloqué sous la lithosphère, étalement latéral
        const frac = (p.progress - 0.25) / 0.25;
        curR = rOuter - 6 + p.offset * 20;
        curAngle = -Math.PI * 0.5 + sign * (0.04 + frac * 0.45);
      } else if (p.progress < 0.75) {
        // Phase 3 : Descente vers le noyau (subduction / refroidissement)
        const frac = (p.progress - 0.50) / 0.25;
        curR = rOuter - frac * totalW;
        curAngle = -Math.PI * 0.5 + sign * (0.49 - p.offset * 0.2);
      } else {
        // Phase 4 : Retour le long de la surface du noyau
        const frac = (p.progress - 0.75) / 0.25;
        curR = rInner + 8 + p.offset * 15;
        curAngle = -Math.PI * 0.5 + sign * (0.49 - frac * 0.45);
      }

      // Couleur de particule selon la température :
      // Chaud (jaune/orange) pendant la montée et au noyau, froid (bleu/cyan) pendant la descente
      let color;
      if (p.progress < 0.35 || p.progress > 0.85) {
        color = "rgba(254, 240, 138, 0.85)"; // Très chaud
      } else if (p.progress < 0.55) {
        color = "rgba(249, 115, 22, 0.8)"; // Tiède
      } else {
        color = "rgba(56, 189, 248, 0.8)"; // Refroidi et dense qui plonge
      }

      const px = cx + Math.cos(curAngle) * curR;
      const py = cy + Math.sin(curAngle) * curR;

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(px, py, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Lignes fléchées schématiques de convection
    this.ctx.save();
    this.ctx.setLineDash([5, 5]);
    this.ctx.lineWidth = 2;

    // Boucle Gauche
    this.ctx.strokeStyle = "rgba(254, 240, 138, 0.35)";
    this.ctx.beginPath();
    this.ctx.ellipse(cx - (rInner + rOuter) * 0.26, cy - (rInner + rOuter) * 0.42, totalW * 0.42, totalW * 0.35, -0.4, 0, Math.PI * 2);
    this.ctx.stroke();

    // Boucle Droite
    this.ctx.beginPath();
    this.ctx.ellipse(cx + (rInner + rOuter) * 0.26, cy - (rInner + rOuter) * 0.42, totalW * 0.42, totalW * 0.35, 0.4, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.setLineDash([]);
    this.ctx.restore();
  }

  // Tracé de la lithosphère rigide en surface (bloquant le flux)
  drawHemiLithosphere(cx, cy, R, rBase) {
    const lithoThickness = R - rBase;

    // Découpage en plaques :
    // - Sommet (-PI/2) : Dorsale océanique (divergence)
    // - Flanc droit (-PI*0.25) : Subduction océanique sous continent
    // - Reste : Lithosphère continentale et océanique

    // 1. Fond lithosphérique rigide (brun rocheux continentale)
    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.arc(cx, cy, rBase, 0, Math.PI, true);
    this.ctx.closePath();
    this.ctx.fill();

    // 2. Zone Océanique centrale (bleutée, lithosphère océanique plus mince ~100 km)
    // De angle -PI*0.65 à -PI*0.25
    this.ctx.fillStyle = "#1e4d6b";
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, -Math.PI * 0.65, -Math.PI * 0.25, false);
    this.ctx.arc(cx, cy, R - lithoThickness * 0.66, -Math.PI * 0.25, -Math.PI * 0.65, true);
    this.ctx.closePath();
    this.ctx.fill();

    // Eau de mer au-dessus de la lithosphère océanique
    this.ctx.fillStyle = "rgba(14, 116, 144, 0.7)";
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, -Math.PI * 0.65, -Math.PI * 0.25, false);
    this.ctx.arc(cx, cy, R - 5, -Math.PI * 0.25, -Math.PI * 0.65, true);
    this.ctx.closePath();
    this.ctx.fill();

    // Faille / Dorsale au sommet exact (-PI/2) : sortie de chaleur rougeoyante
    const dorsaleAngle = -Math.PI * 0.5;
    const dx = cx + Math.cos(dorsaleAngle) * R;
    const dy = cy + Math.sin(dorsaleAngle) * R;

    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.arc(dx, dy + 2, 6, 0, Math.PI * 2);
    this.ctx.fill();

    // Plongement de la plaque plongeante en subduction (flanc droit, angle -PI*0.25)
    const subAngle = -Math.PI * 0.25;
    const sx = cx + Math.cos(subAngle) * R;
    const sy = cy + Math.sin(subAngle) * R;

    // Slab plongeant dans l'asthénosphère
    this.ctx.strokeStyle = "#1e3a5f";
    this.ctx.lineWidth = lithoThickness * 0.66;
    this.ctx.beginPath();
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(sx - Math.cos(subAngle) * 45, sy - Math.sin(subAngle) * 45 + 30);
    this.ctx.stroke();
  }

  // Échelle kilométrique de profondeur sur l'axe vertical central
  drawHemiDepthScale(cx, cy, R, rNoyau, rGraine, rLithoBase) {
    this.ctx.save();
    const axisX = cx - R * 0.72; // Axe déporté à gauche pour ne pas surcharger le centre
    const axisTopY = cy - R;
    const axisBottomY = cy;

    // Ligne verticale de profondeur
    this.ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(axisX, axisTopY);
    this.ctx.lineTo(axisX, axisBottomY);
    this.ctx.stroke();

    // Repères kilométriques officiels
    const depths = [
      { km: "0 km", label: "Surface terrestre", y: cy - R, color: "#38bdf8" },
      { km: "150 km", label: "Base Lithosphère rigide", y: cy - rLithoBase, color: "#f87171" },
      { km: "670 km", label: "Asthénosphère (Manteau sup.)", y: cy - (R * 0.895), color: "#fb923c" },
      { km: "2 900 km", label: "Surface du Noyau (Chaleur)", y: cy - rNoyau, color: "#facc15" },
      { km: "5 150 km", label: "Noyau interne (Graine)", y: cy - rGraine, color: "#fef08a" },
      { km: "6 371 km", label: "Centre de la Terre", y: cy, color: "#ffffff" }
    ];

    depths.forEach((d) => {
      // Tiret de graduation
      this.ctx.strokeStyle = d.color;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(axisX - 6, d.y);
      this.ctx.lineTo(axisX + 6, d.y);
      this.ctx.stroke();

      // Texte kilométrage
      this.ctx.fillStyle = d.color;
      this.ctx.font = "bold 9.5px monospace";
      this.ctx.textAlign = "right";
      this.ctx.fillText(d.km, axisX - 10, d.y + 3);

      // Label
      this.ctx.fillStyle = "#cbd5e1";
      this.ctx.font = "9px sans-serif";
      this.ctx.textAlign = "left";
      this.ctx.fillText(d.label, axisX + 12, d.y + 3);
    });

    this.ctx.restore();
  }

  // Pastilles d'appel de Zoom cliquables sur le globe
  drawZoomPillsOnGlobe(cx, cy, R) {
    this.ctx.save();

    // 1. Zoom 1 : Sommet (Dorsale / Remontée chaude)
    const z1X = cx;
    const z1Y = cy - R - 24;
    this.drawInteractivePill(z1X, z1Y, "🔍 ZOOM 1 : DORSALE (Remontée)", "#ef4444", true);

    // 2. Zoom 2 : Flanc droit (Subduction / Descente froide)
    const subAngle = -Math.PI * 0.25;
    const z2X = cx + Math.cos(subAngle) * (R + 32);
    const z2Y = cy + Math.sin(subAngle) * (R + 32);
    this.drawInteractivePill(z2X, z2Y, "🔍 ZOOM 2 : SUBDUCTION (Descente)", "#0284c7", false);

    // 3. Zoom 3 : Flanc gauche (Séismes / Foyer)
    const seisAngle = -Math.PI * 0.75;
    const z3X = cx + Math.cos(seisAngle) * (R + 32);
    const z3Y = cy + Math.sin(seisAngle) * (R + 32);
    this.drawInteractivePill(z3X, z3Y, "🔍 ZOOM 3 : SÉISMES (Cassure)", "#f59e0b", false);

    this.ctx.restore();
  }

  drawInteractivePill(x, y, text, borderColor, isCentered) {
    this.ctx.font = "bold 10px sans-serif";
    const textW = this.ctx.measureText(text).width;
    const pillW = textW + 20;
    const pillH = 26;
    const startX = isCentered ? x - pillW * 0.5 : x;
    const startY = y - pillH * 0.5;

    // Pulse animation
    const pulse = Math.sin(this.time * 4) * 2;

    this.ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    this.ctx.roundRect(startX - pulse * 0.5, startY - pulse * 0.5, pillW + pulse, pillH + pulse, 13);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, startX + pillW * 0.5, startY + pillH * 0.5);
  }

  // Légendes didactiques pour l'hémisphère
  drawHemiLabels(cx, cy, R, rNoyau, rGraine) {
    // Noyau terrestre
    this.drawBadge(cx, cy - rNoyau * 0.45, "NOYAU TERRESTRE (Très chaud)", "Source de chaleur : 2900 à 6371 km", "#facc15", true);

    // Courant chaud ascendant
    this.drawBadge(cx, cy - (rNoyau + R) * 0.5, "COURANT CHAUD ASCENDANT", "Matière moins dense qui monte dans l'asthénosphère", "#f97316", true);

    // Blocage par la lithosphère
    this.drawBadge(cx, cy - R + 14, "FLUX BLOQUÉ PAR LA LITHOSPHÈRE RIGIDE", "La roche rigide dévie le flux horizontalement", "#38bdf8", true);

    // Courant descendant
    const descX = cx + Math.cos(-Math.PI * 0.38) * ((rNoyau + R) * 0.5);
    const descY = cy + Math.sin(-Math.PI * 0.38) * ((rNoyau + R) * 0.5);
    this.drawBadge(descX, descY, "COURANT DESCENDANT", "Matière refroidie et dense qui plonge", "#38bdf8", true);
  }

  // =========================================================================
  // VUE 2 : ZOOM 1 - ÉTIREMENT DE LA LITHOSPHÈRE CONTINENTALE (150 KM)
  // APPARITION DE LA LITHOSPHÈRE OCÉANIQUE (100 KM) À LA DORSALE
  // ÉVACUATION DE LA CHALEUR INTERNE PAR VOLCANISME EFFUSIF SOUS-MARIN
  // =========================================================================
  renderDivergenceView() {
    const w = this.width;
    const h = this.height;

    // Ciel
    this.ctx.fillStyle = "#0c1527";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const litho150H = h * 0.30; // 150 km de lithosphère continentale
    const lithoBottom = surfaceY + litho150H;
    const asthBottom = h;

    // 1. Asthénosphère sous-jacente (ductile, chaude)
    const asthGrad = this.ctx.createLinearGradient(0, lithoBottom, 0, asthBottom);
    asthGrad.addColorStop(0, "#c2410c");
    asthGrad.addColorStop(1, "#ea580c");
    this.ctx.fillStyle = asthGrad;
    this.ctx.fillRect(0, lithoBottom, w, asthBottom - lithoBottom);

    // Panache ascendant chaud au centre (évacuation de chaleur)
    const centerX = w * 0.5;
    const plumeGrad = this.ctx.createRadialGradient(centerX, asthBottom, 20, centerX, lithoBottom, w * 0.25);
    plumeGrad.addColorStop(0, "rgba(254, 240, 138, 0.7)");
    plumeGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.35)");
    plumeGrad.addColorStop(1, "rgba(194, 65, 12, 0)");
    this.ctx.fillStyle = plumeGrad;
    this.ctx.fillRect(0, lithoBottom, w, asthBottom - lithoBottom);

    // Flèches d'ascension thermique
    this.drawAscendingArrows(centerX, lithoBottom, asthBottom);

    // Animation de l'étirement continental selon l'étape :
    // Étape 1 : Continent unique de 150 km avec étirement central et failles
    // Étape 2 : Séparation des deux blocs continentaux et inondation marine
    // Étape 3 : Dorsale océanique mature, volcanisme effusif et lithosphère océanique de 100 km
    const animOffset = (this.currentStep === 1) ? 25 : (this.currentStep === 2 ? 90 : 180);
    const splitProgress = Math.sin(this.time * 0.8) * 6;
    const effectiveSplit = animOffset + splitProgress;

    const blockLeftX = centerX - effectiveSplit;
    const blockRightX = centerX + effectiveSplit;

    // 2. Eau de mer (Océanisation à partir de l'étape 2)
    if (this.currentStep >= 2) {
      const seaGrad = this.ctx.createLinearGradient(0, surfaceY, 0, surfaceY + h * 0.12);
      seaGrad.addColorStop(0, "rgba(3, 105, 161, 0.85)");
      seaGrad.addColorStop(1, "rgba(12, 74, 110, 0.95)");
      this.ctx.fillStyle = seaGrad;
      this.ctx.fillRect(blockLeftX + 30, surfaceY, blockRightX - blockLeftX - 60, h * 0.14);

      // Vagues
      this.ctx.strokeStyle = "#38bdf8";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      for (let x = blockLeftX + 30; x <= blockRightX - 30; x += 10) {
        const y = surfaceY + Math.sin(x * 0.08 + this.time * 3) * 2;
        if (x === blockLeftX + 30) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }

    // 3. BLOC CONTINENTAL 1 (Gauche, épaisseur 150 km)
    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, surfaceY);
    this.ctx.lineTo(blockLeftX, surfaceY);
    // Faille normale inclinée
    this.ctx.lineTo(blockLeftX + 45, lithoBottom);
    this.ctx.lineTo(0, lithoBottom);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 4. BLOC CONTINENTAL 2 (Droit, épaisseur 150 km)
    this.ctx.beginPath();
    this.ctx.moveTo(blockRightX, surfaceY);
    this.ctx.lineTo(w, surfaceY);
    this.ctx.lineTo(w, lithoBottom);
    this.ctx.lineTo(blockRightX - 45, lithoBottom);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Failles normales d'étirement
    this.drawFaultLine(blockLeftX - 40, surfaceY, blockLeftX + 15, lithoBottom);
    this.drawFaultLine(blockRightX + 40, surfaceY, blockRightX - 15, lithoBottom);

    // 5. APPARITION DE LA LITHOSPHÈRE OCÉANIQUE (100 KM) & DORSALE (Étape 3)
    if (this.currentStep === 3) {
      const oce100H = litho150H * (100 / 150); // Échelle rigoureuse : 100 km vs 150 km
      const oceBottom = surfaceY + oce100H;

      // Lithosphère océanique néoformée
      this.ctx.fillStyle = "#1e4d6b";
      this.ctx.beginPath();
      this.ctx.moveTo(blockLeftX + 40, surfaceY + h * 0.12);
      this.ctx.lineTo(centerX - 12, surfaceY + h * 0.07); // Crête de la dorsale
      this.ctx.lineTo(centerX + 12, surfaceY + h * 0.07);
      this.ctx.lineTo(blockRightX - 40, surfaceY + h * 0.12);
      this.ctx.lineTo(blockRightX - 45, oceBottom);
      this.ctx.lineTo(centerX, oceBottom + 8);
      this.ctx.lineTo(blockLeftX + 45, oceBottom);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Chambre magmatique liquide sous la dorsale
      this.ctx.fillStyle = "#ef4444";
      this.ctx.beginPath();
      this.ctx.ellipse(centerX, oceBottom - 6, 26, 14, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Évacuation de chaleur : Magma liquide fluide en surface
      this.ctx.fillStyle = "#f97316";
      this.ctx.beginPath();
      this.ctx.moveTo(centerX - 8, surfaceY + h * 0.07);
      this.ctx.lineTo(centerX + 8, surfaceY + h * 0.07);
      this.ctx.lineTo(centerX + 24, surfaceY + h * 0.10);
      this.ctx.lineTo(centerX - 24, surfaceY + h * 0.10);
      this.ctx.closePath();
      this.ctx.fill();

      // Laves en coussins (pillow-lavas) refroidies au contact de l'eau
      this.drawPillowLavas(centerX, surfaceY + h * 0.07);

      // Flèches d'écartement océanique
      this.drawMotionArrow(centerX - 65, surfaceY + h * 0.11, -1, "Expansion");
      this.drawMotionArrow(centerX + 65, surfaceY + h * 0.11, 1, "Expansion");
    }

    // Échelle kilométrique cartésienne (verticale & horizontale)
    if (this.showGrid) {
      this.drawZoomMetricScale(surfaceY, litho150H, 150);
    }

    // Légendes didactiques
    if (this.showLabels) {
      this.drawBadge(blockLeftX * 0.5, surfaceY + 22, "BLOC CONTINENTAL 1", "Épaisseur : 150 km (Rigide)", "#8b5e3c");
      this.drawBadge(blockRightX + (w - blockRightX) * 0.5, surfaceY + 22, "BLOC CONTINENTAL 2", "Épaisseur : 150 km (Rigide)", "#8b5e3c");
      if (this.currentStep === 1) {
        this.drawBadge(centerX, surfaceY - 20, "ÉTIRATION & RIFT CONTINENTAL", "Failles normales cassantes dans la lithosphère rigide", "#ef4444", true);
      } else if (this.currentStep === 2) {
        this.drawBadge(centerX, surfaceY + 20, "SÉPARATION DES BLOCS & OCÉANISATION", "Inondation du fossé par l'eau de mer", "#0284c7", true);
      } else {
        this.drawBadge(centerX, surfaceY - 25, "DORSALE OCÉANIQUE (Évacuation de chaleur)", "Volcanisme effusif sous-marin (magma liquide fluide)", "#ef4444", true);
        this.drawBadge(centerX, surfaceY + h * 0.13, "LITHOSPHÈRE OCÉANIQUE NÉOFORMÉE", "Épaisseur : 100 km (créée en continu)", "#1e4d6b", true);
      }
      this.drawBadge(centerX, asthBottom - 25, "ASTHÉNOSPHÈRE MOINS RIGIDE", "Courant ascendant chaud : matière moins dense monte", "#ea580c", true);
    }
  }

  // =========================================================================
  // VUE 3 : ZOOM 2 - SUBDUCTION & VOLCANISME EXPLOSIF LÀ OÙ LA CHALEUR REDESCEND
  // =========================================================================
  renderSubductionView() {
    const w = this.width;
    const h = this.height;

    // Ciel
    this.ctx.fillStyle = "#0a101f";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const fosseX = w * 0.38;

    // 1. Asthénosphère ductile avec courant descendant
    const asthGrad = this.ctx.createLinearGradient(0, surfaceY, 0, h);
    asthGrad.addColorStop(0, "#9a3412");
    asthGrad.addColorStop(1, "#c2410c");
    this.ctx.fillStyle = asthGrad;
    this.ctx.fillRect(0, surfaceY, w, h - surfaceY);

    // Flèches du courant descendant dans l'asthénosphère
    this.drawDescendingConvectionArrows(fosseX + 50, surfaceY + 120, h - 30);

    // 2. Eau de mer (Fosse océanique)
    this.ctx.fillStyle = "rgba(3, 105, 161, 0.85)";
    this.ctx.beginPath();
    this.ctx.moveTo(0, surfaceY);
    this.ctx.lineTo(fosseX, surfaceY + 26);
    this.ctx.lineTo(fosseX + 22, surfaceY);
    this.ctx.lineTo(0, surfaceY);
    this.ctx.closePath();
    this.ctx.fill();

    // 3. PLAQUE OCÉANIQUE PLONGEANTE (100 km, dense, refroidie)
    const oce100H = h * 0.13;
    const dipAngle = 0.55;
    const slabEndX = fosseX + Math.cos(dipAngle) * (h * 0.82);
    const slabEndY = surfaceY + Math.sin(dipAngle) * (h * 0.82);

    this.ctx.fillStyle = "#1e3a5f";
    this.ctx.strokeStyle = "#0f233d";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, surfaceY + 8);
    this.ctx.lineTo(fosseX, surfaceY + 26);
    this.ctx.lineTo(slabEndX, slabEndY);
    this.ctx.lineTo(slabEndX - oce100H * 0.8, slabEndY + oce100H * 0.3);
    this.ctx.lineTo(fosseX - oce100H * 0.7, surfaceY + oce100H + 26);
    this.ctx.lineTo(0, surfaceY + oce100H);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 4. DÉSHYDRATATION DE LA PLAQUE PLONGEANTE (Étape 2 & 3)
    if (this.currentStep >= 2) {
      this.ctx.fillStyle = "#67e8f9";
      for (let i = 0; i < 20; i++) {
        const tOffset = (this.time * 2.2 + i * 0.4) % 3;
        const startX = fosseX + 75 + i * 12;
        const startY = surfaceY + 95 + i * 14;
        const curY = startY - tOffset * 24;
        const curX = startX + Math.sin(this.time * 4 + i) * 4;

        if (curY > surfaceY + 45) {
          this.ctx.beginPath();
          this.ctx.arc(curX, curY, 3, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      // Zone de fusion partielle (magma visqueux enrichi en silice & gaz)
      const meltX = fosseX + 165;
      const meltY = surfaceY + 75;
      const meltGrad = this.ctx.createRadialGradient(meltX, meltY, 5, meltX, meltY, 42);
      meltGrad.addColorStop(0, "rgba(250, 204, 21, 0.95)");
      meltGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.65)");
      meltGrad.addColorStop(1, "rgba(185, 28, 28, 0)");
      this.ctx.fillStyle = meltGrad;
      this.ctx.beginPath();
      this.ctx.arc(meltX, meltY, 45, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 5. PLAQUE CONTINENTALE CHEVAUCHANTE (150 km)
    const cont150H = oce100H * 1.5; // Rapport exact 150 km / 100 km
    const volcanoX = fosseX + 165;

    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(fosseX + 22, surfaceY);
    this.ctx.lineTo(volcanoX - 60, surfaceY);
    // Cône volcanique
    this.ctx.lineTo(volcanoX - 25, surfaceY - 55);
    this.ctx.lineTo(volcanoX + 25, surfaceY - 55);
    this.ctx.lineTo(volcanoX + 60, surfaceY);
    this.ctx.lineTo(w, surfaceY);
    this.ctx.lineTo(w, surfaceY + cont150H);
    this.ctx.lineTo(fosseX + 125, surfaceY + cont150H);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 6. MAGMA VISQUEUX & ÉRUPTION EXPLOSIVE (Étape 3)
    if (this.currentStep === 3) {
      // Cheminée magmatique
      this.ctx.fillStyle = "#ef4444";
      this.ctx.beginPath();
      this.ctx.moveTo(volcanoX - 10, surfaceY + 75);
      this.ctx.lineTo(volcanoX + 10, surfaceY + 75);
      this.ctx.lineTo(volcanoX + 8, surfaceY - 45);
      this.ctx.lineTo(volcanoX - 8, surfaceY - 45);
      this.ctx.closePath();
      this.ctx.fill();

      // Dôme de lave visqueuse bouchant le cratère
      this.ctx.fillStyle = "#7f1d1d";
      this.ctx.beginPath();
      this.ctx.arc(volcanoX, surfaceY - 52, 14, Math.PI, 0);
      this.ctx.fill();

      // Panache explosif géant (cendres et gaz)
      const plumeBaseY = surfaceY - 55;
      this.ctx.fillStyle = "rgba(71, 85, 105, 0.78)";
      for (let p = 0; p < 13; p++) {
        const py = plumeBaseY - p * 12 - ((this.time * 30 + p * 15) % 65);
        const spread = (p * 5.5) + Math.sin(this.time * 3 + p) * 8;
        this.ctx.beginPath();
        this.ctx.arc(volcanoX + spread * 0.45, py, 12 + p * 3, 0, Math.PI * 2);
        this.ctx.arc(volcanoX - spread * 0.45, py, 12 + p * 3, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Projections incandescentes
      this.ctx.fillStyle = "#fbbf24";
      for (let b = 0; b < 6; b++) {
        const bx = volcanoX + Math.sin(this.time * 6 + b) * (20 + b * 10);
        const by = plumeBaseY - 20 - ((this.time * 50 + b * 20) % 55);
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Échelle métrique en profondeur
    if (this.showGrid) {
      this.drawZoomMetricScale(surfaceY, cont150H, 150);
    }

    // Flèches de subduction
    this.drawMotionArrow(fosseX - 45, surfaceY + 45, 1, "Plongement");

    // Légendes
    if (this.showLabels) {
      this.drawBadge(fosseX - 100, surfaceY - 15, "FOSSE OCÉANIQUE", "Zone de convergence", "#0284c7");
      this.drawBadge(w * 0.15, surfaceY + oce100H * 0.5, "LITHOSPHÈRE OCÉANIQUE", "Épaisseur : 100 km (Dense & Froide)", "#1e3a5f");
      this.drawBadge(volcanoX + 120, surfaceY - 25, "VOLCANISME EXPLOSIF", "Magma visqueux riche en silice & gaz", "#ef4444");
      this.drawBadge(w * 0.78, surfaceY + cont150H * 0.4, "LITHOSPHÈRE CONTINENTALE", "Chevauchante (150 km)", "#8b5e3c");
      if (this.currentStep >= 2) {
        this.drawBadge(fosseX + 145, surfaceY + 120, "DÉSHYDRATATION DE LA PLAQUE", "L'eau libérée fait fondre le manteau", "#67e8f9");
      }
    }
  }

  // =========================================================================
  // VUE 4 : ZOOM 3 - SÉISME, RUPTURE AU FOYER, ONDES & SISMOGRAMMES DIFFÉRÉS
  // =========================================================================
  renderSeismeView() {
    const w = this.width;
    const h = this.height;

    // Secousse visuelle de la caméra si séisme actif
    if (this.seismeState.shakingIntensity > 0.05) {
      const shakeX = (Math.random() - 0.5) * 8 * this.seismeState.shakingIntensity;
      const shakeY = (Math.random() - 0.5) * 6 * this.seismeState.shakingIntensity;
      this.ctx.translate(shakeX, shakeY);
      this.seismeState.shakingIntensity *= 0.96;
    }

    // Ciel
    this.ctx.fillStyle = "#0c1527";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const litho150H = h * 0.35; // 150 km de lithosphère rigide
    const lithoBottom = surfaceY + litho150H;

    // 1. Asthénosphère ductile en bas (ne casse pas)
    this.ctx.fillStyle = "#c2410c";
    this.ctx.fillRect(0, lithoBottom, w, h - lithoBottom);

    // 2. Lithosphère continentale rigide (seule capable de casser)
    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(0, surfaceY, w, litho150H);

    // Positions clés
    const foyerX = w * 0.32;
    const foyerY = surfaceY + litho150H * 0.52; // Foyer à ~35-40 km de profondeur
    const epicentreX = foyerX;
    const epicentreY = surfaceY;

    this.seismeState.foyer = { x: foyerX, y: foyerY };
    this.seismeState.epicentre = { x: epicentreX, y: epicentreY };

    // Faille compressive inclinée
    this.ctx.strokeStyle = "#f87171";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(foyerX - 60, surfaceY);
    this.ctx.lineTo(foyerX + 70, lithoBottom);
    this.ctx.stroke();

    // Contraintes de compression
    if (!this.seismeState.triggered) {
      const pulse = Math.sin(this.time * 6) * 4;
      this.drawCompressiveArrow(foyerX - 110 + pulse, foyerY - 20, 1);
      this.drawCompressiveArrow(foyerX + 110 - pulse, foyerY + 20, -1);
    }

    // 3. PROPAGATION DES ONDES SISMIQUES CONCENTRIQUES
    if (this.seismeState.triggered) {
      this.seismeState.waveRadius += 3.2 * this.speed;

      for (let r = this.seismeState.waveRadius; r > 0; r -= 26) {
        if (r > 0 && r < w * 1.2) {
          const alpha = Math.max(0, 1 - r / (w * 0.9));
          this.ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
          this.ctx.lineWidth = 2.5;
          this.ctx.beginPath();
          this.ctx.arc(foyerX, foyerY, r, 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }

      // Flash de rupture au foyer
      this.ctx.fillStyle = "#ef4444";
      this.ctx.beginPath();
      this.ctx.arc(foyerX, foyerY, 8 + Math.sin(this.time * 15) * 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. VILLES ET SISMOMÈTRES EN SURFACE
    // Ville A (25 km de l'épicentre)
    const villeAX = foyerX + 85;
    this.seismeState.stationA.x = villeAX;
    this.seismeState.stationA.y = surfaceY;

    // Ville B (95 km de l'épicentre)
    const villeBX = foyerX + 325;
    this.seismeState.stationB.x = villeBX;
    this.seismeState.stationB.y = surfaceY;

    // Épicentre à la verticale exacte
    this.drawEpicentreZone(epicentreX, epicentreY);

    // Détection d'arrivée des ondes à Ville A
    const distToA = Math.hypot(villeAX - foyerX, surfaceY - foyerY);
    const reachedA = this.seismeState.waveRadius >= distToA;
    if (reachedA && !this.seismeState.stationA.reached) {
      this.seismeState.stationA.reached = true;
      document.getElementById("statusA").textContent = "Ondes reçues ! Forte secousse";
      document.getElementById("statusA").style.color = "#ef4444";
    }
    this.drawBuilding(villeAX, surfaceY, "standard", reachedA);

    // Détection d'arrivée des ondes à Ville B (avec retard !)
    const distToB = Math.hypot(villeBX - foyerX, surfaceY - foyerY);
    const reachedB = this.seismeState.waveRadius >= distToB;
    if (reachedB && !this.seismeState.stationB.reached) {
      this.seismeState.stationB.reached = true;
      document.getElementById("statusB").textContent = "Ondes reçues avec RETARD ! Secousse atténuée";
      document.getElementById("statusB").style.color = "#4ade80";
    }
    this.drawBuilding(villeBX, surfaceY, "parasismique", reachedB);

    // Point FOYER
    this.ctx.fillStyle = "#fbbf24";
    this.ctx.strokeStyle = "#b45309";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(foyerX, foyerY, 7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Ligne verticale Foyer ➔ Épicentre
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(foyerX, foyerY);
    this.ctx.lineTo(epicentreX, epicentreY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Échelle métrique en profondeur
    if (this.showGrid) {
      this.drawZoomMetricScale(surfaceY, litho150H, 150);
    }

    // Légendes
    if (this.showLabels) {
      this.drawBadge(foyerX, foyerY + 28, "FOYER SISMIQUE (Hypocentre)", "Rupture brutale de la roche rigide", "#ef4444", true);
      this.drawBadge(epicentreX, epicentreY - 45, "ÉPICENTRE", "Point en surface à la verticale du foyer (dégâts maximaux)", "#f59e0b", true);
      this.drawBadge(villeAX, surfaceY - 55, "VILLE A (25 km)", "Bâtiment ordinaire écroulé", "#ef4444");
      this.drawBadge(villeBX, surfaceY - 55, "VILLE B (95 km)", "Maison PARASISMIQUE intacte", "#22c55e");
      this.drawBadge(w * 0.18, lithoBottom - 25, "LITHOSPHÈRE RIGIDE (150 km)", "Seule capable de casser !", "#8b5e3c");
      this.drawBadge(w * 0.18, lithoBottom + 30, "ASTHÉNOSPHÈRE DUCTILE", "Se déforme plastiquement (ne casse pas)", "#c2410c");
    }

    // Reset translation if shaken
    this.ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
  }

  // =========================================================================
  // GESTION DES SISMOGRAMMES EN TEMPS RÉEL (CANVAS A & B)
  // =========================================================================
  updateAndDrawSismograms() {
    let ampA = 0;
    let ampB = 0;

    if (this.seismeState.triggered) {
      if (this.seismeState.stationA.reached) {
        const elapsedA = this.time - this.seismeState.ruptureTime;
        ampA = Math.sin(this.time * 24) * 24 * Math.exp(-elapsedA * 0.4);
      }
      if (this.seismeState.stationB.reached) {
        const elapsedB = this.time - (this.seismeState.ruptureTime + 1.2);
        ampB = Math.sin(this.time * 18) * 10 * Math.exp(-elapsedB * 0.35);
      }
    }

    this.historySeismoA.shift();
    this.historySeismoA.push(ampA);

    this.historySeismoB.shift();
    this.historySeismoB.push(ampB);

    this.drawSeismoCanvas(this.ctxSeismoA, this.canvasSeismoA, this.historySeismoA, "#f87171");
    this.drawSeismoCanvas(this.ctxSeismoB, this.canvasSeismoB, this.historySeismoB, "#4ade80");
  }

  drawSeismoCanvas(ctx, canvas, history, strokeColor) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grille
    ctx.strokeStyle = "#17233d";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const midY = h * 0.5;
    ctx.strokeStyle = "#25334d";
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const stepX = w / history.length;
    for (let i = 0; i < history.length; i++) {
      const px = i * stepX;
      const py = midY - history[i];
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const currentY = midY - history[history.length - 1];
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(w - 4, currentY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // OUTILS DE DESSIN COMMUNS (ÉCHELLES, FLÈCHES, TEXTES, BÂTIMENTS)
  // =========================================================================
  drawZoomMetricScale(surfaceY, pixelHeight, realKm) {
    this.ctx.save();
    const x = 32;

    this.ctx.strokeStyle = "#38bdf8";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, surfaceY);
    this.ctx.lineTo(x, surfaceY + pixelHeight);
    this.ctx.stroke();

    // Graduations
    [0, 50, 100, 150].forEach((km) => {
      if (km <= realKm) {
        const y = surfaceY + (km / realKm) * pixelHeight;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 5, y);
        this.ctx.lineTo(x + 5, y);
        this.ctx.stroke();

        this.ctx.fillStyle = "#38bdf8";
        this.ctx.font = "bold 9px monospace";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`${km} km`, x + 8, y + 3);
      }
    });

    this.ctx.restore();
  }

  drawAscendingArrows(centerX, topY, bottomY) {
    this.ctx.fillStyle = "rgba(254, 240, 138, 0.75)";
    for (let i = 0; i < 4; i++) {
      const y = bottomY - 30 - ((this.time * 40 + i * 45) % (bottomY - topY - 50));
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, y);
      this.ctx.lineTo(centerX - 10, y + 14);
      this.ctx.lineTo(centerX + 10, y + 14);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  drawDescendingConvectionArrows(x, topY, bottomY) {
    this.ctx.fillStyle = "rgba(56, 189, 248, 0.65)";
    for (let i = 0; i < 3; i++) {
      const y = topY + ((this.time * 35 + i * 45) % (bottomY - topY));
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + 14);
      this.ctx.lineTo(x - 9, y);
      this.ctx.lineTo(x + 9, y);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  drawFaultLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = "rgba(248, 113, 113, 0.85)";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawPillowLavas(centerX, topY) {
    this.ctx.fillStyle = "#7c2d12";
    this.ctx.strokeStyle = "#ea580c";
    this.ctx.lineWidth = 1.5;
    const positions = [
      { dx: -12, dy: 4, r: 5 },
      { dx: 14, dy: 5, r: 6 },
      { dx: -24, dy: 10, r: 7 },
      { dx: 22, dy: 11, r: 6.5 },
      { dx: 0, dy: 8, r: 5.5 }
    ];
    positions.forEach((p) => {
      this.ctx.beginPath();
      this.ctx.arc(centerX + p.dx, topY + p.dy, p.r, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    });
  }

  drawEpicentreZone(x, y) {
    this.ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 35, 10, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawBuilding(x, groundY, type, isDamaged) {
    if (type === "standard") {
      this.ctx.fillStyle = isDamaged ? "#64748b" : "#94a3b8";
      this.ctx.strokeStyle = "#334155";
      this.ctx.lineWidth = 1.5;

      if (!isDamaged) {
        this.ctx.fillRect(x - 16, groundY - 32, 32, 32);
        this.ctx.strokeRect(x - 16, groundY - 32, 32, 32);
        this.ctx.fillStyle = "#fef08a";
        this.ctx.fillRect(x - 12, groundY - 26, 8, 8);
        this.ctx.fillRect(x + 4, groundY - 26, 8, 8);
      } else {
        this.ctx.beginPath();
        this.ctx.moveTo(x - 16, groundY);
        this.ctx.lineTo(x - 14, groundY - 18);
        this.ctx.lineTo(x + 2, groundY - 24);
        this.ctx.lineTo(x + 16, groundY - 10);
        this.ctx.lineTo(x + 16, groundY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.strokeStyle = "#ef4444";
        this.ctx.beginPath();
        this.ctx.moveTo(x - 5, groundY - 18);
        this.ctx.lineTo(x + 3, groundY - 8);
        this.ctx.stroke();
      }
    } else {
      this.ctx.fillStyle = "#38bdf8";
      this.ctx.strokeStyle = "#0284c7";
      this.ctx.lineWidth = 2;

      this.ctx.fillStyle = "#64748b";
      this.ctx.fillRect(x - 16, groundY - 4, 8, 4);
      this.ctx.fillRect(x + 8, groundY - 4, 8, 4);

      this.ctx.fillStyle = "#0284c7";
      this.ctx.fillRect(x - 18, groundY - 30, 36, 26);
      this.ctx.strokeRect(x - 18, groundY - 30, 36, 26);

      this.ctx.fillStyle = "#22c55e";
      this.ctx.beginPath();
      this.ctx.moveTo(x - 22, groundY - 30);
      this.ctx.lineTo(x, groundY - 44);
      this.ctx.lineTo(x + 22, groundY - 30);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      this.ctx.beginPath();
      this.ctx.moveTo(x - 14, groundY - 26);
      this.ctx.lineTo(x + 14, groundY - 8);
      this.ctx.moveTo(x + 14, groundY - 26);
      this.ctx.lineTo(x - 14, groundY - 8);
      this.ctx.stroke();
    }
  }

  drawCompressiveArrow(x, y, dir) {
    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x - dir * 20, y - 10);
    this.ctx.lineTo(x - dir * 20, y - 4);
    this.ctx.lineTo(x - dir * 35, y - 4);
    this.ctx.lineTo(x - dir * 35, y + 4);
    this.ctx.lineTo(x - dir * 20, y + 4);
    this.ctx.lineTo(x - dir * 20, y + 10);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawBadge(x, y, title, subtitle, color, isCentered = false) {
    this.ctx.save();
    this.ctx.font = "bold 11px sans-serif";
    const titleWidth = this.ctx.measureText(title).width;
    this.ctx.font = "9.5px sans-serif";
    const subWidth = this.ctx.measureText(subtitle).width;
    const boxWidth = Math.max(titleWidth, subWidth) + 16;
    const boxHeight = 28;

    const startX = isCentered ? x - boxWidth * 0.5 : x;
    const startY = y - boxHeight * 0.5;

    this.ctx.fillStyle = "rgba(15, 23, 42, 0.90)";
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(startX, startY, boxWidth, boxHeight, 5);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "bold 10px sans-serif";
    this.ctx.fillText(title, startX + 8, startY + 11);

    this.ctx.fillStyle = "#94a3b8";
    this.ctx.font = "9px sans-serif";
    this.ctx.fillText(subtitle, startX + 8, startY + 23);

    this.ctx.restore();
  }

  drawMotionArrow(x, y, dir, label) {
    this.ctx.save();
    const arrowLen = 30;
    this.ctx.strokeStyle = "#38bdf8";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + dir * arrowLen, y);
    this.ctx.stroke();

    this.ctx.fillStyle = "#38bdf8";
    this.ctx.beginPath();
    this.ctx.moveTo(x + dir * (arrowLen + 6), y);
    this.ctx.lineTo(x + dir * (arrowLen - 2), y - 5);
    this.ctx.lineTo(x + dir * (arrowLen - 2), y + 5);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  // =========================================================================
  // GESTION DU QUIZ INTERACTIF
  // =========================================================================
  startQuiz() {
    this.quizIndex = 0;
    this.quizScore = 0;
    this.loadQuizQuestion();
    document.getElementById("btnNextQuiz").style.display = "none";
    document.getElementById("btnRestartQuiz").style.display = "none";
  }

  loadQuizQuestion() {
    const q = QUIZ_QUESTIONS[this.quizIndex];
    document.getElementById("quizStepLabel").textContent = `Question ${this.quizIndex + 1} sur ${QUIZ_QUESTIONS.length}`;
    document.getElementById("quizProgressFill").style.width = `${((this.quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`;
    document.getElementById("quizQuestionText").textContent = q.question;

    const optContainer = document.getElementById("quizOptions");
    optContainer.innerHTML = "";
    const feedback = document.getElementById("quizFeedback");
    feedback.style.display = "none";
    document.getElementById("btnNextQuiz").style.display = "none";

    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => this.handleQuizAnswer(idx));
      optContainer.appendChild(btn);
    });
  }

  handleQuizAnswer(selectedIndex) {
    const q = QUIZ_QUESTIONS[this.quizIndex];
    const buttons = document.querySelectorAll(".quiz-opt-btn");
    buttons.forEach((b) => (b.disabled = true));

    const feedback = document.getElementById("quizFeedback");

    if (selectedIndex === q.correct) {
      this.quizScore++;
      buttons[selectedIndex].classList.add("correct");
      feedback.className = "quiz-feedback success";
      feedback.innerHTML = `<strong>Exact !</strong> ${q.explanation}`;
    } else {
      buttons[selectedIndex].classList.add("wrong");
      buttons[q.correct].classList.add("correct");
      feedback.className = "quiz-feedback error";
      feedback.innerHTML = `<strong>Pas tout à fait...</strong> ${q.explanation}`;
    }
    feedback.style.display = "block";

    const btnNext = document.getElementById("btnNextQuiz");
    if (this.quizIndex < QUIZ_QUESTIONS.length - 1) {
      btnNext.style.display = "inline-flex";
      btnNext.onclick = () => {
        this.quizIndex++;
        this.loadQuizQuestion();
      };
    } else {
      btnNext.style.display = "none";
      const btnRestart = document.getElementById("btnRestartQuiz");
      btnRestart.style.display = "inline-flex";
      btnRestart.onclick = () => this.startQuiz();
      feedback.innerHTML += `<br><br>🏁 <strong>Quiz terminé ! Score : ${this.quizScore} / ${QUIZ_QUESTIONS.length}</strong>`;
    }
  }
}

// Initialisation dès que le DOM est prêt
window.addEventListener("DOMContentLoaded", () => {
  window.sim = new TectoniqueSimulation();
});
