/**
 * Tectonique des Plaques - SVT 4ème
 * Animation pédagogique interactive avec respect rigoureux des échelles géologiques
 * Pleine largeur & Évolution temporelle continue
 */

// Polyfill Canvas roundRect
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

// Données pédagogiques pour le bandeau supérieur
const VIEWS_DATA = {
  global: {
    title: "Coupe Hémisphérique de la Terre (0 à 6371 km) : Le Moteur Convectif",
    text: "Depuis la surface du noyau très chaud (2900 km de profondeur), la matière chaude moins dense monte dans l'asthénosphère ductile. Bloqué par la lithosphère rigide en surface, ce courant dévie latéralement, refroidit et replonge sur les côtés.",
    indicators: [
      "Rayon Terre : 6371 km",
      "Noyau : 2900 à 6371 km (source thermique)",
      "Asthénosphère : ductile (convection)",
      "Lithosphère : 100 à 150 km (bloque le flux)"
    ],
    speedText: "Convection : ~1 à 5 cm/an"
  },
  divergence: {
    title: "Zoom 1 : De la Fracture Continentale à l'Océan Mature (3 Stades)",
    text: "Sous l'effet de la remontée mantellique chaude, la croûte continentale subit un bombement puis s'étire en formant des blocs basculés le long de failles normales (Rifting). Les blocs s'écartent et l'eau pénètre (Jeune océan avec premiers basaltes). À maturité, la dorsale océanique active crée en continu la croûte basaltique recouverte progressivement de sédiments sur les marges.",
    indicators: [
      "Stade 1 : Rifting continental & Failles normales",
      "Stade 2 : Jeune océan (inondation & basaltes)",
      "Stade 3 : Océan mature & Dorsale active",
      "Divergence : écartement symétrique (cm/an)"
    ],
    speedText: "Divergence : ~2 à 5 cm/an"
  },
  subduction: {
    title: "Zoom 2 : Courant Descendant, Subduction & Volcanisme Explosif",
    text: "Là où le courant convectif redescend, la lithosphère océanique refroidie et dense (100 km) plonge sous le continent (150 km). Elle se déshydrate, faisant fondre le manteau : le magma visqueux remonte et explose violemment en surface.",
    indicators: [
      "Plaque plongeante : 100 km (dense)",
      "Plaque chevauchante : 150 km",
      "Déshydratation minérale",
      "Magma visqueux ➔ Volcanisme explosif"
    ],
    speedText: "Convergence : ~4 cm/an"
  },
  seisme: {
    title: "Zoom 3 : Rupture au Foyer, Épicentre & Sismogrammes Différés",
    text: "Les contraintes de compression bloquent la faille dans la lithosphère continentale rigide (150 km). Lorsque la roche casse au FOYER (hypocentre), des ondes sismiques se propagent. L'ÉPICENTRE subit les dégâts maximaux, et les stations enregistrent un retard (Δt).",
    indicators: [
      "Foyer (Hypocentre) : rupture cassante",
      "Épicentre : dégâts maximaux en surface",
      "Bâtiments standards vs Parasismiques",
      "Enregistrements décalés dans le temps (Δt)"
    ],
    speedText: "Propagation ondes : 3 à 8 km/s"
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
    explanation: "Parfait ! Le magma liquide très fluide s'épanche sous la mer (laves en coussins / pillow-lavas). En refroidissant, il crée en continu la nouvelle lithosphère océanique de 100 km d'épaisseur au fur et à mesure de l'écartement."
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
    this.isPlaying = true;
    this.time = 0;
    this.speed = 1.0;

    // Timeline continue pour le Zoom 1 (Divergence : Stades 1, 2, 3)
    this.divergenceProgress = 0.05; // 0 à 1 (Stade 1 -> Stade 2 -> Stade 3)

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

    // État du séisme (Zoom 3)
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

  initConvectionParticles() {
    this.convectionParticles = [];
    for (let i = 0; i < 140; i++) {
      const cell = i % 2 === 0 ? "left" : "right";
      this.convectionParticles.push({
        cell: cell,
        progress: Math.random(),
        speed: 0.0018 + Math.random() * 0.0015,
        offset: (Math.random() - 0.5) * 0.12,
        size: 2.2 + Math.random() * 2.2
      });
    }
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
    const dpr = window.devicePixelRatio || 1;
    const w = (rect && rect.width > 200) ? rect.width : (window.innerWidth || 1024);
    const h = (rect && rect.height > 200) ? rect.height : ((window.innerHeight - 200) || 600);
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    this.width = w;
    this.height = h;
  }

  getHemiGeometry() {
    const w = this.width;
    const h = this.height;
    const cx = w * 0.5;
    const cy = h * 0.76;
    const R = Math.min(w * 0.36, h * 0.48);
    return { cx, cy, R };
  }

  getHemiPillsCoords() {
    const { cx, cy, R } = this.getHemiGeometry();
    const subAngleRight = -Math.PI * 0.28; // Zone exacte de descente froide & subduction
    const subAngleLeft = -Math.PI * 0.72;  // Zone de compression & séismes
    return {
      z1: { x: cx, y: cy - R - 32, label: "ZOOM 1" },
      z2: { x: cx + Math.cos(subAngleRight) * (R + 42), y: cy + Math.sin(subAngleRight) * (R + 42), label: "ZOOM 2" },
      z3: { x: cx + Math.cos(subAngleLeft) * (R + 42), y: cy + Math.sin(subAngleLeft) * (R + 42), label: "ZOOM 3" }
    };
  }

  initEventListeners() {
    // Navigation par onglets
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Slider d'évolution des 3 stades de la divergence (Zoom 1)
    const slider = document.getElementById("divergenceSlider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.divergenceProgress = parseFloat(e.target.value) / 100;
        this.updateTimelineUI();
      });
    }

    // Clics sur les 3 stades de l'ouverture océanique
    document.querySelectorAll(".phase-mark").forEach((mark) => {
      mark.addEventListener("click", () => {
        const stage = parseInt(mark.dataset.stage);
        if (stage === 1) this.divergenceProgress = 0.05;
        else if (stage === 2) this.divergenceProgress = 0.50;
        else if (stage === 3) this.divergenceProgress = 0.95;

        if (slider) slider.value = this.divergenceProgress * 100;
        this.updateTimelineUI();
        sounds.playClick();
      });
    });

    // Clics interactifs sur le canvas (dans la vue globale)
    this.canvas.addEventListener("click", (e) => {
      if (this.currentView === "global") {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const pills = this.getHemiPillsCoords();

        // Clic sur Zoom 1 (Sommet)
        if (Math.hypot(mx - pills.z1.x, my - pills.z1.y) < 85) {
          this.switchView("divergence");
          return;
        }

        // Clic sur Zoom 2 (Flanc Droit)
        if (Math.hypot(mx - pills.z2.x, my - pills.z2.y) < 85) {
          this.switchView("subduction");
          return;
        }

        // Clic sur Zoom 3 (Flanc Gauche)
        if (Math.hypot(mx - pills.z3.x, my - pills.z3.y) < 85) {
          this.switchView("seisme");
          return;
        }
      }
    });

    // Survol souris pour changer le curseur en 'pointer' sur les pastilles
    this.canvas.addEventListener("mousemove", (e) => {
      if (this.currentView === "global") {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const pills = this.getHemiPillsCoords();

        const onZ1 = Math.hypot(mx - pills.z1.x, my - pills.z1.y) < 85;
        const onZ2 = Math.hypot(mx - pills.z2.x, my - pills.z2.y) < 85;
        const onZ3 = Math.hypot(mx - pills.z3.x, my - pills.z3.y) < 85;

        this.canvas.style.cursor = (onZ1 || onZ2 || onZ3) ? "pointer" : "default";
      } else {
        this.canvas.style.cursor = "default";
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
      this.divergenceTime = 0;
      const slider = document.getElementById("divergenceSlider");
      if (slider) slider.value = 0;
      this.resetSeisme();
      this.updateTimelineUI();
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

    // Déclencheur Séisme
    document.getElementById("btnTriggerSeisme").addEventListener("click", () => {
      this.triggerSeisme();
    });

    // Son
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
  }

  switchView(viewName) {
    this.currentView = viewName;

    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.view === viewName);
    });

    // Afficher ou masquer le bouton de séisme
    const seismeOverlay = document.getElementById("seismeTriggerOverlay");
    seismeOverlay.style.display = viewName === "seisme" ? "flex" : "none";

    // Afficher ou masquer l'overlay des sismogrammes
    const seismoPanel = document.getElementById("seismoPanel");
    seismoPanel.style.display = viewName === "seisme" ? "flex" : "none";

    // Afficher la timeline continue surtout pour le Zoom 1
    const timelineBox = document.getElementById("dashTimelineBox");
    if (timelineBox) {
      timelineBox.style.display = (viewName === "divergence") ? "flex" : "none";
    }

    if (viewName === "divergence") {
      this.divergenceProgress = 0.05;
      const slider = document.getElementById("divergenceSlider");
      if (slider) slider.value = 5;
    }

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
    document.getElementById("infoBadge").textContent = data.title.split(":")[0];
    document.getElementById("dashSpeedIndicator").innerHTML = `<b>${data.speedText}</b>`;

    // Pastilles d'enveloppes dans le bandeau horizontal
    const container = document.getElementById("infoIndicators");
    container.innerHTML = "";
    data.indicators.forEach((ind) => {
      const span = document.createElement("span");
      span.className = "indicator-pill";
      span.textContent = ind;
      container.appendChild(span);
    });

    this.updateTimelineUI();
  }

  updateTimelineUI() {
    const valSpan = document.getElementById("timelineValue");
    if (valSpan) {
      let stageName = "Stade 1 : Rifting continental";
      if (this.divergenceProgress >= 0.33 && this.divergenceProgress < 0.66) {
        stageName = "Stade 2 : Stade jeune océan";
      } else if (this.divergenceProgress >= 0.66) {
        stageName = "Stade 3 : Stade océan mature";
      }
      valSpan.textContent = stageName;
    }

    document.querySelectorAll(".phase-mark").forEach((mark) => {
      const stage = parseInt(mark.dataset.stage);
      let isActive = false;
      if (stage === 1 && this.divergenceProgress < 0.33) isActive = true;
      if (stage === 2 && this.divergenceProgress >= 0.33 && this.divergenceProgress < 0.66) isActive = true;
      if (stage === 3 && this.divergenceProgress >= 0.66) isActive = true;
      mark.classList.toggle("active", isActive);
    });
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
      sA.textContent = "En attente...";
      sB.textContent = "En attente...";
      sA.style.color = "#64748b";
      sB.style.color = "#64748b";
    }
  }

  // === BOUCLE PRINCIPALE D'ANIMATION ===
  animate() {
    if (this.isPlaying) {
      this.time += 0.016 * this.speed;

      // Progression continue du Zoom 1 (3 stades d'ouverture océanique)
      if (this.currentView === "divergence") {
        this.divergenceProgress += 0.0016 * this.speed;
        if (this.divergenceProgress > 1.0) {
          this.divergenceProgress = 0.0;
        }
        const slider = document.getElementById("divergenceSlider");
        if (slider) slider.value = this.divergenceProgress * 100;
        this.updateTimelineUI();
      }
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.currentView) {
      case "global":
        this.renderGlobalHemiView();
        break;
      case "divergence":
        this.renderDivergenceContinuousView();
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
  // =========================================================================
  renderGlobalHemiView() {
    const w = this.width;
    const h = this.height;

    // Fond étoilé
    this.ctx.fillStyle = "#030712";
    this.ctx.fillRect(0, 0, w, h);

    this.stars.forEach((s) => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * (0.6 + Math.sin(this.time * 2 + s.x * 10) * 0.4)})`;
      this.ctx.fillRect(s.x * w, s.y * h * 0.75, s.size, s.size);
    });

    const { cx, cy, R } = this.getHemiGeometry();

    const rGraine = R * 0.191;
    const rNoyau = R * 0.545;
    const rLithoBase = R * 0.945;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.lineTo(cx + R, cy);
    this.ctx.lineTo(cx - R, cy);
    this.ctx.closePath();
    this.ctx.clip();

    // A. Manteau / Asthénosphère
    const mantleGrad = this.ctx.createRadialGradient(cx, cy, rNoyau, cx, cy, R);
    mantleGrad.addColorStop(0, "#d9480f");
    mantleGrad.addColorStop(0.5, "#993d18");
    mantleGrad.addColorStop(1, "#5c1d0a");
    this.ctx.fillStyle = mantleGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.fill();

    // B. Cellules de convection mantellique
    if (this.showThermal) {
      this.drawHemisphereConvection(cx, cy, rNoyau, rLithoBase);
    }

    // C. Noyau externe liquide (source de chaleur)
    const coreOutGrad = this.ctx.createRadialGradient(cx, cy, rGraine, cx, cy, rNoyau);
    coreOutGrad.addColorStop(0, "#fef08a");
    coreOutGrad.addColorStop(0.6, "#f59e0b");
    coreOutGrad.addColorStop(1, "#ea580c");
    this.ctx.fillStyle = coreOutGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, rNoyau, Math.PI, 0, false);
    this.ctx.fill();

    // D. Graine solide
    const seedGrad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, rGraine);
    seedGrad.addColorStop(0, "#ffffff");
    seedGrad.addColorStop(1, "#fef08a");
    this.ctx.fillStyle = seedGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, rGraine, Math.PI, 0, false);
    this.ctx.fill();

    // E. Lithosphère rigide en surface
    this.drawHemiLithosphere(cx, cy, R, rLithoBase);

    this.ctx.restore();

    // Contour
    this.ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.lineTo(cx + R, cy);
    this.ctx.lineTo(cx - R, cy);
    this.ctx.stroke();

    // Échelle métrique
    if (this.showGrid) {
      this.drawHemiDepthScale(cx, cy, R, rNoyau, rGraine, rLithoBase);
    }

    // Pastilles de zoom
    this.drawZoomPillsOnGlobe(cx, cy, R);

    // Légendes
    if (this.showLabels) {
      this.drawHemiLabels(cx, cy, R, rNoyau, rGraine);
    }
  }

  drawHemisphereConvection(cx, cy, rInner, rOuter) {
    const totalW = rOuter - rInner;
    // Angles exacts des courants descendants froids où se produit la subduction
    const subAngleRight = -Math.PI * 0.28;
    const subAngleLeft = -Math.PI * 0.72;
    const spanAngle = Math.abs(subAngleRight - (-Math.PI * 0.5)); // = 0.22 * Math.PI

    this.convectionParticles.forEach((p) => {
      p.progress = (p.progress + p.speed * this.speed) % 1.0;
      let curR, curAngle;
      const isLeft = p.cell === "left";
      const sign = isLeft ? -1 : 1;
      const targetSubAngle = isLeft ? subAngleLeft : subAngleRight;

      if (p.progress < 0.25) {
        // 1. Remontée chaude depuis le noyau au centre (-Math.PI * 0.5)
        const frac = p.progress / 0.25;
        curR = rInner + frac * totalW;
        curAngle = -Math.PI * 0.5 + sign * (0.02 + p.offset * 0.04);
      } else if (p.progress < 0.50) {
        // 2. Étalement sous la lithosphère en se refroidissant progressivement
        const frac = (p.progress - 0.25) / 0.25;
        curR = rOuter - 8 + p.offset * 14;
        curAngle = -Math.PI * 0.5 + sign * (frac * spanAngle);
      } else if (p.progress < 0.75) {
        // 3. DESCENTE : le matériel refroidi devenu dense redescend vers le noyau
        // C'est exactement là que se produit la subduction de la lithosphère !
        const frac = (p.progress - 0.50) / 0.25;
        curR = rOuter - frac * totalW;
        curAngle = targetSubAngle + sign * (p.offset * 0.03);
      } else {
        // 4. Retour le long du noyau pour être réchauffé
        const frac = (p.progress - 0.75) / 0.25;
        curR = rInner + 8 + p.offset * 12;
        curAngle = targetSubAngle - sign * (frac * spanAngle);
      }

      // Couleur thermique : chaud (jaune/orange) à la montée, froid (bleu/cyan dense) à la descente
      let color;
      if (p.progress < 0.30 || p.progress > 0.85) {
        color = "rgba(254, 240, 138, 0.9)"; // Matière chaude ascendante
      } else if (p.progress < 0.48) {
        color = "rgba(249, 115, 22, 0.85)"; // Se refroidit en progressant
      } else {
        color = "rgba(56, 189, 248, 0.9)"; // Matériel refroidi dense qui redescend !
      }

      const px = cx + Math.cos(curAngle) * curR;
      const py = cy + Math.sin(curAngle) * curR;

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(px, py, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Ellipses de guidage de la convection centrées entre montée et descente
    this.ctx.save();
    this.ctx.setLineDash([5, 5]);
    this.ctx.lineWidth = 1.8;
    this.ctx.strokeStyle = "rgba(254, 240, 138, 0.35)";

    const midR = (rInner + rOuter) * 0.5;
    const midAngleRight = (-Math.PI * 0.5 + subAngleRight) * 0.5;
    const midAngleLeft = (-Math.PI * 0.5 + subAngleLeft) * 0.5;

    // Cellule gauche
    this.ctx.beginPath();
    this.ctx.ellipse(cx + Math.cos(midAngleLeft) * midR, cy + Math.sin(midAngleLeft) * midR, totalW * 0.42, totalW * 0.35, -0.35, 0, Math.PI * 2);
    this.ctx.stroke();

    // Cellule droite
    this.ctx.beginPath();
    this.ctx.ellipse(cx + Math.cos(midAngleRight) * midR, cy + Math.sin(midAngleRight) * midR, totalW * 0.42, totalW * 0.35, 0.35, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawHemiLithosphere(cx, cy, R, rBase) {
    const lithoThickness = R - rBase;

    // Lithosphère homogène : MÊME couleur partout sur toute la circonférence de la Terre
    const lithoColor = "#7c2d12"; // Brun chaud lithosphérique rigide
    const lithoBorder = "#431407";

    this.ctx.fillStyle = lithoColor;
    this.ctx.strokeStyle = lithoBorder;
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.arc(cx, cy, rBase, 0, Math.PI, true);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 1. DORSALE OCÉANIQUE (Sommet, -Math.PI * 0.5) : remontée de chaleur / magma rouge
    const dorsaleAngle = -Math.PI * 0.5;
    const dx = cx + Math.cos(dorsaleAngle) * R;
    const dy = cy + Math.sin(dorsaleAngle) * R;

    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.arc(dx, dy + 1, 5.5, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. ZONE DE SUBDUCTION : EXACTEMENT LÀ OÙ LE MATÉRIEL REFROIDI REDESCEND !
    // subAngle = -Math.PI * 0.28 (concordance absolue avec le courant descendant froid)
    const subAngle = -Math.PI * 0.28;
    const sx = cx + Math.cos(subAngle) * R;
    const sy = cy + Math.sin(subAngle) * R;

    // La plaque lithosphérique océanique plonge dans l'asthénosphère
    // en suivant très précisément le courant convectif descendant froid vers les profondeurs
    const slabLength = 75;
    const plungeAngle = subAngle - 0.38; // Inclinée vers l'intérieur le long du courant descendant
    const endX = sx + Math.cos(plungeAngle) * slabLength;
    const endY = sy + Math.sin(plungeAngle) * slabLength;

    this.ctx.save();
    // Plaque plongeante en subduction (même couleur lithosphérique que toute la lithosphère)
    this.ctx.strokeStyle = lithoColor;
    this.ctx.lineWidth = lithoThickness * 0.95;
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    // Liseré sombre pour bien délimiter la plaque plongeante dans l'asthénosphère
    this.ctx.strokeStyle = lithoBorder;
    this.ctx.lineWidth = 1.6;
    this.ctx.beginPath();
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    // Fosse océanique (légère dépression bleue à l'endroit exact de l'enfoncement)
    this.ctx.fillStyle = "#0284c7";
    this.ctx.beginPath();
    this.ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawHemiDepthScale(cx, cy, R, rNoyau, rGraine, rLithoBase) {
    this.ctx.save();
    const axisX = cx - R * 0.72;
    const axisTopY = cy - R;
    const axisBottomY = cy;

    this.ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(axisX, axisTopY);
    this.ctx.lineTo(axisX, axisBottomY);
    this.ctx.stroke();

    const depths = [
      { km: "0 km", label: "Surface terrestre", y: cy - R, color: "#38bdf8" },
      { km: "150 km", label: "Base Lithosphère rigide", y: cy - rLithoBase, color: "#f87171" },
      { km: "670 km", label: "Asthénosphère (Manteau sup.)", y: cy - (R * 0.895), color: "#fb923c" },
      { km: "2 900 km", label: "Surface du Noyau (Chaleur)", y: cy - rNoyau, color: "#facc15" },
      { km: "5 150 km", label: "Noyau interne (Graine)", y: cy - rGraine, color: "#fef08a" },
      { km: "6 371 km", label: "Centre de la Terre", y: cy, color: "#ffffff" }
    ];

    depths.forEach((d) => {
      this.ctx.strokeStyle = d.color;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(axisX - 6, d.y);
      this.ctx.lineTo(axisX + 6, d.y);
      this.ctx.stroke();

      this.ctx.fillStyle = d.color;
      this.ctx.font = "bold 9.5px monospace";
      this.ctx.textAlign = "right";
      this.ctx.fillText(d.km, axisX - 10, d.y + 3);

      this.ctx.fillStyle = "#cbd5e1";
      this.ctx.font = "9px sans-serif";
      this.ctx.textAlign = "left";
      this.ctx.fillText(d.label, axisX + 12, d.y + 3);
    });

    this.ctx.restore();
  }

  drawZoomPillsOnGlobe(cx, cy, R) {
    this.ctx.save();
    const pills = this.getHemiPillsCoords();

    this.drawInteractivePill(pills.z1.x, pills.z1.y, "👉 CLIQUER : ZOOM 1 (RIFT & DORSALE)", "#ef4444", true);
    this.drawInteractivePill(pills.z2.x, pills.z2.y, "👉 CLIQUER : ZOOM 2 (SUBDUCTION)", "#0284c7", false);
    this.drawInteractivePill(pills.z3.x, pills.z3.y, "👉 CLIQUER : ZOOM 3 (SÉISMES)", "#f59e0b", false);

    this.ctx.restore();
  }

  drawInteractivePill(x, y, text, borderColor, isCentered) {
    this.ctx.save();
    this.ctx.font = "bold 11px sans-serif";
    const textW = this.ctx.measureText(text).width;
    const pillW = textW + 22;
    const pillH = 30;
    const startX = isCentered ? x - pillW * 0.5 : x;
    const startY = y - pillH * 0.5;

    const pulse = Math.sin(this.time * 4) * 2;

    this.ctx.fillStyle = "rgba(10, 16, 28, 0.95)";
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 2.2;
    this.ctx.beginPath();
    this.ctx.roundRect(startX - pulse * 0.5, startY - pulse * 0.5, pillW + pulse, pillH + pulse, 15);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, startX + pillW * 0.5, startY + pillH * 0.5);
    this.ctx.restore();
  }

  drawHemiLabels(cx, cy, R, rNoyau, rGraine) {
    this.drawBadge(cx, cy - rNoyau * 0.45, "NOYAU TERRESTRE (Très chaud)", "Source de chaleur : 2900 à 6371 km", "#facc15", true);
    this.drawBadge(cx, cy - (rNoyau + R) * 0.5, "COURANT CHAUD ASCENDANT", "Matière moins dense qui monte dans l'asthénosphère", "#f97316", true);
    this.drawBadge(cx, cy - R + 14, "FLUX BLOQUÉ PAR LA LITHOSPHÈRE RIGIDE", "La roche rigide dévie le flux horizontalement", "#38bdf8", true);

    // Badge placé précisément à l'endroit où le matériel refroidi redescend et où la subduction se fait
    const subAngle = -Math.PI * 0.28;
    const descX = cx + Math.cos(subAngle) * ((rNoyau + R) * 0.52);
    const descY = cy + Math.sin(subAngle) * ((rNoyau + R) * 0.52);
    this.drawBadge(descX, descY, "MATÉRIEL REFROIDI DENSE QUI REDESCEND", "Zone de subduction : la lithosphère plonge avec le flux froid", "#38bdf8", true);
  }

  // =========================================================================
  // VUE 2 : ZOOM 1 - LES 3 STADES DE L'OUVERTURE OCÉANIQUE (STYLE SCHÉMA SVT OFFICIEL)
  // Reproduction fidèle, haute résolution et animée du schéma SVT de référence :
  // - Fond blanc immaculé de planche scientifique
  // - Typographie Serif (Georgia/Times) conforme au manuel scolaire
  // - Dôme mantellique thermique rouge-orange-jaune
  // - Blocs continentaux marrons basculés en gradins (failles normales) : 150 km
  // - Plancher basaltique prismatique et dorsale axiale : 100 km (ratio 2/3 strict)
  // - Sédiments jaunes biseautés et eau de mer cyan à lagon
  // - Flèches rouges fines, flèches d'extension et flèches de convection
  // =========================================================================
  renderDivergenceContinuousView() {
    const w = this.width;
    const h = this.height;
    const xc = w * 0.5;

    // Fond blanc pur de planche de manuel scolaire SVT (comme sur le schéma de référence)
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, w, h);

    // Paramètre de progression continue (0 à 1)
    const P = Math.min(1.0, Math.max(0.0, this.divergenceProgress));

    // Détermination du stade actif et titre officiel en police Serif
    let currentStage = 1;
    let stageTitle = "Rifting continental";
    if (P >= 0.33 && P < 0.66) {
      currentStage = 2;
      stageTitle = "Stade jeune océan";
    } else if (P >= 0.66) {
      currentStage = 3;
      stageTitle = "Stade océan mature";
    }

    // Titre officiel du stade en haut au centre (Serif bleu nuit/noir noble)
    this.ctx.save();
    this.ctx.font = "bold 26px 'Georgia', 'Times New Roman', serif";
    this.ctx.fillStyle = "#1e293b";
    this.ctx.textAlign = "center";
    this.ctx.fillText(stageTitle, xc, 40);
    this.ctx.restore();

    // --- PARAMÈTRES GÉOMÉTRIQUES & ÉPAISSEURS (150 km vs 100 km) ---
    // Lithosphère continentale = 150 km
    // Lithosphère océanique = 100 km (exactement les 2/3 de 150 km)
    const mantleTopY = Math.round(h * 0.60); // Ligne de base du Manteau
    const mantleBottomY = h - 25;
    const litho150 = Math.round(h * 0.32); // Épaisseur 150 km en px
    const litho100 = Math.round(litho150 * (100 / 150)); // Épaisseur 100 km en px (ratio exact 2/3)
    const topContY = mantleTopY - litho150; // Surface supérieure continentale

    // Écartement des blocs selon la progression
    let halfSplit = 20 + P * (w * 0.28);
    const bLeftX = xc - halfSplit;
    const bRightX = xc + halfSplit;

    // 1. LE MANTEAU (En bas, dégradé rouge-orangé-jaune avec dôme thermique)
    this.drawTeacherMantle(xc, mantleTopY, mantleBottomY, w, bLeftX, bRightX, currentStage, P);

    // 2. L'EAU DE MER (Dégradé cyan à bleu profond entre les blocs continentaux)
    const seaLevelY = topContY + 30;
    if (P > 0.05) {
      this.drawTeacherSeaWater(bLeftX, bRightX, seaLevelY, mantleTopY, currentStage, P);
    }

    // 3. LES BASALTES ET LA DORSALE OCÉANIQUE (Posés sur le manteau, épaisseur 100 km)
    if (P >= 0.22) {
      this.drawTeacherBasaltsAndRidge(xc, bLeftX, bRightX, mantleTopY, litho100, currentStage, P);
    }

    // 4. LES SÉDIMENTS JAUNES (Biseaux parfaits de part et d'autre)
    if (P >= 0.28) {
      this.drawTeacherSediments(xc, bLeftX, bRightX, mantleTopY, litho100, currentStage, P);
    }

    // 5. LA CROÛTE CONTINENTALE MARRON (Blocs basculés avec gradins de failles normales)
    this.drawTeacherContinentalCrust(bLeftX, bRightX, topContY, mantleTopY, w, currentStage, P);

    // 6. ANNOTATIONS EXACTES DU SCHÉMA DE RÉFÉRENCE (Serif)
    if (currentStage === 1) {
      this.drawTeacherStage1Annotations(xc, topContY, bLeftX, bRightX);
    } else if (currentStage === 2) {
      this.drawTeacherStage2Annotations(xc, mantleTopY - litho100 * 0.5);
    } else {
      this.drawTeacherStage3Annotations(xc, mantleTopY, litho100, bRightX, w);
    }

    // 7. COTES D'ÉPAISSEURS (150 km continentale / 100 km océanique)
    this.drawTeacherThicknessLabels(topContY, mantleTopY, litho150, litho100, bLeftX, bRightX, xc, currentStage);
  }

  // Manteau chaud : rouge brique intense au sommet, orange vif au milieu, jaune doré en bas
  drawTeacherMantle(xc, topY, bottomY, w, bLeftX, bRightX, stage, P) {
    this.ctx.save();

    // Dégradé vertical flamboyant
    const grad = this.ctx.createLinearGradient(0, topY - 25, 0, bottomY);
    grad.addColorStop(0, "#b91c1c"); // Rouge brique intense au contact thermique
    grad.addColorStop(0.18, "#c2410c"); // Rouge-orangé
    grad.addColorStop(0.55, "#ea580c"); // Orange vif
    grad.addColorStop(1, "#f59e0b"); // Jaune d'or lumineux

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.moveTo(0, topY);

    if (stage === 1) {
      // Au Stade 1 : Dôme mantellique doux et régulier qui remonte au centre sous le rift
      this.ctx.lineTo(bLeftX - 20, topY);
      this.ctx.quadraticCurveTo(xc, topY - 26, bRightX + 20, topY);
      this.ctx.lineTo(w, topY);
    } else if (stage === 2) {
      // Au Stade 2 : Remontée sous la jeune déchirure océanique
      this.ctx.lineTo(bLeftX, topY);
      this.ctx.quadraticCurveTo(xc, topY - 20, bRightX, topY);
      this.ctx.lineTo(w, topY);
    } else {
      // Au Stade 3 : Plat sous les blocs continentaux, légère surélévation sous la dorsale
      this.ctx.lineTo(bLeftX, topY);
      this.ctx.quadraticCurveTo(xc, topY - 14, bRightX, topY);
      this.ctx.lineTo(w, topY);
    }

    this.ctx.lineTo(w, bottomY);
    this.ctx.lineTo(0, bottomY);
    this.ctx.closePath();
    this.ctx.fill();

    // Liseré rouge sombre de démarcation
    this.ctx.strokeStyle = "#991b1b";
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    // Mot "Manteau" écrit en noir en bas à droite comme sur le schéma
    this.ctx.font = "italic 18px 'Georgia', 'Times New Roman', serif";
    this.ctx.fillStyle = "#1e1e1e";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Manteau", w - 40, bottomY - 12);

    // Deux flèches de convection divergentes au centre : ↶ ↷
    this.drawMantleCurvedDivergenceArrows(xc, (topY + bottomY) * 0.5 + 4);
    this.ctx.restore();
  }

  // Eau de mer bleu lagon / cyan (couleurs franches de l'image de référence)
  drawTeacherSeaWater(bLeftX, bRightX, seaLevelY, mantleTopY, stage, P) {
    this.ctx.save();
    const waterAlpha = Math.min(1.0, (P - 0.05) * 4);
    const grad = this.ctx.createLinearGradient(0, seaLevelY, 0, mantleTopY);
    grad.addColorStop(0, `rgba(56, 189, 248, ${0.95 * waterAlpha})`); // Cyan vif
    grad.addColorStop(1, `rgba(2, 132, 199, ${0.98 * waterAlpha})`); // Bleu profond

    const left = Math.max(0, bLeftX - 4);
    const right = Math.min(this.width, bRightX + 4);

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(left, seaLevelY, right - left, mantleTopY - seaLevelY);

    // Ligne de surface de l'eau
    this.ctx.strokeStyle = `rgba(186, 230, 253, ${waterAlpha})`;
    this.ctx.lineWidth = 1.6;
    this.ctx.beginPath();
    this.ctx.moveTo(left, seaLevelY);
    this.ctx.lineTo(right, seaLevelY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  // Basaltes et dorsale océanique : prismes verticaux gris sombre (orgues basaltiques)
  drawTeacherBasaltsAndRidge(xc, bLeftX, bRightX, mantleTopY, litho100, stage, P) {
    this.ctx.save();
    this.ctx.fillStyle = "#262626"; // Anthracite sombre
    this.ctx.strokeStyle = "#171717";
    this.ctx.lineWidth = 1.2;

    const floorY = mantleTopY - litho100; // Sommet du plancher basaltique (100 km)

    if (stage === 2) {
      // STADE 2 : Massif central de prismes basaltiques
      const halfW = Math.min(75, (bRightX - bLeftX) * 0.34);
      const ridgeH = litho100 + 14;
      const topColY = mantleTopY - ridgeH;

      const cols = 12;
      for (let i = 0; i < cols; i++) {
        const colX = xc - halfW + (i / cols) * (halfW * 2);
        const colW = (halfW * 2) / cols;
        const distFromCenter = Math.abs(i - cols * 0.5) / (cols * 0.5);
        const curTopY = topColY + distFromCenter * 12;

        this.ctx.fillRect(colX, curTopY, colW, mantleTopY - curTopY);
        this.ctx.strokeRect(colX, curTopY, colW, mantleTopY - curTopY);
      }

      // Mot "Basaltes" écrit en blanc sur les prismes comme sur le schéma
      this.ctx.font = "14px 'Georgia', serif";
      this.ctx.fillStyle = "#ffffff";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Basaltes", xc, topColY + 30);

    } else if (stage === 3) {
      // STADE 3 : Plancher basaltique continu (100 km) + Dorsale océanique médiane culminante
      const leftBasalt = bLeftX + 5;
      const rightBasalt = bRightX - 5;

      // 1. Plancher basaltique horizontal de part et d'autre (100 km d'épaisseur)
      this.ctx.fillRect(leftBasalt, floorY, rightBasalt - leftBasalt, litho100);
      this.ctx.strokeRect(leftBasalt, floorY, rightBasalt - leftBasalt, litho100);

      // Tracé des colonnes régulières sur le plancher
      this.ctx.strokeStyle = "rgba(60, 60, 60, 0.4)";
      this.ctx.lineWidth = 1;
      for (let x = leftBasalt + 18; x < rightBasalt; x += 18) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, floorY);
        this.ctx.lineTo(x, mantleTopY);
        this.ctx.stroke();
      }

      // 2. Relief triangulaire culminant de la dorsale océanique au centre
      const ridgeHalfW = Math.min(95, (bRightX - bLeftX) * 0.22);
      const ridgeTopY = floorY - 28; // Sommet de la dorsale

      const cols = 16;
      this.ctx.fillStyle = "#262626";
      this.ctx.strokeStyle = "#171717";
      for (let i = 0; i < cols; i++) {
        const colX = xc - ridgeHalfW + (i / cols) * (ridgeHalfW * 2);
        const colW = (ridgeHalfW * 2) / cols;
        const dist = Math.abs(i - cols * 0.5) / (cols * 0.5);
        let curTopY = ridgeTopY + dist * 26;

        // Petite encoche pour le rift axial au centre exact
        if (Math.abs(i - cols * 0.5) <= 1.2) curTopY += 6;

        this.ctx.fillRect(colX, curTopY, colW, mantleTopY - curTopY);
        this.ctx.strokeRect(colX, curTopY, colW, mantleTopY - curTopY);
      }

      // Petit filet de magma liquide effusif au centre de la dorsale
      this.ctx.fillStyle = "#ef4444";
      this.ctx.beginPath();
      this.ctx.arc(xc, ridgeTopY + 7, 3.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  // Sédiments jaune vif pur biseautés posés sur les basaltes
  drawTeacherSediments(xc, bLeftX, bRightX, mantleTopY, litho100, stage, P) {
    this.ctx.save();
    this.ctx.fillStyle = "#fed330"; // Jaune vif pur du schéma de référence
    this.ctx.strokeStyle = "#d9a800";
    this.ctx.lineWidth = 1.2;

    const floorY = mantleTopY - litho100;

    if (stage === 2) {
      // Petits triangles jaunes collés aux blocs marrons
      const halfW = (bRightX - bLeftX) * 0.34;
      // Triangle gauche
      this.ctx.beginPath();
      this.ctx.moveTo(bLeftX + 5, floorY + 12);
      this.ctx.lineTo(bLeftX + 5, floorY - 8);
      this.ctx.lineTo(xc - halfW + 6, floorY + 12);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Triangle droit
      this.ctx.beginPath();
      this.ctx.moveTo(bRightX - 5, floorY + 12);
      this.ctx.lineTo(bRightX - 5, floorY - 8);
      this.ctx.lineTo(xc + halfW - 6, floorY + 12);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

    } else if (stage === 3) {
      // Biseau régulier : épaisseur nulle à la dorsale, épaisse vers les marges
      const ridgeHalfW = Math.min(95, (bRightX - bLeftX) * 0.22);
      const sedH = 20;

      // Sédiments côté gauche
      this.ctx.beginPath();
      this.ctx.moveTo(bLeftX + 5, floorY);
      this.ctx.lineTo(bLeftX + 5, floorY - sedH);
      this.ctx.lineTo(xc - ridgeHalfW - 4, floorY);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Sédiments côté droit
      this.ctx.beginPath();
      this.ctx.moveTo(bRightX - 5, floorY);
      this.ctx.lineTo(bRightX - 5, floorY - sedH);
      this.ctx.lineTo(xc + ridgeHalfW + 4, floorY);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // Croûte continentale marron : blocs basculés en gradins avec failles normales
  drawTeacherContinentalCrust(bLeftX, bRightX, topY, baseY, totalW, stage, P) {
    this.ctx.save();
    this.ctx.fillStyle = "#67261a"; // Marron terreux chocolat du schéma
    this.ctx.strokeStyle = "#43160e";
    this.ctx.lineWidth = 2;

    // --- A. BLOC CONTINENTAL GAUCHE (Épaisseur 150 km) ---
    this.ctx.beginPath();
    this.ctx.moveTo(0, topY + 30);
    this.ctx.lineTo(0, baseY);
    this.ctx.lineTo(bLeftX + (stage === 1 ? 25 : 0), baseY);

    // Profil de blocs basculés descendant en dents de scie vers l'axe
    this.ctx.lineTo(bLeftX, topY + 28);
    this.ctx.lineTo(bLeftX - 35, topY);       // Épaulement (crête 1)
    this.ctx.lineTo(bLeftX - 45, topY + 18);  // Faille normale 1
    this.ctx.lineTo(bLeftX - 85, topY + 6);   // Crête 2
    this.ctx.lineTo(bLeftX - 95, topY + 22);  // Faille normale 2
    this.ctx.lineTo(bLeftX - 135, topY + 12); // Crête 3
    this.ctx.lineTo(0, topY + 30);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // --- B. BLOC CONTINENTAL DROIT (Symétrique) ---
    this.ctx.beginPath();
    this.ctx.moveTo(totalW, topY + 30);
    this.ctx.lineTo(totalW, baseY);
    this.ctx.lineTo(bRightX - (stage === 1 ? 25 : 0), baseY);

    this.ctx.lineTo(bRightX, topY + 28);
    this.ctx.lineTo(bRightX + 35, topY);       // Épaulement (crête 1)
    this.ctx.lineTo(bRightX + 45, topY + 18);  // Faille normale 1
    this.ctx.lineTo(bRightX + 85, topY + 6);   // Crête 2
    this.ctx.lineTo(bRightX + 95, topY + 22);  // Faille normale 2
    this.ctx.lineTo(bRightX + 135, topY + 12); // Crête 3
    this.ctx.lineTo(totalW, topY + 30);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Traits sombres des failles normales descendant obliquement dans la croûte
    this.drawInternalFaultLine(bLeftX - 45, topY + 18, bLeftX - 25, baseY);
    this.drawInternalFaultLine(bLeftX - 95, topY + 22, bLeftX - 75, baseY);
    this.drawInternalFaultLine(bRightX + 45, topY + 18, bRightX + 25, baseY);
    this.drawInternalFaultLine(bRightX + 95, topY + 22, bRightX + 75, baseY);

    // Flèches noires horizontales d'extension dans la croûte (← et →)
    if (stage === 1) {
      this.drawHorizontalBlackArrow(bLeftX - 100, topY + 50, -45);
      this.drawHorizontalBlackArrow(bRightX + 100, topY + 50, 45);
    } else if (stage === 2) {
      this.drawHorizontalBlackArrow(bLeftX - 70, topY + 55, -40);
      this.drawHorizontalBlackArrow(bRightX + 70, topY + 55, 40);
    } else {
      // Au stade 3 : flèche vers la gauche sur le continent gauche
      this.drawHorizontalBlackArrow(bLeftX - 40, topY + 60, -35);
    }

    this.ctx.restore();
  }

  // Annotations exactes du Stade 1 (Rifting continental)
  drawTeacherStage1Annotations(xc, topY, bLeftX, bRightX) {
    this.ctx.save();
    this.ctx.font = "14px 'Georgia', serif";

    // 1. Bombement topographique (arc de cercle en pointillés gris foncé)
    this.ctx.strokeStyle = "rgba(30, 41, 59, 0.75)";
    this.ctx.setLineDash([4, 4]);
    this.ctx.lineWidth = 1.6;
    this.ctx.beginPath();
    this.ctx.moveTo(bLeftX - 35, topY);
    this.ctx.quadraticCurveTo(xc, topY - 24, bRightX + 35, topY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.fillStyle = "#1e293b";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Bombement topographique", xc, topY - 30);

    // 2. Épaulements
    this.ctx.fillStyle = "#3b130c";
    this.ctx.fillText("Épaulement", bLeftX - 35, topY + 15);
    this.ctx.fillText("Épaulement", bRightX + 35, topY + 15);

    // 3. Subsidence tectonique et thermique (dans le creux central)
    this.ctx.fillStyle = "#9a3412";
    this.ctx.fillText("Subsidence", xc, topY + 44);
    this.ctx.fillText("tectonique et thermique", xc, topY + 62);

    this.ctx.restore();
  }

  // Annotations du Stade 2
  drawTeacherStage2Annotations(xc, basaltsY) {}

  // Annotations exactes du Stade 3 (Stade océan mature)
  drawTeacherStage3Annotations(xc, mantleTopY, litho100, bRightX, totalW) {
    this.ctx.save();
    this.ctx.font = "15px 'Georgia', serif";

    const floorY = mantleTopY - litho100;
    const ridgeTopY = floorY - 28;

    // 1. "Dorsale océanique" avec flèche rouge pointant sur la dorsale
    this.ctx.fillStyle = "#1e293b";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Dorsale océanique", xc - 30, ridgeTopY - 20);
    this.drawRedPointerArrow(xc - 26, ridgeTopY - 17, xc - 4, ridgeTopY + 4);

    // 2. "Sédiments" avec flèche rouge pointant sur les sédiments jaunes
    this.ctx.textAlign = "left";
    this.ctx.fillText("Sédiments", xc + 75, ridgeTopY - 16);
    this.drawRedPointerArrow(xc + 72, ridgeTopY - 12, xc + 50, floorY - 8);

    // 3. "Croûte" écrit en couleur sable/blanche au milieu du continent droit
    this.ctx.font = "bold 16px 'Georgia', serif";
    this.ctx.fillStyle = "#fed7aa";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Croûte", bRightX + 55, mantleTopY - 35);

    this.ctx.restore();
  }

  // Cotes d'épaisseurs élégantes et discrètes : 150 km et 100 km
  drawTeacherThicknessLabels(topContY, mantleTopY, litho150, litho100, bLeftX, bRightX, xc, stage) {
    this.ctx.save();

    // Double flèche de cote sur le continent gauche : 150 km
    const contX = Math.max(35, bLeftX - 110);
    this.drawDimensionIndicator(contX, topContY + 30, mantleTopY, "150 km", "Lithosphère continentale", "#dc2626");

    // Double flèche de cote sur la lithosphère océanique (100 km) - Stades 2 et 3
    if (stage >= 2 && (bRightX - xc) > 65) {
      const oceanX = xc + (bRightX - xc) * 0.48;
      const floorY = mantleTopY - litho100;
      this.drawDimensionIndicator(oceanX, floorY, mantleTopY, "100 km", "Lithosphère océanique", "#0284c7");
    }

    this.ctx.restore();
  }

  // Double flèche de cote avec cartouche lisible sur fond blanc
  drawDimensionIndicator(x, yTop, yBottom, kmLabel, fullLabel, color) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 1.6;

    // Arrêts horizontaux
    this.ctx.beginPath();
    this.ctx.moveTo(x - 5, yTop);
    this.ctx.lineTo(x + 5, yTop);
    this.ctx.moveTo(x - 5, yBottom);
    this.ctx.lineTo(x + 5, yBottom);
    this.ctx.stroke();

    // Ligne verticale
    this.ctx.beginPath();
    this.ctx.moveTo(x, yTop);
    this.ctx.lineTo(x, yBottom);
    this.ctx.stroke();

    // Pointe haut
    this.ctx.beginPath();
    this.ctx.moveTo(x, yTop);
    this.ctx.lineTo(x - 3.5, yTop + 6);
    this.ctx.lineTo(x + 3.5, yTop + 6);
    this.ctx.closePath();
    this.ctx.fill();

    // Pointe bas
    this.ctx.beginPath();
    this.ctx.moveTo(x, yBottom);
    this.ctx.lineTo(x - 3.5, yBottom - 6);
    this.ctx.lineTo(x + 3.5, yBottom - 6);
    this.ctx.closePath();
    this.ctx.fill();

    // Cartouche texte
    const midY = (yTop + yBottom) * 0.5;
    this.ctx.font = "bold 11px sans-serif";
    const text = `${kmLabel} (${fullLabel})`;
    const textW = this.ctx.measureText(text).width;
    const badgeW = textW + 14;
    const badgeH = 20;

    this.ctx.fillStyle = "#ffffff";
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.roundRect(x - badgeW * 0.5, midY - badgeH * 0.5, badgeW, badgeH, 4);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, x, midY);

    this.ctx.restore();
  }

  // Trait sombre de faille normale dans la roche
  drawInternalFaultLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = "rgba(40, 10, 5, 0.75)";
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  // Flèche rouge fine pointant sur les légendes (dorsale, sédiments)
  drawRedPointerArrow(x1, y1, x2, y2) {
    this.ctx.save();
    this.ctx.strokeStyle = "#dc2626"; // Rouge vif
    this.ctx.fillStyle = "#dc2626";
    this.ctx.lineWidth = 1.8;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    const angle = Math.atan2(y2 - y1, x2 - x1);
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(x2 - Math.cos(angle - 0.4) * 8, y2 - Math.sin(angle - 0.4) * 8);
    this.ctx.lineTo(x2 - Math.cos(angle + 0.4) * 8, y2 - Math.sin(angle + 0.4) * 8);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  // Flèches courbes divergentes dans le manteau (↶ ↷)
  drawMantleCurvedDivergenceArrows(xc, y) {
    this.ctx.save();
    this.ctx.strokeStyle = "#000000";
    this.ctx.fillStyle = "#000000";
    this.ctx.lineWidth = 2.4;

    // Flèche gauche
    this.ctx.beginPath();
    this.ctx.moveTo(xc - 4, y + 16);
    this.ctx.quadraticCurveTo(xc - 8, y, xc - 36, y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(xc - 38, y);
    this.ctx.lineTo(xc - 28, y - 5);
    this.ctx.lineTo(xc - 28, y + 5);
    this.ctx.closePath();
    this.ctx.fill();

    // Flèche droite
    this.ctx.beginPath();
    this.ctx.moveTo(xc + 4, y + 16);
    this.ctx.quadraticCurveTo(xc + 8, y, xc + 36, y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(xc + 38, y);
    this.ctx.lineTo(xc + 28, y - 5);
    this.ctx.lineTo(xc + 28, y + 5);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  // Flèche noire horizontale d'extension dans la croûte (← ou →)
  drawHorizontalBlackArrow(x, y, len) {
    this.ctx.save();
    this.ctx.strokeStyle = "#000000";
    this.ctx.fillStyle = "#000000";
    this.ctx.lineWidth = 2.4;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + len, y);
    this.ctx.stroke();

    const dir = len > 0 ? 1 : -1;
    this.ctx.beginPath();
    this.ctx.moveTo(x + len + dir * 3, y);
    this.ctx.lineTo(x + len - dir * 6, y - 5);
    this.ctx.lineTo(x + len - dir * 6, y + 5);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }


  // =========================================================================
  // VUE 3 : ZOOM 2 - SUBDUCTION & VOLCANISME EXPLOSIF
  // =========================================================================
  renderSubductionView() {
    const w = this.width;
    const h = this.height;

    this.ctx.fillStyle = "#0a101f";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const fosseX = w * 0.38;

    const asthGrad = this.ctx.createLinearGradient(0, surfaceY, 0, h);
    asthGrad.addColorStop(0, "#9a3412");
    asthGrad.addColorStop(1, "#c2410c");
    this.ctx.fillStyle = asthGrad;
    this.ctx.fillRect(0, surfaceY, w, h - surfaceY);

    this.drawDescendingConvectionArrows(fosseX + 50, surfaceY + 120, h - 30);

    // Eau de mer
    this.ctx.fillStyle = "rgba(3, 105, 161, 0.85)";
    this.ctx.beginPath();
    this.ctx.moveTo(0, surfaceY);
    this.ctx.lineTo(fosseX, surfaceY + 26);
    this.ctx.lineTo(fosseX + 22, surfaceY);
    this.ctx.lineTo(0, surfaceY);
    this.ctx.closePath();
    this.ctx.fill();

    // Plaque océanique plongeante (100 km, dense)
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

    // Déshydratation
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

    // Fusion partielle
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

    // Continent chevauchant (150 km)
    const cont150H = oce100H * 1.5;
    const volcanoX = fosseX + 165;

    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(fosseX + 22, surfaceY);
    this.ctx.lineTo(volcanoX - 60, surfaceY);
    this.ctx.lineTo(volcanoX - 25, surfaceY - 55);
    this.ctx.lineTo(volcanoX + 25, surfaceY - 55);
    this.ctx.lineTo(volcanoX + 60, surfaceY);
    this.ctx.lineTo(w, surfaceY);
    this.ctx.lineTo(w, surfaceY + cont150H);
    this.ctx.lineTo(fosseX + 125, surfaceY + cont150H);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Magma visqueux & éruption explosive
    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.moveTo(volcanoX - 10, surfaceY + 75);
    this.ctx.lineTo(volcanoX + 10, surfaceY + 75);
    this.ctx.lineTo(volcanoX + 8, surfaceY - 45);
    this.ctx.lineTo(volcanoX - 8, surfaceY - 45);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = "#7f1d1d";
    this.ctx.beginPath();
    this.ctx.arc(volcanoX, surfaceY - 52, 14, Math.PI, 0);
    this.ctx.fill();

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

    if (this.showGrid) {
      this.drawZoomMetricScale(surfaceY, cont150H, 150);
    }

    this.drawMotionArrow(fosseX - 45, surfaceY + 45, 1, "Plongement");

    if (this.showLabels) {
      this.drawBadge(fosseX - 100, surfaceY - 15, "FOSSE OCÉANIQUE", "Zone de convergence", "#0284c7");
      this.drawBadge(w * 0.15, surfaceY + oce100H * 0.5, "LITHOSPHÈRE OCÉANIQUE", "Épaisseur : 100 km (Dense & Froide)", "#1e3a5f");
      this.drawBadge(volcanoX + 120, surfaceY - 25, "VOLCANISME EXPLOSIF", "Magma visqueux riche en silice & gaz", "#ef4444");
      this.drawBadge(w * 0.78, surfaceY + cont150H * 0.4, "LITHOSPHÈRE CONTINENTALE", "Chevauchante (150 km)", "#8b5e3c");
      this.drawBadge(fosseX + 145, surfaceY + 120, "DÉSHYDRATATION DE LA PLAQUE", "L'eau libérée fait fondre le manteau", "#67e8f9");
    }
  }

  // =========================================================================
  // VUE 4 : ZOOM 3 - SÉISME & SISMOGRAMMES DIFFÉRÉS
  // =========================================================================
  renderSeismeView() {
    const w = this.width;
    const h = this.height;

    if (this.seismeState.shakingIntensity > 0.05) {
      const shakeX = (Math.random() - 0.5) * 8 * this.seismeState.shakingIntensity;
      const shakeY = (Math.random() - 0.5) * 6 * this.seismeState.shakingIntensity;
      this.ctx.translate(shakeX, shakeY);
      this.seismeState.shakingIntensity *= 0.96;
    }

    this.ctx.fillStyle = "#0c1527";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const litho150H = h * 0.35;
    const lithoBottom = surfaceY + litho150H;

    this.ctx.fillStyle = "#c2410c";
    this.ctx.fillRect(0, lithoBottom, w, h - lithoBottom);

    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(0, surfaceY, w, litho150H);

    const foyerX = w * 0.32;
    const foyerY = surfaceY + litho150H * 0.52;
    const epicentreX = foyerX;
    const epicentreY = surfaceY;

    this.seismeState.foyer = { x: foyerX, y: foyerY };
    this.seismeState.epicentre = { x: epicentreX, y: epicentreY };

    this.ctx.strokeStyle = "#f87171";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(foyerX - 60, surfaceY);
    this.ctx.lineTo(foyerX + 70, lithoBottom);
    this.ctx.stroke();

    if (!this.seismeState.triggered) {
      const pulse = Math.sin(this.time * 6) * 4;
      this.drawCompressiveArrow(foyerX - 110 + pulse, foyerY - 20, 1);
      this.drawCompressiveArrow(foyerX + 110 - pulse, foyerY + 20, -1);
    }

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

      this.ctx.fillStyle = "#ef4444";
      this.ctx.beginPath();
      this.ctx.arc(foyerX, foyerY, 8 + Math.sin(this.time * 15) * 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    const villeAX = foyerX + 85;
    this.seismeState.stationA.x = villeAX;
    this.seismeState.stationA.y = surfaceY;

    const villeBX = foyerX + 325;
    this.seismeState.stationB.x = villeBX;
    this.seismeState.stationB.y = surfaceY;

    this.drawEpicentreZone(epicentreX, epicentreY);

    const distToA = Math.hypot(villeAX - foyerX, surfaceY - foyerY);
    const reachedA = this.seismeState.waveRadius >= distToA;
    if (reachedA && !this.seismeState.stationA.reached) {
      this.seismeState.stationA.reached = true;
      document.getElementById("statusA").textContent = "Ondes reçues ! Secousse forte";
      document.getElementById("statusA").style.color = "#ef4444";
    }
    this.drawBuilding(villeAX, surfaceY, "standard", reachedA);

    const distToB = Math.hypot(villeBX - foyerX, surfaceY - foyerY);
    const reachedB = this.seismeState.waveRadius >= distToB;
    if (reachedB && !this.seismeState.stationB.reached) {
      this.seismeState.stationB.reached = true;
      document.getElementById("statusB").textContent = "Ondes reçues avec RETARD !";
      document.getElementById("statusB").style.color = "#4ade80";
    }
    this.drawBuilding(villeBX, surfaceY, "parasismique", reachedB);

    this.ctx.fillStyle = "#fbbf24";
    this.ctx.strokeStyle = "#b45309";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(foyerX, foyerY, 7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(foyerX, foyerY);
    this.ctx.lineTo(epicentreX, epicentreY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    if (this.showGrid) {
      this.drawZoomMetricScale(surfaceY, litho150H, 150);
    }

    if (this.showLabels) {
      this.drawBadge(foyerX, foyerY + 28, "FOYER SISMIQUE (Hypocentre)", "Rupture brutale de la roche rigide", "#ef4444", true);
      this.drawBadge(epicentreX, epicentreY - 45, "ÉPICENTRE", "Point vertical en surface (dégâts maximaux)", "#f59e0b", true);
      this.drawBadge(villeAX, surfaceY - 55, "VILLE A (25 km)", "Bâtiment ordinaire écroulé", "#ef4444");
      this.drawBadge(villeBX, surfaceY - 55, "VILLE B (95 km)", "Maison PARASISMIQUE intacte", "#22c55e");
      this.drawBadge(w * 0.18, lithoBottom - 25, "LITHOSPHÈRE RIGIDE (150 km)", "Seule capable de casser !", "#8b5e3c");
      this.drawBadge(w * 0.18, lithoBottom + 30, "ASTHÉNOSPHÈRE DUCTILE", "Se déforme sans casser", "#c2410c");
    }

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
        ampA = Math.sin(this.time * 24) * 20 * Math.exp(-elapsedA * 0.4);
      }
      if (this.seismeState.stationB.reached) {
        const elapsedB = this.time - (this.seismeState.ruptureTime + 1.2);
        ampB = Math.sin(this.time * 18) * 9 * Math.exp(-elapsedB * 0.35);
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
  // OUTILS DE DESSIN COMMUNS
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

// Initialisation garantie dès le chargement
function startSimApp() {
  if (!window.sim) {
    try {
      window.sim = new TectoniqueSimulation();
    } catch (e) {
      console.error("Erreur de lancement TectoniqueSimulation:", e);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startSimApp);
} else {
  startSimApp();
}
window.addEventListener("load", startSimApp);
