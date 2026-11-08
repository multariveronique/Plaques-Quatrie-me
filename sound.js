// sound.js - Synthèse audio Web Audio API (100% autonome, sans fichier externe)
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.enabled = false;
    this.convectionGain = null;
    this.convectionOsc = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    if (!this.enabled) {
      this.init();
      this.enabled = true;
      this.startAmbient();
      return true;
    } else {
      this.enabled = false;
      this.stopAmbient();
      return false;
    }
  }

  startAmbient() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      if (this.convectionOsc) return;
      this.convectionOsc = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      this.convectionGain = this.audioCtx.createGain();

      this.convectionOsc.type = 'sine';
      this.convectionOsc.frequency.setValueAtTime(55, this.audioCtx.currentTime); // Basse fréquence sourde

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.audioCtx.currentTime);

      this.convectionGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

      this.convectionOsc.connect(filter);
      filter.connect(this.convectionGain);
      this.convectionGain.connect(this.audioCtx.destination);

      this.convectionOsc.start();
    } catch (e) {
      console.warn("Audio ambient not allowed yet", e);
    }
  }

  stopAmbient() {
    if (this.convectionOsc) {
      try {
        this.convectionOsc.stop();
        this.convectionOsc.disconnect();
      } catch (e) {}
      this.convectionOsc = null;
    }
  }

  // Son du séisme : claquement sec de rupture rocheuse puis grondement sourd
  playSeisme() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;

      // 1. Claquement sec (craquement de la roche rigide au foyer)
      const snapOsc = this.audioCtx.createOscillator();
      const snapGain = this.audioCtx.createGain();
      snapOsc.type = 'sawtooth';
      snapOsc.frequency.setValueAtTime(320, now);
      snapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      snapGain.gain.setValueAtTime(0.35, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      snapOsc.connect(snapGain);
      snapGain.connect(this.audioCtx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.2);

      // 2. Grondement sourd d'ondes
      const bufferSize = this.audioCtx.sampleRate * 2.5;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.8;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(90, now);
      filter.frequency.linearRampToValueAtTime(40, now + 2.5);

      const rumbleGain = this.audioCtx.createGain();
      rumbleGain.gain.setValueAtTime(0.01, now);
      rumbleGain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      noise.connect(filter);
      filter.connect(rumbleGain);
      rumbleGain.connect(this.audioCtx.destination);

      noise.start(now);
      noise.stop(now + 2.5);
    } catch (e) {}
  }

  // Son d'éruption volcanique explosive
  playEruption() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(250, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now);
      noise.stop(now + 2.0);
    } catch (e) {}
  }

  // Clic d'interface UI doux
  playClick() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }
}

const sounds = new SoundManager();
