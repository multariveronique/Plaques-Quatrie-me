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
    title: "Zoom 1 : Étirement Continental, Dorsale & Création de Lithosphère Océanique",
    text: "Sous l'effet du panache chaud ascendant, la lithosphère continentale (150 km) s'étire et s'affine jusqu'à rupture. L'océan s'installe. À la dorsale (lieu d'évacuation de la chaleur), le magma liquide fluide s'épanche sous l'eau et forme en continu la lithosphère océanique (100 km) qui s'agrandit.",
    indicators: [
      "Litho. continentale : 150 km (s'étire)",
      "Litho. océanique : 100 km (se crée)",
      "Dorsale : volcanisme effusif liquide",
      "Écartement : divergence ~2 à 5 cm/an"
    ],
    speedText: "Divergence : ~3 cm/an"
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

    // Timeline continue pour le Zoom 1 (Divergence de 0 à 60 Ma)
    this.divergenceTime = 0; // en millions d'années (0 à 60)
    this.divergenceDuration = 60; // 60 Ma

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

    // Slider temporel de la divergence (Zoom 1)
    const slider = document.getElementById("divergenceSlider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.divergenceTime = parseFloat(e.target.value);
        this.updateTimelineUI();
      });
    }

    // Clics sur les phases temporelles du Zoom 1
    document.querySelectorAll(".phase-mark").forEach((mark) => {
      mark.addEventListener("click", () => {
        const targetTime = parseFloat(mark.dataset.time);
        this.divergenceTime = targetTime;
        if (slider) slider.value = targetTime;
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

        const cx = this.width * 0.5;
        const cy = this.height * 0.88;
        const R = Math.min(this.width * 0.44, this.height * 0.70);

        // Sommet (Dorsale / Zoom 1)
        const dorsaleX = cx;
        const dorsaleY = cy - R;
        if (Math.hypot(mx - dorsaleX, my - (dorsaleY + 20)) < 70) {
          this.switchView("divergence");
          return;
        }

        // Flanc Droit (Subduction / Zoom 2)
        const subX = cx + Math.cos(-Math.PI * 0.22) * R;
        const subY = cy + Math.sin(-Math.PI * 0.22) * R;
        if (Math.hypot(mx - subX, my - subY) < 70) {
          this.switchView("subduction");
          return;
        }

        // Flanc Gauche (Séismes / Zoom 3)
        const seisX = cx + Math.cos(-Math.PI * 0.78) * R;
        const seisY = cy + Math.sin(-Math.PI * 0.78) * R;
        if (Math.hypot(mx - seisX, my - seisY) < 70) {
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
      this.divergenceTime = 0;
      const slider = document.getElementById("divergenceSlider");
      if (slider) slider.value = 0;
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
      const t = Math.floor(this.divergenceTime);
      const dist = Math.floor(this.divergenceTime * 25);
      valSpan.textContent = `Temps : ${t} Ma | Écartement : ${dist} km`;
    }

    // Mise à jour visuelle des phases
    document.querySelectorAll(".phase-mark").forEach((mark) => {
      const markTime = parseFloat(mark.dataset.time);
      const isActive = (this.divergenceTime >= markTime && this.divergenceTime < markTime + 20) || (markTime === 55 && this.divergenceTime >= 45);
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

      // Progression continue du Zoom 1 (Divergence 0 à 60 Ma)
      if (this.currentView === "divergence") {
        this.divergenceTime += 0.045 * this.speed;
        if (this.divergenceTime > this.divergenceDuration) {
          this.divergenceTime = 0; // boucle continue
        }
        const slider = document.getElementById("divergenceSlider");
        if (slider) slider.value = this.divergenceTime;
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

    const cx = w * 0.5;
    const cy = h * 0.88;
    const R = Math.min(w * 0.44, h * 0.70);

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

    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, Math.PI, 0, false);
    this.ctx.arc(cx, cy, rBase, 0, Math.PI, true);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = "#1e4d6b";
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, -Math.PI * 0.65, -Math.PI * 0.25, false);
    this.ctx.arc(cx, cy, R - lithoThickness * 0.66, -Math.PI * 0.25, -Math.PI * 0.65, true);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = "rgba(14, 116, 144, 0.7)";
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R, -Math.PI * 0.65, -Math.PI * 0.25, false);
    this.ctx.arc(cx, cy, R - 5, -Math.PI * 0.25, -Math.PI * 0.65, true);
    this.ctx.closePath();
    this.ctx.fill();

    const dorsaleAngle = -Math.PI * 0.5;
    const dx = cx + Math.cos(dorsaleAngle) * R;
    const dy = cy + Math.sin(dorsaleAngle) * R;

    this.ctx.fillStyle = "#ef4444";
    this.ctx.beginPath();
    this.ctx.arc(dx, dy + 2, 6, 0, Math.PI * 2);
    this.ctx.fill();

    const subAngle = -Math.PI * 0.25;
    const sx = cx + Math.cos(subAngle) * R;
    const sy = cy + Math.sin(subAngle) * R;

    this.ctx.strokeStyle = "#1e3a5f";
    this.ctx.lineWidth = lithoThickness * 0.66;
    this.ctx.beginPath();
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(sx - Math.cos(subAngle) * 45, sy - Math.sin(subAngle) * 45 + 30);
    this.ctx.stroke();
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
    const z1X = cx;
    const z1Y = cy - R - 24;
    this.drawInteractivePill(z1X, z1Y, "🔍 ZOOM 1 : DORSALE (Remontée)", "#ef4444", true);

    const subAngle = -Math.PI * 0.25;
    const z2X = cx + Math.cos(subAngle) * (R + 32);
    const z2Y = cy + Math.sin(subAngle) * (R + 32);
    this.drawInteractivePill(z2X, z2Y, "🔍 ZOOM 2 : SUBDUCTION (Descente)", "#0284c7", false);

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

  drawHemiLabels(cx, cy, R, rNoyau, rGraine) {
    this.drawBadge(cx, cy - rNoyau * 0.45, "NOYAU TERRESTRE (Très chaud)", "Source de chaleur : 2900 à 6371 km", "#facc15", true);
    this.drawBadge(cx, cy - (rNoyau + R) * 0.5, "COURANT CHAUD ASCENDANT", "Matière moins dense qui monte dans l'asthénosphère", "#f97316", true);
    this.drawBadge(cx, cy - R + 14, "FLUX BLOQUÉ PAR LA LITHOSPHÈRE RIGIDE", "La roche rigide dévie le flux horizontalement", "#38bdf8", true);

    const descX = cx + Math.cos(-Math.PI * 0.38) * ((rNoyau + R) * 0.5);
    const descY = cy + Math.sin(-Math.PI * 0.38) * ((rNoyau + R) * 0.5);
    this.drawBadge(descX, descY, "COURANT DESCENDANT", "Matière refroidie et dense qui plonge", "#38bdf8", true);
  }

  // =========================================================================
  // VUE 2 : ZOOM 1 - ÉTIREMENT CONTINU DE LA LITHOSPHÈRE CONTINENTALE (150 KM)
  // CRÉATION CONTINUE DE LA LITHOSPHÈRE OCÉANIQUE (100 KM) À LA DORSALE
  // ÉVACUATION DE CHALEUR INTERNE & VOLCANISME EFFUSIF SOUS-MARIN (QUELQUES CM/AN)
  // =========================================================================
  renderDivergenceContinuousView() {
    const w = this.width;
    const h = this.height;

    // Ciel
    this.ctx.fillStyle = "#0c1527";
    this.ctx.fillRect(0, 0, w, h * 0.28);

    const surfaceY = h * 0.28;
    const litho150H = h * 0.32; // Lithosphère continentale : 150 km
    const litho100H = litho150H * (100 / 150); // Lithosphère océanique : 100 km
    const lithoBottom = surfaceY + litho150H;
    const asthBottom = h;

    // 1. Asthénosphère sous-jacente (chaude, ductile)
    const asthGrad = this.ctx.createLinearGradient(0, lithoBottom, 0, asthBottom);
    asthGrad.addColorStop(0, "#c2410c");
    asthGrad.addColorStop(1, "#ea580c");
    this.ctx.fillStyle = asthGrad;
    this.ctx.fillRect(0, lithoBottom, w, asthBottom - lithoBottom);

    const centerX = w * 0.5;

    // Panache ascendant chaud au centre (évacuation de la chaleur interne)
    const plumeGrad = this.ctx.createRadialGradient(centerX, asthBottom, 20, centerX, lithoBottom, w * 0.25);
    plumeGrad.addColorStop(0, "rgba(254, 240, 138, 0.75)");
    plumeGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.4)");
    plumeGrad.addColorStop(1, "rgba(194, 65, 12, 0)");
    this.ctx.fillStyle = plumeGrad;
    this.ctx.fillRect(0, lithoBottom, w, asthBottom - lithoBottom);

    // Flèches d'ascension thermique dans le manteau
    this.drawAscendingArrows(centerX, lithoBottom, asthBottom);

    // PROGRESSION TEMPORELLE CONTINUE (t entre 0 et 60 Ma)
    const t = this.divergenceTime;

    // Calcul de l'écartement des blocs continentaux en fonction du temps
    // t < 15 Ma : continent continu qui s'amincit
    // t 15 à 30 Ma : séparation progressive (0 à 80 px)
    // t > 30 Ma : expansion océanique continue (80 à 280 px)
    let halfSplit = 0;
    let centralThicknessFrac = 1.0; // 1.0 = 150 km, s'amincit vers 0.2
    let seaLevelDrop = 0; // effondrement du rift

    if (t < 15) {
      // Phase 1 : Bombement et étirement / amincissement central
      const p = t / 15;
      centralThicknessFrac = 1.0 - p * 0.45; // passe de 150 km à ~80 km
      seaLevelDrop = p * 14;
      halfSplit = p * 15;
    } else if (t < 30) {
      // Phase 2 : Rupture, effondrement et inondation
      const p = (t - 15) / 15;
      centralThicknessFrac = 0.55 - p * 0.45; // passe à 0.1 (rupture)
      seaLevelDrop = 14 + p * 18;
      halfSplit = 15 + p * 75;
    } else {
      // Phase 3 : Expansion océanique mature (divergence continue de quelques cm/an)
      const p = (t - 30) / 30;
      centralThicknessFrac = 0;
      seaLevelDrop = 32;
      halfSplit = 90 + p * (w * 0.32); // les blocs s'éloignent de plus en plus
    }

    const blockLeftX = centerX - halfSplit;
    const blockRightX = centerX + halfSplit;

    // 2. EAU DE MER (inondation progressive du rift à partir de t > 18 Ma)
    if (t > 15) {
      const seaAlpha = Math.min(1.0, (t - 15) / 10);
      const seaGrad = this.ctx.createLinearGradient(0, surfaceY, 0, surfaceY + h * 0.14);
      seaGrad.addColorStop(0, `rgba(3, 105, 161, ${0.85 * seaAlpha})`);
      seaGrad.addColorStop(1, `rgba(12, 74, 110, ${0.95 * seaAlpha})`);
      this.ctx.fillStyle = seaGrad;

      const waterLeft = Math.max(0, blockLeftX + 30);
      const waterRight = Math.min(w, blockRightX - 30);
      if (waterRight > waterLeft) {
        this.ctx.fillRect(waterLeft, surfaceY, waterRight - waterLeft, h * 0.14);

        // Vagues animées
        this.ctx.strokeStyle = `rgba(56, 189, 248, ${seaAlpha})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let x = waterLeft; x <= waterRight; x += 12) {
          const y = surfaceY + Math.sin(x * 0.08 + this.time * 3) * 2;
          if (x === waterLeft) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
      }
    }

    // 3. BLOC CONTINENTAL GAUCHE (150 km) - s'éloigne vers la gauche
    this.ctx.fillStyle = "#8b5e3c";
    this.ctx.strokeStyle = "#53341b";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, surfaceY);
    this.ctx.lineTo(blockLeftX, surfaceY + seaLevelDrop);
    // Pente de faille normale inclinée vers le centre
    this.ctx.lineTo(blockLeftX + 45, lithoBottom);
    this.ctx.lineTo(0, lithoBottom);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 4. BLOC CONTINENTAL DROIT (150 km) - s'éloigne vers la droite
    this.ctx.beginPath();
    this.ctx.moveTo(blockRightX, surfaceY + seaLevelDrop);
    this.ctx.lineTo(w, surfaceY);
    this.ctx.lineTo(w, lithoBottom);
    this.ctx.lineTo(blockRightX - 45, lithoBottom);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Failles normales d'étirement (lignes pointillées rouges)
    if (t < 35) {
      this.drawFaultLine(blockLeftX - 35, surfaceY, blockLeftX + 10, lithoBottom);
      this.drawFaultLine(blockRightX + 35, surfaceY, blockRightX - 10, lithoBottom);
    }

    // Pont continental aminci au centre si t < 25 Ma (montre l'amincissement de la lithosphère)
    if (centralThicknessFrac > 0.05) {
      const curCentralH = litho150H * centralThicknessFrac;
      this.ctx.fillStyle = "#a26e47";
      this.ctx.beginPath();
      this.ctx.moveTo(blockLeftX, surfaceY + seaLevelDrop);
      this.ctx.lineTo(centerX, surfaceY + seaLevelDrop + 10);
      this.ctx.lineTo(blockRightX, surfaceY + seaLevelDrop);
      this.ctx.lineTo(blockRightX - 20, lithoBottom - (litho150H - curCentralH));
      this.ctx.lineTo(centerX, lithoBottom - (litho150H - curCentralH));
      this.ctx.lineTo(blockLeftX + 20, lithoBottom - (litho150H - curCentralH));
      this.ctx.closePath();
      this.ctx.fill();
    }

    // 5. CRÉATION CONTINUE DE LA LITHOSPHÈRE OCÉANIQUE (100 KM) AU NIVEAU DE LA DORSALE
    if (t > 25) {
      const oceBottom = surfaceY + litho100H; // Exactement 100 km à l'échelle

      // Plancher océanique qui grandit entre les deux blocs continentaux
      const oceLeft = blockLeftX + 35;
      const oceRight = blockRightX - 35;

      if (oceRight > oceLeft) {
        this.ctx.fillStyle = "#1e4d6b";
        this.ctx.strokeStyle = "#0f2d42";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(oceLeft, surfaceY + h * 0.12);
        // Crête de la dorsale océanique au centre
        this.ctx.lineTo(centerX - 14, surfaceY + h * 0.065);
        this.ctx.lineTo(centerX + 14, surfaceY + h * 0.065);
        this.ctx.lineTo(oceRight, surfaceY + h * 0.12);
        this.ctx.lineTo(oceRight - 8, oceBottom);
        this.ctx.lineTo(centerX, oceBottom + 10);
        this.ctx.lineTo(oceLeft + 8, oceBottom);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Chambre magmatique liquide sous la dorsale
        this.ctx.fillStyle = "#ef4444";
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, oceBottom - 8, 28, 14, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Volcanisme effusif actif à l'axe de la dorsale (lieu d'évacuation de la chaleur)
        this.ctx.fillStyle = "#f97316";
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 8, surfaceY + h * 0.065);
        this.ctx.lineTo(centerX + 8, surfaceY + h * 0.065);
        this.ctx.lineTo(centerX + 26, surfaceY + h * 0.095);
        this.ctx.lineTo(centerX - 26, surfaceY + h * 0.095);
        this.ctx.closePath();
        this.ctx.fill();

        // Coussins de basalte (pillow lavas)
        this.drawPillowLavas(centerX, surfaceY + h * 0.065);

        // Flèches d'écartement océanique (divergence continue)
        this.drawMotionArrow(centerX - 70, surfaceY + h * 0.11, -1, "Divergence");
        this.drawMotionArrow(centerX + 70, surfaceY + h * 0.11, 1, "Divergence");
      }
    }

    // Flèches de divergence sur les blocs continentaux
    this.drawMotionArrow(blockLeftX - 70, surfaceY + 40, -1, "Bloc 1 s'éloigne");
    this.drawMotionArrow(blockRightX + 70, surfaceY + 40, 1, "Bloc 2 s'éloigne");

    // Échelle métrique en profondeur
    if (this.showGrid) {
      this.drawZoomMetricScale(surfaceY, litho150H, 150);
    }

    // Légendes dynamiques explicatives
    if (this.showLabels) {
      this.drawBadge(blockLeftX * 0.5, surfaceY + 22, "BLOC CONTINENTAL 1", "Lithosphère continentale ~150 km", "#8b5e3c");
      this.drawBadge(blockRightX + (w - blockRightX) * 0.5, surfaceY + 22, "BLOC CONTINENTAL 2", "Lithosphère continentale ~150 km", "#8b5e3c");

      if (t < 15) {
        this.drawBadge(centerX, surfaceY - 25, "1. ÉTIREMENT & AMINCISSEMENT", "Le continent de 150 km s'affine sous la chaleur", "#ef4444", true);
      } else if (t < 30) {
        this.drawBadge(centerX, surfaceY - 25, "2. RUPTURE & ENTRÉE DE LA MER", "Fossé d'effondrement inondé par l'eau de mer", "#0284c7", true);
      } else {
        this.drawBadge(centerX, surfaceY - 30, "DORSALE OCÉANIQUE (Évacuation de chaleur)", "Volcanisme effusif sous-marin (magma liquide fluide)", "#ef4444", true);
        this.drawBadge(centerX, surfaceY + h * 0.14, "LITHOSPHÈRE OCÉANIQUE NÉOFORMÉE", "Épaisseur : 100 km (s'agrandit en continu)", "#1e4d6b", true);
      }

      this.drawBadge(centerX, asthBottom - 25, "ASTHÉNOSPHÈRE MOINS RIGIDE (Ductile)", "Courant ascendant chaud : matière moins dense monte", "#ea580c", true);
    }
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

// Initialisation dès que le DOM est prêt
window.addEventListener("DOMContentLoaded", () => {
  window.sim = new TectoniqueSimulation();
});
