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
    return {
      z1: { x: cx, y: cy - R - 32, label: "ZOOM 1" },
      z2: { x: cx + Math.cos(-Math.PI * 0.22) * (R + 45), y: cy + Math.sin(-Math.PI * 0.22) * (R + 45), label: "ZOOM 2" },
      z3: { x: cx + Math.cos(-Math.PI * 0.78) * (R + 45), y: cy + Math.sin(-Math.PI * 0.78) * (R + 45), label: "ZOOM 3" }
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

    this.convectionParticles.forEach((p) => {
      p.progress = (p.progress + p.speed * this.speed) % 1.0;
      let curR, curAngle;
      const isLeft = p.cell === "left";
      const sign = isLeft ? -1 : 1;

      if (p.progress < 0.25) {
        const frac = p.progress / 0.25;
        curR = rInner + frac * totalW;
        curAngle = -Math.PI * 0.5 + sign * (0.04 + p.offset);
      } else if (p.progress < 0.50) {
        const frac = (p.progress - 0.25) / 0.25;
        curR = rOuter - 6 + p.offset * 20;
        curAngle = -Math.PI * 0.5 + sign * (0.04 + frac * 0.45);
      } else if (p.progress < 0.75) {
        const frac = (p.progress - 0.50) / 0.25;
        curR = rOuter - frac * totalW;
        curAngle = -Math.PI * 0.5 + sign * (0.49 - p.offset * 0.2);
      } else {
        const frac = (p.progress - 0.75) / 0.25;
        curR = rInner + 8 + p.offset * 15;
        curAngle = -Math.PI * 0.5 + sign * (0.49 - frac * 0.45);
      }

      let color;
      if (p.progress < 0.35 || p.progress > 0.85) {
        color = "rgba(254, 240, 138, 0.85)";
      } else if (p.progress < 0.55) {
        color = "rgba(249, 115, 22, 0.8)";
      } else {
        color = "rgba(56, 189, 248, 0.8)";
      }

      const px = cx + Math.cos(curAngle) * curR;
      const py = cy + Math.sin(curAngle) * curR;

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(px, py, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.save();
    this.ctx.setLineDash([5, 5]);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "rgba(254, 240, 138, 0.35)";
    this.ctx.beginPath();
    this.ctx.ellipse(cx - (rInner + rOuter) * 0.26, cy - (rInner + rOuter) * 0.42, totalW * 0.42, totalW * 0.35, -0.4, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.ellipse(cx + (rInner + rOuter) * 0.26, cy - (rInner + rOuter) * 0.42, totalW * 0.42, totalW * 0.35, 0.4, 0, Math.PI * 2);
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

    // Au niveau de la zone de divergence (sommet, -Math.PI * 0.5) : remontée de chaleur / magma rouge
    const dorsaleAngle = -Math.PI * 0.5;
    const dx = cx + Math.cos(dorsaleAngle) * R;
    const dy = cy + Math.sin(dorsaleAngle) * R;

    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.arc(dx, dy + 1, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Au niveau de la zone de subduction (-Math.PI * 0.25) :
    // La lithosphère qui plonge a STRICTEMENT la MÊME couleur lithosphérique partout !
    const subAngle = -Math.PI * 0.25;
    const sx = cx + Math.cos(subAngle) * R;
    const sy = cy + Math.sin(subAngle) * R;

    this.ctx.save();
    this.ctx.strokeStyle = lithoColor;
    this.ctx.lineWidth = lithoThickness;
    this.ctx.beginPath();
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(sx - Math.cos(subAngle) * 48, sy - Math.sin(subAngle) * 48 + 32);
    this.ctx.stroke();

    // Liseré pour délimiter nettement la plaque plongeante dans l'asthénosphère
    this.ctx.strokeStyle = lithoBorder;
    this.ctx.lineWidth = 1.6;
    this.ctx.beginPath();
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(sx - Math.cos(subAngle) * 48, sy - Math.sin(subAngle) * 48 + 32);
    this.ctx.stroke();
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

    const descX = cx + Math.cos(-Math.PI * 0.38) * ((rNoyau + R) * 0.5);
    const descY = cy + Math.sin(-Math.PI * 0.38) * ((rNoyau + R) * 0.5);
    this.drawBadge(descX, descY, "COURANT DESCENDANT", "Matière refroidie et dense qui plonge", "#38bdf8", true);
  }

  // =========================================================================
  // VUE 2 : ZOOM 1 - LES 3 STADES DE L'OUVERTURE OCÉANIQUE (ÉCHELLES RESPECTÉES)
  // Lithosphère continentale = 150 km
  // Lithosphère océanique = 100 km
  // Asthénosphère ductile en dessous
  // =========================================================================
  renderDivergenceContinuousView() {
    const w = this.width;
    const h = this.height;
    const xc = w * 0.5;

    // Fond ciel / atmosphère au-dessus du relief
    this.ctx.fillStyle = "#0c1527";
    this.ctx.fillRect(0, 0, w, h);

    // Paramètre de progression continue (0 à 1)
    const P = Math.min(1.0, Math.max(0.0, this.divergenceProgress));

    // Détermination du stade actif pour le titre et les annotations
    let currentStage = 1;
    let stageTitle = "Rifting continental";
    if (P >= 0.33 && P < 0.66) {
      currentStage = 2;
      stageTitle = "Stade jeune océan";
    } else if (P >= 0.66) {
      currentStage = 3;
      stageTitle = "Stade océan mature";
    }

    // Titre officiel du stade affiché en haut au centre
    this.ctx.save();
    this.ctx.font = "bold 20px Georgia, serif";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";
    this.ctx.fillText(stageTitle, xc, 34);
    this.ctx.restore();

    // 1. ÉCHELLE GÉOLOGIQUE VERTICALE EN PROFONDEUR (km)
    // Lithosphère continentale = 150 km
    // Lithosphère océanique = 100 km
    const kmScale = Math.min(1.35, Math.max(0.85, (h * 0.52) / 200));
    const y0 = Math.round(h * 0.20); // Surface de référence continentale (0 km)
    const H150 = Math.round(150 * kmScale); // 150 km en px (Lithosphère continentale)
    const H100 = Math.round(100 * kmScale); // 100 km en px (Lithosphère océanique)
    const baseContY = y0 + H150; // Base lithosphère continentale (150 km)

    const oceanFloorY = y0 + 38; // Plancher océanique sous la mer
    const baseOceanY = oceanFloorY + H100; // Base lithosphère océanique (100 km)
    const seaLevelY = y0 + 16; // Niveau de l'eau de mer

    // 2. ÉCARTEMENT GÉOMÉTRIQUE DES DEUX BLOCS CONTINENTAUX
    let halfSplit = 28 + P * (w * 0.27);
    const blockLeftX = xc - halfSplit;
    const blockRightX = xc + halfSplit;

    // 3. ASTHÉNOSPHÈRE CHAUDE EN BAS (Manteau ductile)
    // S'étend sous la base de 150 km des continents et remonte sous l'océan (100 km)
    // et jusqu'à la base axiale de la dorsale au centre !
    const mantleGrad = this.ctx.createLinearGradient(0, oceanFloorY, 0, h);
    mantleGrad.addColorStop(0, "#ea580c"); // Rouge-orangé très chaud
    mantleGrad.addColorStop(0.35, "#d9480f");
    mantleGrad.addColorStop(1, "#f59e0b"); // Jaune-doré en profondeur

    this.ctx.fillStyle = mantleGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(0, baseContY);
    this.ctx.lineTo(blockLeftX, baseContY);

    if (P > 0.08) {
      // Transition sous la marge continentale vers la lithosphère océanique
      const marginTransW = Math.min(60, halfSplit * 0.4);
      this.ctx.quadraticCurveTo(blockLeftX + marginTransW, baseOceanY, xc - halfSplit * 0.5, baseOceanY);
      // Dôme mantellique qui monte au centre sous la dorsale
      this.ctx.quadraticCurveTo(xc, oceanFloorY - 10, xc + halfSplit * 0.5, baseOceanY);
      this.ctx.quadraticCurveTo(blockRightX - marginTransW, baseOceanY, blockRightX, baseContY);
    } else {
      // Au stade 1 : amincissement central et bombement thermique
      this.ctx.quadraticCurveTo(xc, baseContY - 35, blockRightX, baseContY);
    }

    this.ctx.lineTo(w, baseContY);
    this.ctx.lineTo(w, h);
    this.ctx.lineTo(0, h);
    this.ctx.closePath();
    this.ctx.fill();

    // Écriture du mot "Manteau" / "Asthénosphère ductile" en bas à droite
    this.ctx.save();
    this.ctx.font = "italic 16px Georgia, serif";
    this.ctx.fillStyle = "#1e1e1e";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Manteau (Asthénosphère ductile)", w - 30, h - 22);
    this.ctx.restore();

    // Deux flèches de convection divergentes dans le manteau : ↶ ↷
    this.drawMantleCurvedDivergenceArrows(xc, h * 0.78);

    // 4. MANTEAU LITHOSPHÉRIQUE OCÉANIQUE RIGIDE (100 km avec la croûte)
    // S'épaissit de 0 km à la dorsale jusqu'à 100 km en s'éloignant
    if (P >= 0.22) {
      this.drawOceanicLithosphericMantle(xc, blockLeftX, blockRightX, oceanFloorY, baseOceanY, P, currentStage);
    }

    // 5. EAU DE MER (Apparaît et s'élargit avec l'océanisation)
    if (P > 0.08) {
      const waterAlpha = Math.min(1.0, (P - 0.08) * 4);
      const seaGrad = this.ctx.createLinearGradient(0, seaLevelY, 0, oceanFloorY + 30);
      seaGrad.addColorStop(0, `rgba(56, 189, 248, ${0.9 * waterAlpha})`);
      seaGrad.addColorStop(1, `rgba(2, 132, 199, ${0.95 * waterAlpha})`);

      this.ctx.fillStyle = seaGrad;
      const waterLeft = Math.max(0, blockLeftX - 10);
      const waterRight = Math.min(w, blockRightX + 10);
      this.ctx.fillRect(waterLeft, seaLevelY, waterRight - waterLeft, oceanFloorY + 30 - seaLevelY);

      // Ligne de surface de l'eau
      this.ctx.strokeStyle = `rgba(186, 230, 253, ${waterAlpha})`;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(waterLeft, seaLevelY);
      this.ctx.lineTo(waterRight, seaLevelY);
      this.ctx.stroke();
    }

    // 6. CROÛTE OCÉANIQUE BASALTIQUE & DORSALE (Stades 2 et 3)
    if (P >= 0.25) {
      const basaltSpread = (P - 0.25) * (halfSplit * 1.5);
      this.drawBasalticCrustAndRidge(xc, oceanFloorY, basaltSpread, currentStage, P);
    }

    // 7. SÉDIMENTS JAUNES BISEAUTÉS (Stades 2 et 3)
    if (P >= 0.35) {
      this.drawSedimentLayers(xc, blockLeftX, blockRightX, oceanFloorY, currentStage, P);
    }

    // 8. BLOCS CONTINENTAUX BASCULÉS (LITHOSPHÈRE CONTINENTALE 150 km)
    this.drawTiltedContinentalBlocks(blockLeftX, blockRightX, y0, baseContY, w, currentStage, P, kmScale);

    // 9. ÉCHELLE VERTICALE GRADUÉE (0 à 200 km) & COTES VISUELLES 150 km / 100 km
    this.drawMetricDepthsAndDimensionArrows(y0, kmScale, H150, H100, baseContY, baseOceanY, oceanFloorY, blockLeftX, blockRightX, xc, currentStage, P);

    // 10. ANNOTATIONS ET SCHÉMATISATIONS SELON LE STADE
    if (currentStage === 1) {
      this.drawStage1Annotations(xc, y0, blockLeftX, blockRightX);
    } else if (currentStage === 2) {
      this.drawStage2Annotations(xc, y0, blockLeftX, blockRightX);
    } else {
      this.drawStage3Annotations(xc, y0, blockLeftX, blockRightX, w);
    }
  }

  // Manteau lithosphérique océanique refroidi sous la croûte basaltique
  // Épaisseur = 100 km à maturité (rapport respecté)
  drawOceanicLithosphericMantle(xc, bLeftX, bRightX, floorY, baseOcY, P, stage) {
    this.ctx.save();
    this.ctx.fillStyle = "#2c3b2d"; // Vert sombre péridotite lithosphérique rigide
    this.ctx.strokeStyle = "#1a251b";
    this.ctx.lineWidth = 1.2;

    const spreadLeft = xc - bLeftX - 15;
    const spreadRight = bRightX - xc - 15;

    // Plaque lithosphérique océanique gauche (s'épaissit vers la gauche jusqu'à 100 km)
    if (spreadLeft > 15) {
      this.ctx.beginPath();
      this.ctx.moveTo(xc - 12, floorY + 12);
      this.ctx.lineTo(bLeftX + 5, floorY + 12);
      this.ctx.lineTo(bLeftX + 5, baseOcY);
      this.ctx.lineTo(xc - 12, floorY + 22);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    }

    // Plaque lithosphérique océanique droite (s'épaissit vers la droite jusqu'à 100 km)
    if (spreadRight > 15) {
      this.ctx.beginPath();
      this.ctx.moveTo(xc + 12, floorY + 12);
      this.ctx.lineTo(bRightX - 5, floorY + 12);
      this.ctx.lineTo(bRightX - 5, baseOcY);
      this.ctx.lineTo(xc + 12, floorY + 22);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // Blocs continentaux : Lithosphère continentale de 150 km d'épaisseur
  // Croûte marron au sommet (failles normales) + Manteau lithosphérique rigide dessous
  drawTiltedContinentalBlocks(bLeftX, bRightX, topY, baseY, totalW, stage, P, kmScale) {
    this.ctx.save();
    const crustH = Math.round(35 * kmScale); // Croûte continentale ~35 km

    // --- A. BLOC CONTINENTAL GAUCHE (150 km d'épaisseur) ---
    // 1. Manteau lithosphérique continental rigide (partie inférieure jusqu'à 150 km)
    this.ctx.fillStyle = "#4a1912"; // Brun foncé rigide
    this.ctx.strokeStyle = "#30100b";
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, topY + crustH);
    this.ctx.lineTo(bLeftX, topY + crustH);
    this.ctx.lineTo(bLeftX, baseY);
    this.ctx.lineTo(0, baseY);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 2. Croûte continentale supérieure (marron terreux du schéma avec blocs basculés)
    this.ctx.fillStyle = "#6d281e";
    this.ctx.strokeStyle = "#431811";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, topY + 40);
    this.ctx.lineTo(0, topY + crustH);
    this.ctx.lineTo(bLeftX, topY + crustH);

    // Pente de faille normale bordière
    this.ctx.lineTo(bLeftX, topY + 30);
    // Épaulement et blocs basculés en gradins
    this.ctx.lineTo(bLeftX - 35, topY);       // Crête de bloc 1
    this.ctx.lineTo(bLeftX - 45, topY + 22);  // Faille normale 1
    this.ctx.lineTo(bLeftX - 85, topY + 5);   // Crête de bloc 2
    this.ctx.lineTo(bLeftX - 95, topY + 24);  // Faille normale 2
    this.ctx.lineTo(bLeftX - 140, topY + 12); // Crête de bloc 3
    this.ctx.lineTo(0, topY + 40);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // --- B. BLOC CONTINENTAL DROIT (150 km d'épaisseur) ---
    // 1. Manteau lithosphérique continental rigide
    this.ctx.fillStyle = "#4a1912";
    this.ctx.strokeStyle = "#30100b";
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(bRightX, topY + crustH);
    this.ctx.lineTo(totalW, topY + crustH);
    this.ctx.lineTo(totalW, baseY);
    this.ctx.lineTo(bRightX, baseY);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 2. Croûte continentale supérieure (marron terreux du schéma avec blocs basculés)
    this.ctx.fillStyle = "#6d281e";
    this.ctx.strokeStyle = "#431811";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(totalW, topY + 40);
    this.ctx.lineTo(totalW, topY + crustH);
    this.ctx.lineTo(bRightX, topY + crustH);

    // Pente de faille normale bordière
    this.ctx.lineTo(bRightX, topY + 30);
    // Épaulement et blocs basculés en gradins
    this.ctx.lineTo(bRightX + 35, topY);       // Crête de bloc 1
    this.ctx.lineTo(bRightX + 45, topY + 22);  // Faille normale 1
    this.ctx.lineTo(bRightX + 85, topY + 5);   // Crête de bloc 2
    this.ctx.lineTo(bRightX + 95, topY + 24);  // Faille normale 2
    this.ctx.lineTo(bRightX + 140, topY + 12); // Crête de bloc 3
    this.ctx.lineTo(totalW, topY + 40);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Failles normales dessinées en traits sombres à l'intérieur de la croûte
    this.drawInternalFaultLine(bLeftX - 45, topY + 22, bLeftX - 25, topY + crustH + 20);
    this.drawInternalFaultLine(bLeftX - 95, topY + 24, bLeftX - 75, topY + crustH + 20);
    this.drawInternalFaultLine(bRightX + 45, topY + 22, bRightX + 25, topY + crustH + 20);
    this.drawInternalFaultLine(bRightX + 95, topY + 24, bRightX + 75, topY + crustH + 20);

    // Flèches d'extension horizontales dans la croûte (flèches noires)
    if (stage === 1) {
      this.drawHorizontalBlackArrow(bLeftX - 110, topY + 55, -45);
      this.drawHorizontalBlackArrow(bRightX + 110, topY + 55, 45);
    } else if (stage === 2) {
      this.drawHorizontalBlackArrow(bLeftX - 80, topY + 65, -40);
      this.drawHorizontalBlackArrow(bRightX + 80, topY + 65, 40);
    } else {
      this.drawHorizontalBlackArrow(bLeftX - 40, topY + 70, -35);
    }

    this.ctx.restore();
  }

  // Règle métrique verticale graduée (0 à 200 km) et Cotes graphiques 150 km et 100 km
  drawMetricDepthsAndDimensionArrows(y0, kmScale, H150, H100, baseContY, baseOceanY, oceanFloorY, bLeftX, bRightX, xc, stage, P) {
    this.ctx.save();

    // 1. RÈGLE MÉTRIQUE GRADUÉE À GAUCHE
    const scaleX = 42;
    const depths = [
      { km: 0, label: "0 km (Surface)", color: "#38bdf8" },
      { km: 50, label: "50 km", color: "#94a3b8" },
      { km: 100, label: "100 km (Litho. océanique)", color: "#38bdf8" },
      { km: 150, label: "150 km (Litho. continentale)", color: "#f87171" },
      { km: 200, label: "200 km (Asthénosphère)", color: "#fb923c" }
    ];

    // Fond discret translucide pour la règle
    this.ctx.fillStyle = "rgba(10, 16, 28, 0.85)";
    this.ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(scaleX - 32, y0 - 15, 145, 200 * kmScale + 30, 8);
    this.ctx.fill();
    this.ctx.stroke();

    // Axe vertical de la règle
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    this.ctx.moveTo(scaleX, y0);
    this.ctx.lineTo(scaleX, y0 + 200 * kmScale);
    this.ctx.stroke();

    depths.forEach((d) => {
      const curY = y0 + d.km * kmScale;
      this.ctx.strokeStyle = d.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(scaleX - 5, curY);
      this.ctx.lineTo(scaleX + 5, curY);
      this.ctx.stroke();

      this.ctx.fillStyle = d.color;
      this.ctx.font = (d.km === 100 || d.km === 150) ? "bold 10px monospace" : "9px monospace";
      this.ctx.textAlign = "left";
      this.ctx.fillText(d.label, scaleX + 9, curY + 3.5);
    });

    // Lignes repères horizontales en pointillés vers les profondeurs 100 km et 150 km
    this.ctx.setLineDash([3, 4]);
    this.ctx.lineWidth = 1.2;

    // Ligne 150 km (Base Lithosphère continentale)
    this.ctx.strokeStyle = "rgba(248, 113, 113, 0.55)";
    this.ctx.beginPath();
    this.ctx.moveTo(scaleX + 115, baseContY);
    this.ctx.lineTo(Math.max(scaleX + 120, bLeftX - 10), baseContY);
    this.ctx.stroke();

    // Ligne 100 km (Base Lithosphère océanique - Stades 2 & 3)
    if (stage >= 2) {
      this.ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
      this.ctx.beginPath();
      this.ctx.moveTo(scaleX + 115, baseOceanY);
      this.ctx.lineTo(Math.max(scaleX + 120, bLeftX + 20), baseOceanY);
      this.ctx.stroke();
    }
    this.ctx.setLineDash([]);

    // 2. FLÈCHE DE COTE SUR LA LITHOSPHÈRE CONTINENTALE (150 km)
    // Placée sur le bloc continental gauche
    const arrowContX = Math.max(scaleX + 130, bLeftX - 90);
    this.drawVerticalDimensionBracket(arrowContX, y0 + 35, baseContY, "Lithosphère continentale : 150 km", "#f87171", "#451a03");

    // 3. FLÈCHE DE COTE SUR LA LITHOSPHÈRE OCÉANIQUE (100 km)
    // Visible aux stades 2 et 3 au niveau du plancher océanique
    if (stage >= 2 && (bRightX - xc) > 75) {
      const arrowOceanX = xc + (bRightX - xc) * 0.48;
      this.drawVerticalDimensionBracket(arrowOceanX, oceanFloorY + 10, baseOceanY, "Lithosphère océanique : 100 km", "#38bdf8", "#0f291e");
    }

    this.ctx.restore();
  }

  // Trace une double flèche verticale de cote avec étiquette bien lisible
  drawVerticalDimensionBracket(x, yTop, yBottom, label, color, bgBadgeColor) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 1.8;

    // Traits d'arrêt horizontaux en haut et en bas
    this.ctx.beginPath();
    this.ctx.moveTo(x - 6, yTop);
    this.ctx.lineTo(x + 6, yTop);
    this.ctx.moveTo(x - 6, yBottom);
    this.ctx.lineTo(x + 6, yBottom);
    this.ctx.stroke();

    // Axe vertical double flèche
    this.ctx.beginPath();
    this.ctx.moveTo(x, yTop);
    this.ctx.lineTo(x, yBottom);
    this.ctx.stroke();

    // Flèche haut
    this.ctx.beginPath();
    this.ctx.moveTo(x, yTop);
    this.ctx.lineTo(x - 4, yTop + 7);
    this.ctx.lineTo(x + 4, yTop + 7);
    this.ctx.closePath();
    this.ctx.fill();

    // Flèche bas
    this.ctx.beginPath();
    this.ctx.moveTo(x, yBottom);
    this.ctx.lineTo(x - 4, yBottom - 7);
    this.ctx.lineTo(x + 4, yBottom - 7);
    this.ctx.closePath();
    this.ctx.fill();

    // Cartouche étiquette
    const midY = (yTop + yBottom) * 0.5;
    this.ctx.font = "bold 11px sans-serif";
    const textW = this.ctx.measureText(label).width;
    const badgeW = textW + 16;
    const badgeH = 22;

    this.ctx.fillStyle = bgBadgeColor;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.4;
    this.ctx.beginPath();
    this.ctx.roundRect(x - badgeW * 0.5, midY - badgeH * 0.5, badgeW, badgeH, 4);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(label, x, midY);

    this.ctx.restore();
  }

  drawInternalFaultLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = "rgba(40, 10, 5, 0.75)";
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  // Basaltes et dorsale océanique (colonnes prismatiques gris foncé au centre)
  drawBasalticCrustAndRidge(xc, baseY, spread, stage, P) {
    this.ctx.save();
    this.ctx.fillStyle = "#262626"; // Anthracite très sombre des basaltes
    this.ctx.strokeStyle = "#171717";
    this.ctx.lineWidth = 1.5;

    const ridgeH = (stage === 3) ? 55 : 35; // Plus haute au stade mature
    const ridgeTopY = baseY - ridgeH;

    // Tracé des colonnes / orgues basaltiques au centre
    this.ctx.beginPath();
    this.ctx.moveTo(xc - spread, baseY + 6);

    // Pente gauche de la dorsale
    const colCount = Math.min(24, Math.max(6, Math.floor(spread / 12)));
    for (let c = -colCount; c <= colCount; c++) {
      const bx = xc + (c / colCount) * spread;
      // Relief triangulaire culminant au centre avec encoche axiale
      const distRatio = 1 - Math.abs(c / colCount);
      let colTopY = baseY - distRatio * ridgeH;
      // Petite encoche pour le rift axial au centre exact
      if (Math.abs(c) <= 1 && stage === 3) colTopY += 8;

      this.ctx.lineTo(bx, colTopY);
    }

    this.ctx.lineTo(xc + spread, baseY + 6);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Tracé des prismes verticaux (colonnes de basalte)
    this.ctx.strokeStyle = "rgba(100, 116, 139, 0.45)";
    this.ctx.lineWidth = 1.2;
    for (let c = -colCount + 1; c < colCount; c++) {
      const bx = xc + (c / colCount) * spread;
      const distRatio = 1 - Math.abs(c / colCount);
      const topCol = baseY - distRatio * ridgeH;
      this.ctx.beginPath();
      this.ctx.moveTo(bx, topCol);
      this.ctx.lineTo(bx, baseY + 4);
      this.ctx.stroke();
    }

    // Magma liquide à l'axe de la dorsale (volcanisme effusif sous l'eau de mer)
    const riftTopY = baseY - ridgeH + (stage === 3 ? 8 : 0);
    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.arc(xc, riftTopY + 3, 4.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Petites gouttelettes / pillow-lavas en formation
    const bubblePhase = (this.time * 5) % 1;
    this.ctx.fillStyle = "rgba(251, 146, 60, 0.85)";
    this.ctx.beginPath();
    this.ctx.arc(xc - 3.5, riftTopY - bubblePhase * 10, 2, 0, Math.PI * 2);
    this.ctx.arc(xc + 3.5, riftTopY - ((bubblePhase + 0.5) % 1) * 10, 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  // Sédiments jaunes biseautés (nuls à la dorsale, épais vers les marges passives)
  drawSedimentLayers(xc, bLeftX, bRightX, baseY, stage, P) {
    this.ctx.save();
    this.ctx.fillStyle = "#fde047"; // Jaune sable vif du schéma
    this.ctx.strokeStyle = "#eab308";
    this.ctx.lineWidth = 1.2;

    const sedThick = (stage === 3) ? 26 : 14;

    // Sédiments côté gauche
    const leftSedW = Math.max(10, (xc - bLeftX) * 0.55);
    this.ctx.beginPath();
    this.ctx.moveTo(bLeftX + 5, baseY - 4);
    this.ctx.lineTo(bLeftX + 5, baseY - 4 - sedThick);
    this.ctx.lineTo(xc - 30, baseY - 4); // S'amincit en biseau vers la dorsale
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Sédiments côté droit
    this.ctx.beginPath();
    this.ctx.moveTo(bRightX - 5, baseY - 4);
    this.ctx.lineTo(bRightX - 5, baseY - 4 - sedThick);
    this.ctx.lineTo(xc + 30, baseY - 4); // S'amincit en biseau vers la dorsale
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.restore();
  }

  // Flèches courbes divergentes dans le manteau (↶ ↷)
  drawMantleCurvedDivergenceArrows(xc, y) {
    this.ctx.save();
    this.ctx.strokeStyle = "#000000";
    this.ctx.fillStyle = "#000000";
    this.ctx.lineWidth = 2.5;

    // Flèche courbe gauche : monte puis tourne vers la gauche
    this.ctx.beginPath();
    this.ctx.moveTo(xc - 4, y + 18);
    this.ctx.quadraticCurveTo(xc - 8, y, xc - 36, y);
    this.ctx.stroke();

    // Pointe gauche
    this.ctx.beginPath();
    this.ctx.moveTo(xc - 38, y);
    this.ctx.lineTo(xc - 28, y - 5);
    this.ctx.lineTo(xc - 28, y + 5);
    this.ctx.closePath();
    this.ctx.fill();

    // Flèche courbe droite : monte puis tourne vers la droite
    this.ctx.beginPath();
    this.ctx.moveTo(xc + 4, y + 18);
    this.ctx.quadraticCurveTo(xc + 8, y, xc + 36, y);
    this.ctx.stroke();

    // Pointe droite
    this.ctx.beginPath();
    this.ctx.moveTo(xc + 38, y);
    this.ctx.lineTo(xc + 28, y - 5);
    this.ctx.lineTo(xc + 28, y + 5);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  drawHorizontalBlackArrow(x, y, len) {
    this.ctx.save();
    this.ctx.strokeStyle = "#000000";
    this.ctx.fillStyle = "#000000";
    this.ctx.lineWidth = 2.5;

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

  // Annotations exactes du Stade 1 (Rifting continental)
  drawStage1Annotations(xc, topY, bLeftX, bRightX) {
    this.ctx.save();
    this.ctx.font = "14px Georgia, serif";

    // 1. Bombement topographique (courbe en pointillés au sommet)
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    this.ctx.setLineDash([4, 4]);
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    this.ctx.moveTo(bLeftX - 35, topY);
    this.ctx.quadraticCurveTo(xc, topY - 26, bRightX + 35, topY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Bombement topographique", xc, topY - 32);

    // 2. Épaulements
    this.ctx.fillStyle = "#1e1e1e";
    this.ctx.fillText("Épaulement", bLeftX - 35, topY + 16);
    this.ctx.fillText("Épaulement", bRightX + 35, topY + 16);

    // 3. Subsidence tectonique et thermique
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText("Subsidence", xc, topY + 48);
    this.ctx.fillText("tectonique et thermique", xc, topY + 66);

    this.ctx.restore();
  }

  // Annotations exactes du Stade 2 (Stade jeune océan)
  drawStage2Annotations(xc, topY, bLeftX, bRightX) {
    this.ctx.save();
    this.ctx.font = "bold 15px Georgia, serif";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";

    // Mot "Basaltes" sur les blocs basaltiques au centre
    this.ctx.fillText("Basaltes", xc, topY + 95);

    this.ctx.restore();
  }

  // Annotations exactes du Stade 3 (Stade océan mature)
  drawStage3Annotations(xc, topY, bLeftX, bRightX, totalW) {
    this.ctx.save();
    this.ctx.font = "15px Georgia, serif";

    // 1. "Dorsale océanique" avec flèche rouge
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Dorsale océanique", xc - 30, topY + 20);
    this.drawRedPointerArrow(xc - 25, topY + 23, xc - 4, topY + 48);

    // 2. "Sédiments" avec flèche rouge
    this.ctx.textAlign = "left";
    this.ctx.fillText("Sédiments", xc + 75, topY + 24);
    this.drawRedPointerArrow(xc + 72, topY + 27, xc + 52, topY + 54);

    // 3. "Croûte" sur le continent droit
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Croûte", bRightX + 50, topY + 70);

    this.ctx.restore();
  }

  drawRedPointerArrow(x1, y1, x2, y2) {
    this.ctx.save();
    this.ctx.strokeStyle = "#dc2626"; // Rouge vif
    this.ctx.fillStyle = "#dc2626";
    this.ctx.lineWidth = 1.8;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Pointe
    const angle = Math.atan2(y2 - y1, x2 - x1);
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(x2 - Math.cos(angle - 0.4) * 8, y2 - Math.sin(angle - 0.4) * 8);
    this.ctx.lineTo(x2 - Math.cos(angle + 0.4) * 8, y2 - Math.sin(angle + 0.4) * 8);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  // Tracé d'une strate de la croûte épousant le profil topographique du rift
  drawCrustLayer(xc, riftHalfW, creteDist, yCrete, yRift, thickness, w, h) {
    this.ctx.beginPath();
    // Bord gauche
    this.ctx.moveTo(0, yCrete + 40);
    this.ctx.lineTo(xc - creteDist, yCrete); // Crête gauche
    this.ctx.lineTo(xc - riftHalfW, yRift);  // Fond gauche du rift
    this.ctx.lineTo(xc + riftHalfW, yRift);  // Fond droit du rift
    this.ctx.lineTo(xc + creteDist, yCrete); // Crête droite
    this.ctx.lineTo(w, yCrete + 40);         // Bord droit

    // Épaisseur de la strate
    this.ctx.lineTo(w, yCrete + 40 + thickness);
    this.ctx.lineTo(xc + creteDist, yCrete + thickness);
    this.ctx.lineTo(xc + riftHalfW, yRift + thickness);
    this.ctx.lineTo(xc - riftHalfW, yRift + thickness);
    this.ctx.lineTo(xc - creteDist, yCrete + thickness);
    this.ctx.lineTo(0, yCrete + 40 + thickness);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  // Textures des coussins de basalte (Pillow-lavas) qui défilent symétriquement
  drawPillowLavaSurface(xc, riftHalfW, creteDist, yCrete, yRift, w, drift) {
    this.ctx.save();
    this.ctx.fillStyle = "#1e293b";
    this.ctx.strokeStyle = "#475569";
    this.ctx.lineWidth = 1.2;

    // Coussins à gauche (s'écartent vers la gauche)
    for (let x = xc - 20; x > 0; x -= 22) {
      const movedX = x - (drift % 22);
      const y = this.getTopoY(movedX, xc, riftHalfW, creteDist, yCrete, yRift) + 8;
      this.ctx.beginPath();
      this.ctx.ellipse(movedX, y, 10, 6, -0.1, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    }

    // Coussins à droite (s'écartent vers la droite)
    for (let x = xc + 20; x < w; x += 22) {
      const movedX = x + (drift % 22);
      const y = this.getTopoY(movedX, xc, riftHalfW, creteDist, yCrete, yRift) + 8;
      this.ctx.beginPath();
      this.ctx.ellipse(movedX, y, 10, 6, 0.1, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // Texture des filons verticaux de basalte (complexe filonien)
  drawDykeSheetTexture(xc, startY, thick, w, drift) {
    this.ctx.save();
    this.ctx.strokeStyle = "rgba(71, 85, 105, 0.7)";
    this.ctx.lineWidth = 2;

    // Filons côté gauche
    for (let x = xc - 15; x > 0; x -= 14) {
      const mx = x - (drift % 14);
      this.ctx.beginPath();
      this.ctx.moveTo(mx, startY + 2);
      this.ctx.lineTo(mx, startY + thick - 2);
      this.ctx.stroke();
    }

    // Filons côté droit
    for (let x = xc + 15; x < w; x += 14) {
      const mx = x + (drift % 14);
      this.ctx.beginPath();
      this.ctx.moveTo(mx, startY + 2);
      this.ctx.lineTo(mx, startY + thick - 2);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // Texture grenue des gabbros (refroidissement lent en profondeur)
  drawGabbroTexture(xc, startY, thick, w, drift) {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(74, 222, 128, 0.25)";
    for (let i = 0; i < 40; i++) {
      const gx1 = (i * 24 - drift) % (w * 0.45);
      const gy1 = startY + (i * 17) % (thick - 10);
      if (gx1 > 10) this.ctx.fillRect(xc - gx1, gy1, 4, 3);

      const gx2 = (i * 24 + drift) % (w * 0.45);
      const gy2 = startY + (i * 19) % (thick - 10);
      this.ctx.fillRect(xc + gx2, gy2, 4, 3);
    }
    this.ctx.restore();
  }

  // Manteau lithosphérique rigide sous la croûte qui s'épaissit en s'éloignant
  drawLithosphericMantleWedge(xc, crustBaseY, w, h) {
    this.ctx.save();
    this.ctx.fillStyle = "#1e3a2b";
    this.ctx.strokeStyle = "#14281e";
    this.ctx.lineWidth = 1.5;

    // Côté gauche
    this.ctx.beginPath();
    this.ctx.moveTo(xc - 75, crustBaseY);
    this.ctx.lineTo(0, crustBaseY);
    this.ctx.lineTo(0, h * 0.58);
    this.ctx.lineTo(xc - 110, crustBaseY + 20);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Côté droit
    this.ctx.beginPath();
    this.ctx.moveTo(xc + 75, crustBaseY);
    this.ctx.lineTo(w, crustBaseY);
    this.ctx.lineTo(w, h * 0.58);
    this.ctx.lineTo(xc + 110, crustBaseY + 20);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
  }

  // Tracé des failles normales le long desquelles les blocs s'affaissent
  drawNormalFaultsSystem(xc, riftHalfW, creteDist, yCrete, yRift) {
    this.ctx.save();
    this.ctx.strokeStyle = "#f87171";
    this.ctx.lineWidth = 2.5;

    // Faille normale principale bordière GAUCHE (inclinée vers l'axe à 60°)
    const f1X1 = xc - creteDist + 40;
    const f1Y1 = yCrete;
    const f1X2 = xc - riftHalfW + 10;
    const f1Y2 = yRift + 60;
    this.drawFaultWithHachures(f1X1, f1Y1, f1X2, f1Y2, -1);

    // Faille normale principale bordière DROITE (inclinée vers l'axe à 60°)
    const f2X1 = xc + creteDist - 40;
    const f2Y1 = yCrete;
    const f2X2 = xc + riftHalfW - 10;
    const f2Y2 = yRift + 60;
    this.drawFaultWithHachures(f2X1, f2Y1, f2X2, f2Y2, 1);

    // Flèches d'affaissement du compartiment affaissé (bloc central du rift)
    this.drawSlipArrow(xc - 105, yRift - 5, 1, 1);
    this.drawSlipArrow(xc + 105, yRift - 5, -1, 1);

    this.ctx.restore();
  }

  drawFaultWithHachures(x1, y1, x2, y2, dir) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Tirets de faille normale (barbules indiquant le compartiment affaissé)
    const steps = 6;
    for (let i = 1; i < steps; i++) {
      const fx = x1 + (x2 - x1) * (i / steps);
      const fy = y1 + (y2 - y1) * (i / steps);
      this.ctx.beginPath();
      this.ctx.moveTo(fx, fy);
      this.ctx.lineTo(fx + dir * 8, fy + 4);
      this.ctx.stroke();
    }
  }

  drawSlipArrow(x, y, dx, dy) {
    this.ctx.fillStyle = "#f87171";
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + dx * 10, y + dy * 18);
    this.ctx.lineTo(x + dx * 18, y + dy * 14);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Fumeur noir hydrothermal crachant des volutes minéralisées à 350°C
  drawBlackSmoker(x, y, dir) {
    // Cheminée minérale de sulfures
    this.ctx.fillStyle = "#334155";
    this.ctx.strokeStyle = "#0f172a";
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(x - 5, y);
    this.ctx.lineTo(x - 3, y - 16);
    this.ctx.lineTo(x + 3, y - 16);
    this.ctx.lineTo(x + 5, y);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Panache noir de fluides chauds montant dans l'eau
    this.ctx.fillStyle = "rgba(30, 41, 59, 0.75)";
    for (let s = 0; s < 6; s++) {
      const py = y - 18 - s * 8 - ((this.time * 25 + s * 10) % 35);
      const px = x + dir * (s * 3) + Math.sin(this.time * 4 + s) * 4;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 4 + s * 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Calcul d'altitude topographique sur le profil de la dorsale
  getTopoY(x, xc, riftHalfW, creteDist, yCrete, yRift) {
    const dist = Math.abs(x - xc);
    if (dist < riftHalfW) return yRift;
    if (dist < creteDist) {
      const f = (dist - riftHalfW) / (creteDist - riftHalfW);
      return yRift - f * (yRift - yCrete);
    }
    return yCrete + ((dist - creteDist) / 300) * 40;
  }

  // Flèches de divergence symétrique animées
  drawDivergenceVectors(xc, y, w) {
    this.ctx.save();
    const arrowLen = 50;

    // Flèche gauche
    this.drawBigArrow(xc - 110, y, -arrowLen, "⟵ Divergence (~2,5 cm/an)");

    // Flèche droite
    this.drawBigArrow(xc + 110, y, arrowLen, "Divergence (~2,5 cm/an) ⟶");
    this.ctx.restore();
  }

  drawBigArrow(x, y, len, label) {
    this.ctx.strokeStyle = "#38bdf8";
    this.ctx.lineWidth = 3.5;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + len, y);
    this.ctx.stroke();

    const dir = len > 0 ? 1 : -1;
    this.ctx.fillStyle = "#38bdf8";
    this.ctx.beginPath();
    this.ctx.moveTo(x + len + dir * 6, y);
    this.ctx.lineTo(x + len - dir * 4, y - 6);
    this.ctx.lineTo(x + len - dir * 4, y + 6);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "bold 10px sans-serif";
    this.ctx.textAlign = dir > 0 ? "left" : "right";
    this.ctx.fillText(label, x + (dir > 0 ? 12 : -12), y - 10);
  }

  // Badges d'âge de la croûte océanique
  drawCrustAgeBadges(xc, y, w) {
    this.ctx.save();
    this.ctx.font = "bold 9px monospace";
    this.ctx.fillStyle = "#94a3b8";

    // Axe : 0 Ma
    this.ctx.fillText("0 Ma (Actuel)", xc - 30, y);

    // 1 Ma
    this.ctx.fillText("~1 Ma", xc - 180, y);
    this.ctx.fillText("~1 Ma", xc + 150, y);

    // 2 Ma
    this.ctx.fillText("~2 Ma", xc - 320, y);
    this.ctx.fillText("~2 Ma", xc + 280, y);
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
