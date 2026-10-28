// Web Audio API synthesizer for the iconic, warm macOS startup chord
export function playMacStartupChime() {
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Authentic macOS warm major chord: F#2, C#3, F#3, A#3, C#4, F#4
    const freqs = [92.5, 138.59, 185.0, 233.08, 277.18, 369.99];
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    
    // Smooth exponential envelope
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.06);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
    masterGain.connect(ctx.destination);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, now);
      // Slight detune for analog warmth
      osc.detune.setValueAtTime((idx - 2.5) * 3, now);
      oscGain.gain.setValueAtTime(1 / freqs.length, now);
      osc.connect(oscGain).connect(masterGain);
      osc.start(now);
      osc.stop(now + 2.9);
    });

    // Close context after completion
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 3200);
  } catch {
    // Audio unavailable or blocked
  }
}
