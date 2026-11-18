/**
 * Zero-dependency WebAudio procedural military synthesizer.
 * Includes rate-limiting to avoid audio clipping during 20 RPS CIWS bursts
 * and synthesized GAU-8 Avenger "BRRRT" for the A-10 Thunderbolt II.
 */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.volume = 0.45;
    this.lastPlayed = new Map();
  }

  unlock() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer(2.0);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  createNoiseBuffer(seconds) {
    const sampleRate = this.ctx.sampleRate;
    const length = Math.floor(sampleRate * seconds);
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  canPlay(tag, minIntervalMs) {
    if (this.muted || !this.ctx || this.ctx.state !== 'running') return false;
    const now = performance.now();
    const prev = this.lastPlayed.get(tag) || 0;
    if (now - prev < minIntervalMs) return false;
    this.lastPlayed.set(tag, now);
    return true;
  }

  playShot(type) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    if (type === 'mg50') {
      if (!this.canPlay('mg50', 48)) return;
      this.percussiveBurst(t, 160, 55, 0.065, 0.14, 'sawtooth', 1400);
    } else if (type === 'ciws') {
      if (!this.canPlay('ciws', 34)) return;
      this.percussiveBurst(t, 280, 110, 0.038, 0.09, 'square', 2200);
    } else if (type === 'autocannon') {
      if (!this.canPlay('autocannon', 90)) return;
      this.percussiveBurst(t, 125, 42, 0.12, 0.22, 'sawtooth', 950);
    } else if (type === 'missile') {
      if (!this.canPlay('missile', 110)) return;
      this.noiseSweep(t, 350, 1900, 0.28, 0.18);
    } else if (type === 'howitzer') {
      if (!this.canPlay('howitzer', 180)) return;
      this.percussiveBurst(t, 82, 24, 0.34, 0.38, 'triangle', 500);
      this.noiseSweep(t, 450, 140, 0.32, 0.24);
    } else if (type === 'laser') {
      if (!this.canPlay('laser', 140)) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(640, t);
      osc.frequency.linearRampToValueAtTime(780, t + 0.14);
      gain.gain.setValueAtTime(0.055, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.17);
    } else if (type === 'emp') {
      if (!this.canPlay('emp', 300)) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, t);
      osc.frequency.exponentialRampToValueAtTime(65, t + 0.45);
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.46);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.48);
    } else if (type === 'tesla') {
      if (!this.canPlay('tesla', 95)) return;
      this.percussiveBurst(t, 1280, 320, 0.11, 0.14, 'sawtooth', 3400);
    } else if (type === 'railgun') {
      if (!this.canPlay('railgun', 150)) return;
      this.percussiveBurst(t, 920, 95, 0.22, 0.28, 'sawtooth', 4200);
      this.noiseSweep(t, 2800, 280, 0.22, 0.2);
    } else if (type === 'cryo' || type === 'toxic') {
      if (!this.canPlay(type, 110)) return;
      this.noiseSweep(t, type === 'cryo' ? 2200 : 880, type === 'cryo' ? 950 : 320, 0.16, 0.13);
    } else if (type === 'flame') {
      if (!this.canPlay('flame', 95)) return;
      this.noiseSweep(t, 520, 210, 0.16, 0.14);
    } else if (type === 'ballista' || type === 'sniper') {
      if (!this.canPlay(type, 90)) return;
      this.percussiveBurst(t, type === 'sniper' ? 380 : 240, 75, 0.11, 0.2, 'triangle', 1900);
    }
  }

  playExplosion(scale = 1.0) {
    if (!this.canPlay(scale > 1.2 ? 'big_exp' : 'exp', scale > 1.2 ? 90 : 55)) return;
    const t = this.ctx.currentTime;
    const dur = Math.min(0.85, 0.22 + scale * 0.18);
    const vol = Math.min(0.45, 0.16 + scale * 0.1);

    // Sub-bass punch
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(22, t + dur);
    oscGain.gain.setValueAtTime(vol, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(oscGain);
    oscGain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);

    // Filtered noise roar
    this.noiseSweep(t, 700, 110, dur, vol * 0.85);
  }

  playRicochet() {
    if (!this.canPlay('ricochet', 65)) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const base = 1750 + Math.random() * 650;
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.exponentialRampToValueAtTime(base * 1.55, t + 0.09);
    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  playApsIntercept() {
    if (!this.canPlay('aps', 120)) return;
    const t = this.ctx.currentTime;
    this.percussiveBurst(t, 640, 180, 0.09, 0.2, 'square', 2800);
  }

  /**
   * Iconic A-10 Thunderbolt II GAU-8 Avenger 30mm "BRRRT" + jet flyby.
   */
  playA10Brrrt() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;

    // 65 Hz rotary cannon pulse buzz (3900 RPM = 65 rounds/sec!)
    const buzz = this.ctx.createOscillator();
    const buzzSub = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    buzz.type = 'sawtooth';
    buzz.frequency.setValueAtTime(66, t);
    buzz.frequency.linearRampToValueAtTime(62, t + 1.15);

    buzzSub.type = 'square';
    buzzSub.frequency.setValueAtTime(132, t);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, t);
    filter.Q.value = 1.4;

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.42, t + 0.06);
    gain.gain.setValueAtTime(0.4, t + 0.95);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.25);

    buzz.connect(filter);
    buzzSub.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    buzz.start(t);
    buzzSub.start(t);
    buzz.stop(t + 1.28);
    buzzSub.stop(t + 1.28);

    // Supersonic air-ripping noise layer
    this.noiseSweep(t, 2600, 380, 1.35, 0.28);
  }

  playHellfireStrike() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    // Laser lock chirp
    const lock = this.ctx.createOscillator();
    const lockGain = this.ctx.createGain();
    lock.type = 'sine';
    lock.frequency.setValueAtTime(1480, t);
    lock.frequency.setValueAtTime(1960, t + 0.08);
    lockGain.gain.setValueAtTime(0.14, t);
    lockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    lock.connect(lockGain);
    lockGain.connect(this.master);
    lock.start(t);
    lock.stop(t + 0.21);

    // Missile descent whistle
    this.noiseSweep(t + 0.05, 3200, 480, 0.45, 0.22);
  }

  playUi(kind = 'click') {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (kind === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.setValueAtTime(135, t + 0.07);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.19);
    } else if (kind === 'wave') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.setValueAtTime(780, t + 0.11);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.32);
    } else if (kind === 'repair') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.setValueAtTime(630, t + 0.06);
      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.17);
    } else if (kind === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(660, t + 0.11);
      osc.frequency.setValueAtTime(880, t + 0.22);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.36);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.38);
    } else if (kind === 'ping') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, t);
      osc.frequency.setValueAtTime(1320, t + 0.06);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (kind === 'build') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.setValueAtTime(480, t + 0.04);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.12);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(840, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  percussiveBurst(t, fStart, fEnd, dur, vol, wave, cutoff) {
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(fStart, t);
    osc.frequency.exponentialRampToValueAtTime(fEnd, t + dur);
    oscGain.gain.setValueAtTime(vol, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(oscGain);
    oscGain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.01);

    if (this.noiseBuffer) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoff, t);
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(vol * 0.65, t);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.master);
      src.start(t);
      src.stop(t + dur + 0.01);
    }
  }

  noiseSweep(t, fStart, fEnd, dur, vol) {
    if (!this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(fStart, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, fEnd), t + dur);
    filter.Q.value = 0.9;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.02);
  }
}

export const audio = new AudioEngine();
