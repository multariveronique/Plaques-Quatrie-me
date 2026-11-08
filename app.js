/**
 * Tectonique des Plaques - SVT 4ème
 * Animation pédagogique interactive
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
    title: "Le Moteur Thermique Planétaire & la Tectonique des Plaques",
    text: "La chaleur interne profonde (noyau et base du manteau) crée des courants de convection ascendants de matière chaude et moins dense. En surface, la lithosphère rigide (150 km sous les continents, 100 km sous les océans) repose sur l'asthénosphère moins rigide (ductile) et est mise en mouvement.",
    indicators: [
      "Lithosphère continentale : ~150 km (rigide)",
      "Lithosphère océanique : ~100 km (rigide)",
      "Asthénosphère : ductile (flue sans casser)",
      "Convection mantellique thermique"
    ],
    steps: [
      {
        num: 1,
        title: "Chaleur profonde & Ascension",
        desc: "La matière chaude moins dense s'élève depuis les profondeurs.",
        info: "À la frontière noyau-manteau, les roches chauffées deviennent moins denses. Elles s'élèvent très lentement (quelques cm par an) sous forme de panache chaud sous la lithosphère."
      },
      {
        num: 2,
        title: "Étalement sous la lithosphère",
        desc: "Le flux thermique se sépare à gauche et à droite, entraînant les plaques.",
        info: "Sous la lithosphère rigide, le courant thermique s'oriente horizontalement vers la droite et la gauche. Ce frottement visqueux entraîne les plaques rigides sus-jacentes : c'est la divergence au niveau de la dorsale."
      },
      {
        num: 3,
        title: "Refroidissement & Subduction",
        desc: "En s'éloignant, la plaque océanique refroidit, devient plus dense et plonge.",
        info: "À mesure qu'elle s'éloigne de la dorsale, la lithosphère océanique refroidit et s'épaissit. Devenue plus dense que l'asthénosphère sous-jacente, elle plonge dans les profondeurs : c'est la subduction."
      }
    ]
  },
  divergence: {
    title: "Divergence : Rifting Continental & Dorsale Océanique",
    text: "Sous l'effet du flux chaud ascendant, la lithosphère continentale rigide (150 km) s'amincit, se fracture en deux blocs qui s'écartent. L'océan s'installe et la sortie de chaleur à la dorsale crée un volcanisme effusif sous-marin (lave fluide).",
    indicators: [
      "Lithosphère continentale : 150 km",
      "Étirement & Failles normales",
      "Magma fluide / Basaltes en coussins",
      "Volcanisme effusif sous-marin"
    ],
    steps: [
      {
        num: 1,
        title: "Bombement & Rifting continental",
        desc: "Le continent épais de 150 km se fracture en deux blocs sous la chaleur.",
        info: "L'ascension thermique étire la lithosphère continentale. Rigide, celle-ci casse le long de failles normales, formant un fossé d'effondrement (rift continental)."
      },
      {
        num: 2,
        title: "Séparation des blocs & Océanisation",
        desc: "Les deux blocs continentaux s'écartent et l'eau de mer pénètre.",
        info: "L'écartement des blocs continentaux permet l'inondation par la mer. Le manteau chaud décomprimé commence à fondre partiellement."
      },
      {
        num: 3,
        title: "Dorsale océanique active",
        desc: "Volcanisme effusif sous-marin : création de nouvelle lithosphère océanique (~100 km).",
        info: "Le magma liquide fluide s'épanche sous l'eau à l'axe de la dorsale. Au contact de l'eau froide, il forme des laves en coussins (pillow-lavas) et constitue la nouvelle croûte océanique."
      }
    ]
  },
  subduction: {
    title: "Subduction & Genèse du Volcanisme Explosif",
    text: "La lithosphère océanique refroidie et dense (100 km) plonge sous la lithosphère continentale (150 km) dans l'asthénosphère. Elle se déshydrate, provoquant la fusion du manteau et la montée d'un magma visqueux très explosif en surface.",
    indicators: [
      "Lithosphère océanique plongeante : 100 km (dense)",
      "Lithosphère continentale chevauchante : 150 km",
      "Déshydratation minérale en profondeur",
      "Magma visqueux & Éruptions explosives"
    ],
    steps: [
      {
        num: 1,
        title: "Plongement de la plaque dense",
        desc: "La lithosphère océanique s'enfonce dans l'asthénosphère ductile.",
        info: "Plus dense que l'asthénosphère chaude, la vieille plaque océanique plonge inexorablement, formant une fosse océanique profonde."
      },
      {
        num: 2,
        title: "Déshydratation & Fusion partielle",
        desc: "L'eau libérée fait fondre les roches de l'asthénosphère sus-jacente.",
        info: "Sous l'augmentation de pression et de température, les minéraux hydratés libèrent leur eau. Cette eau abaisse la température de fusion des roches du manteau, générant un magma riche en silice."
      },
      {
        num: 3,
        title: "Remontée & Éruption explosive",
        desc: "Le magma visqueux remonte la lithosphère continentale et explose en surface.",
        info: "Ce magma très visqueux emprisonne les gaz sous pression. En arrivant à la surface de la plaque continentale, il forme un dôme de lave et explose violemment (nuées ardentes, panache de cendres)."
      }
    ]
  },
  seisme: {
    title: "Séisme : Foyer, Propagation des Ondes & Sismogrammes",
    text: "Les contraintes de compression en convergence bloquent la faille dans la lithosphère rigide. Quand la roche casse au FOYER (hypocentre), l'énergie est libérée sous forme d'ondes sismiques se propageant vers la surface. L'ÉPICENTRE subit les dégâts maximaux.",
    indicators: [
      "Foyer (Hypocentre) : rupture rocheuse en profondeur",
      "Épicentre : point vertical en surface (dégâts max)",
      "Ondes sismiques concentriques (P et S)",
      "Normes parasismiques protectrices",
      "Enregistrements décalés dans le temps (Δt)"
    ],
    steps: [
      {
        num: 1,
        title: "Accumulation des contraintes",
        desc: "La lithosphère rigide est comprimée mais la faille reste bloquée.",
        info: "Les mouvements des plaques exercent une pression colossale. L'asthénosphère déforme plastiquement, mais la lithosphère rigide accumule de l'énergie élastique jusqu'à son point de rupture."
      },
      {
        num: 2,
        title: "Rupture au Foyer & Ondes sismiques",
        desc: "La roche casse brutalement au foyer, libérant des trains d'ondes.",
        info: "La faille cède d'un coup. Le point d'origine est le foyer sismique. Les vibrations (ondes sismiques) se propagent en sphères concentriques à travers les roches."
      },
      {
        num: 3,
        title: "Épicentre, Dégâts & Sismogrammes",
        desc: "Arrivée différée des ondes dans les villes et tracé des sismogrammes.",
        info: "L'épicentre subit le choc maximal. Les bâtiments ordinaires s'écroulent, tandis que la maison aux normes parasismiques résiste. Les villes enregistrent les ondes avec un retard proportionnel à leur distance."
      }
    ]
  }
};

// Questions du Quiz SVT 4ème
const QUIZ_QUESTIONS = [
  {
    question: "Quelle enveloppe terrestre est RIGIDE et la SEULE capable de casser pour provoquer des séismes ?",
    options: [
      "L'asthénosphère (couche chaude et déformable)",
      "La lithosphère (plaques de 100 à 150 km d'épaisseur)",
      "Le noyau externe (liquide)",
      "L'atmosphère terrestre"
    ],
    correct: 1,
    explanation: "Exact ! Seule la lithosphère est rigide et cassante. L'asthénosphère sous-jacente est moins rigide (ductile) et se déforme plastiquement sans jamais casser."
  },
  {
    question: "Quel est le moteur principal qui met en mouvement les plaques lithosphériques ?",
    options: [
      "La force d'attraction de la Lune (marées)",
      "Le vent et les courants marins de surface",
      "La convection thermique : la matière chaude moins dense monte depuis les profondeurs",
      "La rotation rapide du noyau terrestre"
    ],
    correct: 2,
    explanation: "Bravo ! La chaleur issue du noyau et des profondeurs réchauffe le manteau. La roche chaude, moins dense, monte lentement, s'étale sous la lithosphère puis replonge en se refroidissant."
  },
  {
    question: "Au niveau d'une dorsale océanique (zone de divergence), quel type de volcanisme observe-t-on sous l'eau ?",
    options: [
      "Un volcanisme explosif avec panache de cendres géant",
      "Un volcanisme effusif avec magma liquide fluide formant des laves en coussins",
      "Aucun volcanisme, uniquement de la glace",
      "Des éruptions de gaz uniquement sans magma"
    ],
    correct: 1,
    explanation: "Exactement ! À la dorsale, la décompression crée un magma fluide qui s'épanche sous la mer de façon effusive, formant des coussins de basalte (pillow lavas)."
  },
  {
    question: "Dans une zone de subduction, comment se forme le magma visqueux à l'origine d'éruptions explosives ?",
    options: [
      "Par frottement direct du continent contre le soleil",
      "La plaque océanique dense plonge, se déshydrate et l'eau libérée fait fondre le manteau",
      "L'eau de mer s'infiltre jusqu'au noyau métallique",
      "Le magma vient directement de l'espace par des météorites"
    ],
    correct: 1,
    explanation: "Parfait ! La lithosphère océanique dense plonge dans l'asthénosphère et libère son eau. Cette eau abaisse la température de fusion du manteau, produisant un magma riche en silice et très visqueux."
  },
  {
    question: "Pourquoi une ville éloignée (Ville B) enregistre-t-elle le séisme plus tard qu'une ville proche (Ville A) ?",
    options: [
      "Parce que le sismomètre de la ville B est cassé",
      "Parce que les ondes sismiques se propagent à une vitesse finie à travers les roches",
      "Parce que la terre tourne dans le sens inverse des ondes",
      "Parce que le séisme a lieu en deux temps différents"
    ],
    correct: 1,
    explanation: "Excellent ! Les ondes sismiques voyagent dans la roche à une vitesse comprise entre 3 et 8 km/s. Elles arrivent donc plus tard à la station B, et leur amplitude y est plus faible !"
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

    // Particules de convection pour la vue globale
    this.particles = [];
    this.initConvectionParticles();

    // État du séisme
    this.seismeState = {
      triggered: false,
      ruptureTime: 0,
      foyer: { x: 0, y: 0 },
      epicentre: { x: 0, y: 0 },
      waveRadius: 0,
      stationA: { x: 0, y: 0, dist: 25, arrivalTime: 0, reached: false },
      stationB: { x: 0, y: 0, dist: 95, arrivalTime: 0, reached: false },
      shakingIntensity: 0
    };

    // Canvas Sismogrammes
    this.canvasSeismoA = document.getElementById("canvasSeismoA");
    this.ctxSeismoA = this.canvasSeismoA.getContext("2d");
    this.canvasSeismoB = document.getElementById("canvasSeismoB");
    this.ctxSeismoB = this.canvasSeismoB.getContext("2d");

    this.historySeismoA = new Array(150).fill(0);
    this.historySeismoB = new Array(150).fill(0);

    // Particules de magma / éruption
    this.magmaParticles = [];
    this.subductionFluids = [];

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

  initConvectionParticles() {
    this.particles = [];
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        loop: Math.random() < 0.5 ? "left" : "right",
        angle: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.003,
        radiusX: 0.16 + Math.random() * 0.08,
        radiusY: 0.12 + Math.random() * 0.06,
        size: 2.5 + Math.random() * 2.5
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
      btn.addEventListener("click", (e) => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Boutons de contrôle
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

    // Afficher ou masquer le bouton de déclenchement du séisme
    const seismeOverlay = document.getElementById("seismeTriggerOverlay");
    seismeOverlay.style.display = viewName === "seisme" ? "flex" : "none";

    // Afficher / masquer le panneau sismogrammes dans la colonne latérale
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

    document.getElementById("statusA").textContent = "Propagation en cours...";
    document.getElementById("statusB").textContent = "Propagation en cours...";
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
  animate(timestamp) {
    if (this.isPlaying) {
      this.time += 0.016 * this.speed;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.currentView) {
      case "global":
        this.renderGlobalView();
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
  // VUE 1 : VUE GLOBALE - LE MOTEUR THERMIQUE & CONVECTION MANTELLIQUE
  // =========================================================================
  renderGlobalView() {
    const w = this.width;
    const h = this.height;

    // Fond ciel / espace
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, h * 0.22);
    skyGrad.addColorStop(0, "#030712");
    skyGrad.addColorStop(1, "#0c182c");
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, w, h * 0.22);

    // 1. ASTHÉNOSPHÈRE (Manteau déformable, chaud, ductile)
    const asthTop = h * 0.22;
    const asthBottom = h * 0.85;
    const asthGrad = this.ctx.createLinearGradient(0, asthTop, 0, asthBottom);
    asthGrad.addColorStop(0, "#993d18");
    asthGrad.addColorStop(0.5, "#bd4917");
    asthGrad.addColorStop(1, "#dc541b");
    this.ctx.fillStyle = asthGrad;
    this.ctx.fillRect(0, asthTop, w, asthBottom - asthTop);

    // 2. NOYAU TERRESTRE (Base très chaude, source de chaleur profonde)
    const coreGrad = this.ctx.createLinearGradient(0, asthBottom, 0, h);
    coreGrad.addColorStop(0, "#f59f00");
    coreGrad.addColorStop(0.4, "#fef08a");
    coreGrad.addColorStop(1, "#eab308");
    this.ctx.fillStyle = coreGrad;
    this.ctx.fillRect(0, asthBottom, w, h - asthBottom);

    // Rayonnement / panache thermique chaud au centre (Dorsale)
    if (this.showThermal) {
      const centerX = w * 0.45;
      const plumeGrad = this.ctx.createRadialGradient(centerX, asthBottom, 10, centerX, asthTop, w * 0.3);
      plumeGrad.addColorStop(0, "rgba(254, 240, 138, 0.45)");
      plumeGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.25)");
      plumeGrad.addColorStop(1, "rgba(185, 28, 28, 0)");
      this.ctx.fillStyle = plumeGrad;
      this.ctx.fillRect(0, asthTop, w, asthBottom - asthTop);

      // Flèches de convection / cellules
      this.drawConvectionCells(centerX, asthTop, asthBottom, w);
    }

    // 3. LITHOSPHÈRE EN SURFACE
    // Océan
    const oceanX1 = w * 0.22;
    const oceanX2 = w * 0.75;
    const oceanDepth = h * 0.05;
    this.ctx.fillStyle = "rgba(14, 116, 144, 0.75)";
    this.ctx.fillRect(oceanX1, asthTop, oceanX2 - oceanX1, oceanDepth);

    // Vaguelettes animées sur l'eau
    this.ctx.strokeStyle = "rgba(103, 232, 249, 0.5)";
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    for (let x = oceanX1; x < oceanX2; x += 15) {
      const y = asthTop + Math.sin(x * 0.05 + this.time * 2) * 2;
      if (x === oceanX1) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // A. Lithosphère continentale Gauche (~150 km)
    const contH150 = h * 0.15; // proportionnel à 150 km
    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#5c3d25";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, asthTop - 12);
    this.ctx.lineTo(oceanX1, asthTop - 4);
    this.ctx.lineTo(oceanX1, asthTop + contH150);
    this.ctx.lineTo(0, asthTop + contH150);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // B. Lithosphère océanique (~100 km) avec dorsale centrale et plongement à droite
    const oceH100 = h * 0.10; // proportionnel à 100 km
    const dorsaleX = w * 0.45;
    const fosseX = w * 0.75;

    // Plaque océanique gauche (de oceanX1 à dorsaleX)
    this.ctx.fillStyle = "#1e4d6b";
    this.ctx.beginPath();
    this.ctx.moveTo(oceanX1, asthTop + oceanDepth);
    this.ctx.lineTo(dorsaleX, asthTop + oceanDepth);
    this.ctx.lineTo(dorsaleX, asthTop + oceH100 * 0.4); // mince à la dorsale
    this.ctx.lineTo(oceanX1, asthTop + oceH100);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Plaque océanique droite (de dorsaleX à fosseX puis plongeant)
    this.ctx.beginPath();
    this.ctx.moveTo(dorsaleX, asthTop + oceanDepth);
    this.ctx.lineTo(fosseX, asthTop + oceanDepth + 10);
    // Plongement vers le bas dans l'asthénosphère (Subduction)
    const slabTipX = fosseX + w * 0.08;
    const slabTipY = asthTop + contH150 * 2.2;
    this.ctx.lineTo(slabTipX, slabTipY);
    this.ctx.lineTo(slabTipX - oceH100 * 0.9, slabTipY);
    this.ctx.lineTo(fosseX - oceH100, asthTop + oceH100 + oceanDepth);
    this.ctx.lineTo(dorsaleX, asthTop + oceH100 * 0.4);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Remontée magmatique à la dorsale (Divergence)
    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.moveTo(dorsaleX - 8, asthTop + oceH100 * 0.5);
    this.ctx.lineTo(dorsaleX + 8, asthTop + oceH100 * 0.5);
    this.ctx.lineTo(dorsaleX, asthTop + oceanDepth);
    this.ctx.closePath();
    this.ctx.fill();

    // Petits bouillonnements / pillow lavas
    const bubbleY = asthTop + oceanDepth - 4 + Math.sin(this.time * 5) * 3;
    this.ctx.fillStyle = "#f97316";
    this.ctx.beginPath();
    this.ctx.arc(dorsaleX, bubbleY, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // C. Lithosphère continentale Droite (~150 km) chevauchante
    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.beginPath();
    this.ctx.moveTo(fosseX, asthTop + oceanDepth + 10);
    this.ctx.lineTo(fosseX + 15, asthTop - 8);
    // Volcan en surface
    const volcanoX = fosseX + w * 0.09;
    this.ctx.lineTo(volcanoX - 25, asthTop - 8);
    this.ctx.lineTo(volcanoX, asthTop - 32); // Sommet volcan
    this.ctx.lineTo(volcanoX + 25, asthTop - 8);
    this.ctx.lineTo(w, asthTop - 8);
    this.ctx.lineTo(w, asthTop + contH150);
    this.ctx.lineTo(fosseX + 20, asthTop + contH150);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Fumerolles / panache explosif sur le volcan
    this.ctx.fillStyle = "rgba(148, 163, 184, 0.65)";
    for (let k = 0; k < 5; k++) {
      const py = asthTop - 36 - k * 10 - ((this.time * 20 + k * 15) % 40);
      const px = volcanoX + Math.sin(this.time * 2 + k) * 8;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 6 + k * 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. LÉGENDES & ÉTIQUETTES PÉDAGOGIQUES
    if (this.showLabels) {
      this.drawBadge(oceanX1 * 0.5, asthTop + 24, "LITHOSPHÈRE CONTINENTALE", "Épaisseur : ~150 km (Rigide / Casse)", "#8b5e3c");
      this.drawBadge(dorsaleX - 20, asthTop - 18, "DORSALE OCÉANIQUE", "Divergence & Volcanisme effusif", "#ef4444");
      this.drawBadge((dorsaleX + fosseX) * 0.5, asthTop + oceanDepth + 32, "LITHOSPHÈRE OCÉANIQUE", "Épaisseur : ~100 km (Refroidie & Dense)", "#1e4d6b");
      this.drawBadge(fosseX + 45, asthTop - 50, "VOLCANISME EXPLOSIF", "Magma visqueux en subduction", "#f97316");
      this.drawBadge(w * 0.5, asthTop + (asthBottom - asthTop) * 0.45, "ASTHÉNOSPHÈRE DUCTILE", "Moins rigide (flue sans casser)", "#bd4917");
      this.drawBadge(w * 0.5, asthBottom + 25, "MANTEAU PROFOND & NOYAU", "Source de chaleur : matière chaude moins dense monte", "#eab308", true);
    }

    // Flèches de mouvement des plaques
    this.drawMotionArrow(dorsaleX - 40, asthTop + 14, -1, "Écartement");
    this.drawMotionArrow(dorsaleX + 40, asthTop + 14, 1, "Écartement");
    this.drawMotionArrow(fosseX - 35, asthTop + 14, 1, "Plongement");
  }

  drawConvectionCells(centerX, topY, bottomY, totalW) {
    const centerY = (topY + bottomY) * 0.5;
    const loopRadiusX = totalW * 0.18;
    const loopRadiusY = (bottomY - topY) * 0.35;

    // Particules animées en boucle
    this.particles.forEach((p) => {
      p.angle += p.speed * this.speed;
      const isLeft = p.loop === "left";
      const loopCenterX = isLeft ? centerX - loopRadiusX * 1.1 : centerX + loopRadiusX * 1.1;

      // Position le long de l'ellipse de convection
      const px = loopCenterX + Math.cos(p.angle) * loopRadiusX;
      // Sens horaire à gauche (monte au centre, va à gauche, descend à gauche), antihoraire à droite
      const py = centerY + Math.sin(isLeft ? -p.angle : p.angle) * loopRadiusY;

      // Couleur selon profondeur/température : jaune/rouge au fond, orangé en haut
      const tempFactor = (py - topY) / (bottomY - topY);
      const r = Math.floor(250);
      const g = Math.floor(80 + tempFactor * 140);
      const b = 20;

      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.75)`;
      this.ctx.beginPath();
      this.ctx.arc(px, py, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Flèches circulaires schématiques
    this.ctx.strokeStyle = "rgba(254, 240, 138, 0.4)";
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([6, 6]);

    // Boucle gauche
    this.ctx.beginPath();
    this.ctx.ellipse(centerX - loopRadiusX * 1.1, centerY, loopRadiusX * 0.85, loopRadiusY * 0.85, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    // Boucle droite
    this.ctx.beginPath();
    this.ctx.ellipse(centerX + loopRadiusX * 1.1, centerY, loopRadiusX * 0.85, loopRadiusY * 0.85, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.setLineDash([]);
  }

  // =========================================================================
  // VUE 2 : ZOOM 1 - DIVERGENCE & DORSALE OCÉANIQUE
  // =========================================================================
  renderDivergenceView() {
    const w = this.width;
    const h = this.height;

    // Ciel
    this.ctx.fillStyle = "#0c1527";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const lithoBottom = surfaceY + h * 0.28; // Lithosphère 150 km
    const asthBottom = h;

    // 1. Asthénosphère sous-jacente
    const asthGrad = this.ctx.createLinearGradient(0, lithoBottom, 0, asthBottom);
    asthGrad.addColorStop(0, "#c2410c");
    asthGrad.addColorStop(1, "#ea580c");
    this.ctx.fillStyle = asthGrad;
    this.ctx.fillRect(0, lithoBottom, w, asthBottom - lithoBottom);

    // Panache ascendant de chaleur au centre
    const centerX = w * 0.5;
    const plumeGrad = this.ctx.createRadialGradient(centerX, asthBottom, 20, centerX, lithoBottom, w * 0.25);
    plumeGrad.addColorStop(0, "rgba(254, 240, 138, 0.6)");
    plumeGrad.addColorStop(0.6, "rgba(239, 68, 68, 0.3)");
    plumeGrad.addColorStop(1, "rgba(194, 65, 12, 0)");
    this.ctx.fillStyle = plumeGrad;
    this.ctx.fillRect(0, lithoBottom, w, asthBottom - lithoBottom);

    // Flèches d'ascension
    this.drawAscendingArrows(centerX, lithoBottom, asthBottom);

    // Animation selon l'étape (1: Rifting continental, 2: Séparation blocs, 3: Dorsale mature)
    const animOffset = (this.currentStep === 1) ? 20 : (this.currentStep === 2 ? 80 : 160);
    const splitProgress = Math.sin(this.time * 0.8) * 6; // légère pulsation
    const effectiveSplit = animOffset + splitProgress;

    const blockLeftX = centerX - effectiveSplit;
    const blockRightX = centerX + effectiveSplit;

    // 2. Eau de mer si étape 2 ou 3
    if (this.currentStep >= 2) {
      const seaGrad = this.ctx.createLinearGradient(0, surfaceY, 0, surfaceY + h * 0.12);
      seaGrad.addColorStop(0, "rgba(3, 105, 161, 0.85)");
      seaGrad.addColorStop(1, "rgba(12, 74, 110, 0.95)");
      this.ctx.fillStyle = seaGrad;
      this.ctx.fillRect(blockLeftX + 30, surfaceY, blockRightX - blockLeftX - 60, h * 0.14);

      // Surface de l'eau
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

    // 3. Bloc continental GAUCHE (150 km d'épaisseur)
    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, surfaceY - 10);
    this.ctx.lineTo(blockLeftX, surfaceY - 10);
    // Pente de faille normale inclinée vers le centre
    this.ctx.lineTo(blockLeftX + 40, lithoBottom);
    this.ctx.lineTo(0, lithoBottom);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 4. Bloc continental DROIT (150 km d'épaisseur)
    this.ctx.beginPath();
    this.ctx.moveTo(blockRightX, surfaceY - 10);
    this.ctx.lineTo(w, surfaceY - 10);
    this.ctx.lineTo(w, lithoBottom);
    this.ctx.lineTo(blockRightX - 40, lithoBottom);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Failles normales (lignes de fracture cassantes)
    this.drawFaultLine(blockLeftX - 30, surfaceY - 10, blockLeftX + 10, lithoBottom);
    this.drawFaultLine(blockRightX + 30, surfaceY - 10, blockRightX - 10, lithoBottom);

    // 5. Dorsale océanique et plancher néoformé (étape 3)
    if (this.currentStep === 3) {
      // Nouvelle lithosphère océanique (100 km, plus mince)
      const oceBottom = surfaceY + h * 0.18;
      this.ctx.fillStyle = "#1e4d6b";
      this.ctx.beginPath();
      this.ctx.moveTo(blockLeftX + 35, surfaceY + h * 0.12);
      this.ctx.lineTo(centerX - 10, surfaceY + h * 0.08); // sommet dorsale
      this.ctx.lineTo(centerX + 10, surfaceY + h * 0.08);
      this.ctx.lineTo(blockRightX - 35, surfaceY + h * 0.12);
      this.ctx.lineTo(blockRightX - 40, oceBottom);
      this.ctx.lineTo(centerX, oceBottom + 10);
      this.ctx.lineTo(blockLeftX + 40, oceBottom);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Chambre magmatique et cheminée effusive
      this.ctx.fillStyle = "#ef4444";
      this.ctx.beginPath();
      this.ctx.ellipse(centerX, oceBottom - 5, 22, 12, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Coulée de lave fluide sous-marine
      this.ctx.fillStyle = "#f97316";
      this.ctx.beginPath();
      this.ctx.moveTo(centerX - 6, surfaceY + h * 0.08);
      this.ctx.lineTo(centerX + 6, surfaceY + h * 0.08);
      this.ctx.lineTo(centerX + 18, surfaceY + h * 0.10);
      this.ctx.lineTo(centerX - 18, surfaceY + h * 0.10);
      this.ctx.closePath();
      this.ctx.fill();

      // Coussins de basalte (Pillow lavas)
      this.drawPillowLavas(centerX, surfaceY + h * 0.08);
    }

    // Flèches d'étirement / divergence
    this.drawMotionArrow(blockLeftX - 60, surfaceY + 40, -1, "Bloc continental s'étire");
    this.drawMotionArrow(blockRightX + 60, surfaceY + 40, 1, "Bloc continental s'étire");

    // Échelles et légendes
    if (this.showLabels) {
      this.drawBadge(blockLeftX * 0.5, surfaceY + 20, "BLOC CONTINENTAL 1", "Lithosphère continentale ~150 km", "#8b5e3c");
      this.drawBadge(blockRightX + (w - blockRightX) * 0.5, surfaceY + 20, "BLOC CONTINENTAL 2", "Lithosphère continentale ~150 km", "#8b5e3c");
      if (this.currentStep === 1) {
        this.drawBadge(centerX, surfaceY - 20, "RIFT CONTINENTAL", "Fracturation de la roche rigide par étirement", "#ef4444");
      } else if (this.currentStep === 2) {
        this.drawBadge(centerX, surfaceY + 20, "OCÉANISATION", "Inondation marine du fossé d'effondrement", "#0284c7");
      } else {
        this.drawBadge(centerX, surfaceY - 25, "DORSALE OCÉANIQUE", "Volcanisme effusif sous-marin (magma liquide fluide)", "#ef4444");
        this.drawBadge(centerX, surfaceY + h * 0.14, "LITHOSPHÈRE OCÉANIQUE", "Épaisseur : ~100 km (basaltes)", "#1e4d6b");
      }
      this.drawBadge(centerX, asthBottom - 25, "ASTHÉNOSPHÈRE MOINS RIGIDE", "Remontée de chaleur : matière chaude moins dense", "#ea580c", true);
    }
  }

  drawAscendingArrows(centerX, topY, bottomY) {
    this.ctx.fillStyle = "rgba(254, 240, 138, 0.7)";
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

  drawFaultLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = "rgba(248, 113, 113, 0.8)";
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

  // =========================================================================
  // VUE 3 : ZOOM 2 - SUBDUCTION & VOLCANISME EXPLOSIF
  // =========================================================================
  renderSubductionView() {
    const w = this.width;
    const h = this.height;

    // Ciel
    this.ctx.fillStyle = "#0a101f";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const fosseX = w * 0.38;

    // 1. ASTHÉNOSPHÈRE ductile chaude
    const asthGrad = this.ctx.createLinearGradient(0, surfaceY, 0, h);
    asthGrad.addColorStop(0, "#9a3412");
    asthGrad.addColorStop(1, "#c2410c");
    this.ctx.fillStyle = asthGrad;
    this.ctx.fillRect(0, surfaceY, w, h - surfaceY);

    // 2. EAU DE MER (Fosse océanique à gauche)
    this.ctx.fillStyle = "rgba(3, 105, 161, 0.85)";
    this.ctx.beginPath();
    this.ctx.moveTo(0, surfaceY);
    this.ctx.lineTo(fosseX, surfaceY + 25); // creux de fosse
    this.ctx.lineTo(fosseX + 20, surfaceY);
    this.ctx.lineTo(0, surfaceY);
    this.ctx.closePath();
    this.ctx.fill();

    // 3. PLAQUE OCÉANIQUE PLONGEANTE (100 km, dense, froide)
    const oceThick = h * 0.12;
    const dipAngle = 0.55; // angle de subduction
    const slabEndX = fosseX + Math.cos(dipAngle) * (h * 0.85);
    const slabEndY = surfaceY + Math.sin(dipAngle) * (h * 0.85);

    // Corps de la plaque plongeante
    this.ctx.fillStyle = "#1e3a5f";
    this.ctx.strokeStyle = "#0f233d";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, surfaceY + 8);
    this.ctx.lineTo(fosseX, surfaceY + 25);
    this.ctx.lineTo(slabEndX, slabEndY);
    this.ctx.lineTo(slabEndX - oceThick * 0.8, slabEndY + oceThick * 0.3);
    this.ctx.lineTo(fosseX - oceThick * 0.7, surfaceY + oceThick + 25);
    this.ctx.lineTo(0, surfaceY + oceThick);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 4. DÉSHYDRATATION DE LA PLAQUE (Étape 2 & 3)
    if (this.currentStep >= 2) {
      // Petites gouttelettes d'eau libérées montant vers l'asthénosphère
      this.ctx.fillStyle = "#67e8f9";
      for (let i = 0; i < 18; i++) {
        const tOffset = (this.time * 2 + i * 0.4) % 3;
        const startX = fosseX + 70 + i * 12;
        const startY = surfaceY + 90 + i * 14;
        const curY = startY - tOffset * 22;
        const curX = startX + Math.sin(this.time * 4 + i) * 4;

        if (curY > surfaceY + 45) {
          this.ctx.beginPath();
          this.ctx.arc(curX, curY, 3, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      // Zone de fusion partielle (magma visqueux enrichi en eau et silice)
      const meltX = fosseX + 160;
      const meltY = surfaceY + 70;
      const meltGrad = this.ctx.createRadialGradient(meltX, meltY, 5, meltX, meltY, 40);
      meltGrad.addColorStop(0, "rgba(250, 204, 21, 0.9)");
      meltGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.6)");
      meltGrad.addColorStop(1, "rgba(185, 28, 28, 0)");
      this.ctx.fillStyle = meltGrad;
      this.ctx.beginPath();
      this.ctx.arc(meltX, meltY, 45, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 5. PLAQUE CONTINENTALE CHEVAUCHANTE (150 km)
    const contThick = h * 0.22;
    const volcanoX = fosseX + 160;

    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(fosseX + 20, surfaceY);
    this.ctx.lineTo(volcanoX - 60, surfaceY);
    // Cône du volcan
    this.ctx.lineTo(volcanoX - 25, surfaceY - 55);
    this.ctx.lineTo(volcanoX + 25, surfaceY - 55);
    this.ctx.lineTo(volcanoX + 60, surfaceY);
    this.ctx.lineTo(w, surfaceY);
    this.ctx.lineTo(w, surfaceY + contThick);
    this.ctx.lineTo(fosseX + 120, surfaceY + contThick);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 6. REMONTÉE DU MAGMA VISQUEUX & ÉRUPTION EXPLOSIVE (Étape 3)
    if (this.currentStep === 3) {
      // Cheminée magmatique
      this.ctx.fillStyle = "#ef4444";
      this.ctx.beginPath();
      this.ctx.moveTo(volcanoX - 10, surfaceY + 70);
      this.ctx.lineTo(volcanoX + 10, surfaceY + 70);
      this.ctx.lineTo(volcanoX + 8, surfaceY - 45);
      this.ctx.lineTo(volcanoX - 8, surfaceY - 45);
      this.ctx.closePath();
      this.ctx.fill();

      // Dôme de lave visqueuse dans le cratère
      this.ctx.fillStyle = "#991b1b";
      this.ctx.beginPath();
      this.ctx.arc(volcanoX, surfaceY - 52, 14, Math.PI, 0);
      this.ctx.fill();

      // Panache explosif géant (cendres, gaz, nuée ardente)
      const plumeBaseY = surfaceY - 55;
      this.ctx.fillStyle = "rgba(71, 85, 105, 0.75)";
      for (let p = 0; p < 12; p++) {
        const py = plumeBaseY - p * 12 - ((this.time * 30 + p * 15) % 60);
        const spread = (p * 5) + Math.sin(this.time * 3 + p) * 8;
        this.ctx.beginPath();
        this.ctx.arc(volcanoX + spread * 0.4, py, 12 + p * 3, 0, Math.PI * 2);
        this.ctx.arc(volcanoX - spread * 0.4, py, 12 + p * 3, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Projections incandescentes (bombes volcaniques)
      this.ctx.fillStyle = "#fbbf24";
      for (let b = 0; b < 6; b++) {
        const bx = volcanoX + Math.sin(this.time * 6 + b) * (20 + b * 10);
        const by = plumeBaseY - 20 - ((this.time * 50 + b * 20) % 50);
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Flèche de plongement
    this.drawMotionArrow(fosseX - 40, surfaceY + 40, 1, "Plongement subduction");

    // Légendes
    if (this.showLabels) {
      this.drawBadge(fosseX - 100, surfaceY - 15, "FOSSE OCÉANIQUE", "Zone de convergence", "#0284c7");
      this.drawBadge(w * 0.15, surfaceY + oceThick * 0.5, "LITHOSPHÈRE OCÉANIQUE", "~100 km (refroidie, très dense)", "#1e3a5f");
      this.drawBadge(volcanoX + 110, surfaceY - 25, "VOLCANISME EXPLOSIF", "Magma très visqueux (riche en silice & gaz)", "#ef4444");
      this.drawBadge(w * 0.78, surfaceY + contThick * 0.4, "LITHOSPHÈRE CONTINENTALE", "Chevauchante (~150 km)", "#8b5e3c");
      if (this.currentStep >= 2) {
        this.drawBadge(fosseX + 140, surfaceY + 115, "DÉSHYDRATATION & FUSION", "L'eau libérée fait fondre le manteau", "#67e8f9");
      }
    }
  }

  // =========================================================================
  // VUE 4 : ZOOM 3 - SÉISME, FOYER, ÉPICENTRE & SISMOGRAMMES
  // =========================================================================
  renderSeismeView() {
    const w = this.width;
    const h = this.height;

    // Secousse visuelle de la caméra si séisme actif
    if (this.seismeState.shakingIntensity > 0.05) {
      const shakeX = (Math.random() - 0.5) * 8 * this.seismeState.shakingIntensity;
      const shakeY = (Math.random() - 0.5) * 6 * this.seismeState.shakingIntensity;
      this.ctx.translate(shakeX, shakeY);
      this.seismeState.shakingIntensity *= 0.96; // amortissement
    }

    // Ciel
    this.ctx.fillStyle = "#0c1527";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const lithoBottom = surfaceY + h * 0.35; // Lithosphère rigide 150 km

    // 1. Asthénosphère ductile en bas (ne casse pas)
    this.ctx.fillStyle = "#c2410c";
    this.ctx.fillRect(0, lithoBottom, w, h - lithoBottom);

    // 2. Lithosphère continentale rigide (seule capable de casser)
    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(0, surfaceY, w, lithoBottom - surfaceY);

    // Positions clés
    const foyerX = w * 0.32;
    const foyerY = surfaceY + (lithoBottom - surfaceY) * 0.55;
    const epicentreX = foyerX;
    const epicentreY = surfaceY;

    this.seismeState.foyer = { x: foyerX, y: foyerY };
    this.seismeState.epicentre = { x: epicentreX, y: epicentreY };

    // Faille compressive inclinée passant par le foyer
    this.ctx.strokeStyle = "#f87171";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(foyerX - 60, surfaceY);
    this.ctx.lineTo(foyerX + 70, lithoBottom);
    this.ctx.stroke();

    // Flèches de contraintes de compression (convergence)
    if (!this.seismeState.triggered) {
      const pulse = Math.sin(this.time * 6) * 4;
      this.drawCompressiveArrow(foyerX - 110 + pulse, foyerY - 20, 1);
      this.drawCompressiveArrow(foyerX + 110 - pulse, foyerY + 20, -1);
    }

    // 3. PROPAGATION DES ONDES SISMIQUES CONCENTRIQUES
    if (this.seismeState.triggered) {
      this.seismeState.waveRadius += 3.2 * this.speed;

      // Trains d'ondes concentriques
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

      // Flash au foyer
      this.ctx.fillStyle = "#ef4444";
      this.ctx.beginPath();
      this.ctx.arc(foyerX, foyerY, 8 + Math.sin(this.time * 15) * 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. VILLES ET BÂTIMENTS EN SURFACE
    // Ville A (proche de l'épicentre : distance 25 km)
    const villeAX = foyerX + 80;
    this.seismeState.stationA.x = villeAX;
    this.seismeState.stationA.y = surfaceY;

    // Ville B (éloignée de l'épicentre : distance 95 km)
    const villeBX = foyerX + 320;
    this.seismeState.stationB.x = villeBX;
    this.seismeState.stationB.y = surfaceY;

    // Dessin de l'Épicentre (directement à la verticale du foyer)
    this.drawEpicentreZone(epicentreX, epicentreY);

    // Dessin des bâtiments à Ville A (ordinaire fissuré/détruit)
    const distToA = Math.hypot(villeAX - foyerX, surfaceY - foyerY);
    const reachedA = this.seismeState.waveRadius >= distToA;
    if (reachedA && !this.seismeState.stationA.reached) {
      this.seismeState.stationA.reached = true;
      document.getElementById("statusA").textContent = "Ondes reçues ! Forte secousse";
      document.getElementById("statusA").style.color = "#ef4444";
    }
    this.drawBuilding(villeAX, surfaceY, "standard", reachedA);

    // Dessin des bâtiments à Ville B (parasismique intact)
    const distToB = Math.hypot(villeBX - foyerX, surfaceY - foyerY);
    const reachedB = this.seismeState.waveRadius >= distToB;
    if (reachedB && !this.seismeState.stationB.reached) {
      this.seismeState.stationB.reached = true;
      document.getElementById("statusB").textContent = "Ondes reçues avec RETARD ! Faible secousse";
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

    // Ligne verticale Foyer -> Épicentre
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(foyerX, foyerY);
    this.ctx.lineTo(epicentreX, epicentreY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

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
      // Bâtiment classique fissuré / écroulé
      this.ctx.fillStyle = isDamaged ? "#64748b" : "#94a3b8";
      this.ctx.strokeStyle = "#334155";
      this.ctx.lineWidth = 1.5;

      if (!isDamaged) {
        // Debout
        this.ctx.fillRect(x - 16, groundY - 32, 32, 32);
        this.ctx.strokeRect(x - 16, groundY - 32, 32, 32);
        // Fenêtres
        this.ctx.fillStyle = "#fef08a";
        this.ctx.fillRect(x - 12, groundY - 26, 8, 8);
        this.ctx.fillRect(x + 4, groundY - 26, 8, 8);
      } else {
        // Écroulé / fissuré
        this.ctx.beginPath();
        this.ctx.moveTo(x - 16, groundY);
        this.ctx.lineTo(x - 14, groundY - 18);
        this.ctx.lineTo(x + 2, groundY - 24);
        this.ctx.lineTo(x + 16, groundY - 10);
        this.ctx.lineTo(x + 16, groundY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Fissures rouges
        this.ctx.strokeStyle = "#ef4444";
        this.ctx.beginPath();
        this.ctx.moveTo(x - 5, groundY - 18);
        this.ctx.lineTo(x + 3, groundY - 8);
        this.ctx.stroke();
      }
    } else {
      // Maison aux normes parasismiques (amortisseurs souples + chaînage)
      this.ctx.fillStyle = "#38bdf8";
      this.ctx.strokeStyle = "#0284c7";
      this.ctx.lineWidth = 2;

      // Amortisseurs à la base
      this.ctx.fillStyle = "#64748b";
      this.ctx.fillRect(x - 16, groundY - 4, 8, 4);
      this.ctx.fillRect(x + 8, groundY - 4, 8, 4);

      // Structure principale
      this.ctx.fillStyle = "#0284c7";
      this.ctx.fillRect(x - 18, groundY - 30, 36, 26);
      this.ctx.strokeRect(x - 18, groundY - 30, 36, 26);

      // Toit triangulaire
      this.ctx.fillStyle = "#22c55e";
      this.ctx.beginPath();
      this.ctx.moveTo(x - 22, groundY - 30);
      this.ctx.lineTo(x, groundY - 44);
      this.ctx.lineTo(x + 22, groundY - 30);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Croix de contreventement parasismique
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

  // =========================================================================
  // GESTION DES SISMOGRAMMES EN TEMPS RÉEL (CANVAS A & B)
  // =========================================================================
  updateAndDrawSismograms() {
    let ampA = 0;
    let ampB = 0;

    if (this.seismeState.triggered) {
      if (this.seismeState.stationA.reached) {
        // Forte secousse, onde P puis onde S ample
        const elapsedA = this.time - this.seismeState.ruptureTime;
        ampA = Math.sin(this.time * 24) * 24 * Math.exp(-elapsedA * 0.4);
      }
      if (this.seismeState.stationB.reached) {
        // Secousse plus faible et retardée
        const elapsedB = this.time - (this.seismeState.ruptureTime + 1.2);
        ampB = Math.sin(this.time * 18) * 10 * Math.exp(-elapsedB * 0.35);
      }
    }

    // Décalage du tracé (rouleau papier)
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

    // Grille millimétrée de sismographe
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

    // Ligne centrale de référence
    const midY = h * 0.5;
    ctx.strokeStyle = "#25334d";
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // Tracé sismique
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

    // Stylet enregistreur à l'extrémité droite
    const currentY = midY - history[history.length - 1];
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(w - 4, currentY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // OUTILS DE DESSIN COMMUNS (BADGES, FLÈCHES, TEXTES)
  // =========================================================================
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

    // Fond cartouche
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(startX, startY, boxWidth, boxHeight, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Texte Titre
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "bold 10px sans-serif";
    this.ctx.fillText(title, startX + 8, startY + 11);

    // Texte Sous-titre
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

    // Pointe
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
