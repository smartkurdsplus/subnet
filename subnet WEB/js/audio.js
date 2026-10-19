/**
 * Web Audio API Sound Synthesizer
 * Provides futuristic cyber sounds, clicks, correct/wrong alerts, level up fanfares.
 * 100% synthesized - zero external audio assets required.
 */

const SoundFX = (() => {
  let ctx = null;
  let isMuted = false;

  function initAudio() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, pitchDecay = 0) {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (pitchDecay !== 0) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(20, freq + pitchDecay),
          ctx.currentTime + duration
        );
      }

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Futuristic UI click
  function click() {
    playTone(800, 'sine', 0.04, 0.08, -300);
  }

  // Bit toggling sound (high-tech tick)
  function bitToggle(state) {
    if (state) {
      playTone(1200, 'triangle', 0.06, 0.1, 200);
    } else {
      playTone(600, 'triangle', 0.06, 0.1, -200);
    }
  }

  // Laser slice sound for backward compatibility
  function slice() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }

  // Network diagnostic radar scan sound
  function scan() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1250, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch (e) {}
  }

  // High-tech ICMP ping packet echo sound
  function ping() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Correct answer chime (2 harmonized ascending notes)
  function correct() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      const t = ctx.currentTime;
      [
        { f: 587.33, start: 0, d: 0.15 },    // D5
        { f: 880, start: 0.08, d: 0.25 },     // A5
        { f: 1174.66, start: 0.16, d: 0.35 }  // D6
      ].forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, t + note.start);
        gain.gain.setValueAtTime(0.15, t + note.start);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.start + note.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + note.start);
        osc.stop(t + note.start + note.d);
      });
    } catch (e) {}
  }

  // Wrong answer buzzer
  function wrong() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.linearRampToValueAtTime(110, t + 0.25);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) {}
  }

  // Level Up / Victory fanfare
  function levelUp() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      const t = ctx.currentTime;
      const notes = [
        { f: 523.25, time: 0 },    // C5
        { f: 659.25, time: 0.1 },  // E5
        { f: 783.99, time: 0.2 },  // G5
        { f: 1046.5, time: 0.35 }  // C6
      ];
      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t + n.time);
        gain.gain.setValueAtTime(0.2, t + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + n.time);
        osc.stop(t + n.time + 0.3);
      });
    } catch (e) {}
  }

  // Toggle Mute
  function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  }

  function getIsMuted() {
    return isMuted;
  }

  return {
    init: initAudio,
    click,
    bitToggle,
    slice,
    scan,
    ping,
    correct,
    wrong,
    levelUp,
    toggleMute,
    getIsMuted
  };
})();

// Initialize on first user interaction
['click', 'keydown', 'touchstart'].forEach(evt => {
  window.addEventListener(evt, () => SoundFX.init(), { once: true });
});

if (typeof window !== 'undefined') {
  window.SoundFX = SoundFX;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SoundFX;
}

