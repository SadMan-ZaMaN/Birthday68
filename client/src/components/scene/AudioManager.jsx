import React, { useEffect, useRef } from 'react';
import useStore from '../../store/useStore';

/**
 * AudioManager — a logic-only React component that runs inside our 3D scene canvas.
 * Harnesses the native browser Web Audio API to procedurally synthesize background music
 * and interactive sound effects. Requires ZERO external MP3/WAV assets to load,
 * eliminating loading delays, asset path errors, or network latency.
 */
export default function AudioManager() {
  const audioEnabled = useStore(s => s.audioEnabled);
  
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const delayNodeRef = useRef(null);
  const waltzIntervalRef = useRef(null);
  const currentWaltzBeatRef = useRef(0);

  // ─── Initialize Web Audio Context ──────────────────────────────────────────
  const initAudio = () => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Volume control to keep it balanced and warm
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.28, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Lush delay spatial effect for the lead accordion melody
    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.4, ctx.currentTime); // 400ms echo
    
    const feedback = ctx.createGain();
    feedback.gain.setValueAtTime(0.35, ctx.currentTime); // 35% delay feedback loop

    delay.connect(feedback);
    feedback.connect(delay); // Feedback loop

    const delayGain = ctx.createGain();
    delayGain.gain.setValueAtTime(0.16, ctx.currentTime); // Echo volume mix
    delay.connect(delayGain);
    delayGain.connect(masterGain);

    delayNodeRef.current = delay;
  };

  // ─── Procedural Background Waltz Composition ──────────────────────────────
  // Romantic, nostalgic waltz chords in A-minor (Am → Dm → G → C → F → Dm → E7 → Am)
  const chords = [
    { bass: 110.00, notes: [220.00, 261.63, 329.63] }, // Am
    { bass: 146.83, notes: [174.61, 220.00, 293.66] }, // Dm
    { bass: 98.00,  notes: [196.00, 246.94, 293.66] }, // G
    { bass: 130.81, notes: [196.00, 261.63, 329.63] }, // C
    { bass: 87.31,  notes: [174.61, 220.00, 261.63] }, // F
    { bass: 146.83, notes: [174.61, 220.00, 293.66] }, // Dm
    { bass: 82.41,  notes: [207.65, 246.94, 293.66] }, // E7
    { bass: 110.00, notes: [220.00, 261.63, 329.63] }  // Am
  ];

  // Whimsical waltz melody matching the bar changes (Quarter Note = 103 BPM, 3 beats/bar)
  const melody = [
    [440.00, 493.88, 523.25], // bar 1 (Am)
    [587.33, 523.25, 440.00], // bar 2 (Dm)
    [493.88, 523.25, 587.33], // bar 3 (G)
    [659.25, 587.33, 493.88], // bar 4 (C)
    [523.25, 493.88, 440.00], // bar 5 (F)
    [698.46, 659.25, 587.33], // bar 6 (Dm)
    [659.25, 587.33, 415.30], // bar 7 (E7) - E5, D5, G#4 (accidental!)
    [440.00, 0, 0]             // bar 8 (Am)
  ];

  const playBassNote = (freq) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === 'suspended') return;
    const time = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, time); // Cut off high frequencies for deep bass

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.35, time + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.58);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(time);
    osc.stop(time + 0.6);
  };

  const playChordNotes = (freqs) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === 'suspended') return;
    const time = ctx.currentTime;

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.42);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current);

      osc.start(time);
      osc.stop(time + 0.45);
    });
  };

  const playMelodyNote = (freq) => {
    if (!freq || freq === 0) return;
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === 'suspended') return;
    const time = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Accordion feel: triangle wave with custom LFO vibrato
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5.8, time); // 5.8Hz vibrato rate
    lfoGain.gain.setValueAtTime(2.2, time);   // Pitch depth shift
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.16, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    // Send melody notes through the delay line
    if (delayNodeRef.current) {
      gain.connect(delayNodeRef.current);
    }

    lfo.start(time);
    osc.start(time);
    lfo.stop(time + 0.9);
    osc.stop(time + 0.9);
  };

  const playWaltzBeat = () => {
    const currentBeat = currentWaltzBeatRef.current;
    const barIndex = Math.floor(currentBeat / 3) % chords.length;
    const beatIndex = currentBeat % 3;

    if (beatIndex === 0) {
      playBassNote(chords[barIndex].bass);
    } else {
      playChordNotes(chords[barIndex].notes);
    }

    // Play accordion waltz lead note
    const melFreq = melody[barIndex][beatIndex];
    playMelodyNote(melFreq);

    currentWaltzBeatRef.current = (currentBeat + 1) % (chords.length * 3);
  };

  // ─── Procedural Interactive Sound Effects (SFX) ───────────────────────────
  
  // 1. Balloon Pop: Deep sine thud + high-frequency noise transient
  const playBalloonPop = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const time = ctx.currentTime;

    // Deep structural pop resonance
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

    gain.gain.setValueAtTime(0.85, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(masterGainRef.current);
    osc.start(time);
    osc.stop(time + 0.16);

    // Crack snap noise
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1900, time);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGainRef.current);
    noise.start(time);
  };

  // 2. Blow Candles: Resonant bandpass sweep of filtered white noise
  const playBlowCandles = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const time = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.65;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, time);
    filter.frequency.setValueAtTime(1550, time);
    filter.frequency.exponentialRampToValueAtTime(320, time + 0.45); // Pitch sweep of breath

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(0.3, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.65);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);
    noise.start(time);
  };

  // 3. Match Strike (candle lighting): Friction crackle + soft bells
  const playMatchStrike = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const time = ctx.currentTime;

    // Match friction noise
    const bufferSize = ctx.sampleRate * 0.14;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2600, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.11, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(masterGainRef.current);
    noise.start(time);

    // Sparkle magical sine chime
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1150, time);
    oscGain.gain.setValueAtTime(0.12, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
    osc.connect(oscGain);
    oscGain.connect(masterGainRef.current);
    osc.start(time);
    osc.stop(time + 0.28);
  };

  // 4. Cut Cake: Metallic knife slide + triple chime sparkle
  const playCutCake = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const time = ctx.currentTime;

    // Scrape texture
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.07, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);
    noise.start(time);

    // Upward sparkle bells
    [0, 0.05, 0.1].forEach((delayVal, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77 + idx * 200, time + delayVal); // Chime notes B5, D6, F6

      oscGain.gain.setValueAtTime(0, time + delayVal);
      oscGain.gain.linearRampToValueAtTime(0.1, time + delayVal + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + delayVal + 0.18);

      osc.connect(oscGain);
      oscGain.connect(masterGainRef.current);
      osc.start(time + delayVal);
      osc.stop(time + delayVal + 0.2);
    });
  };

  // 5. Celebration Horns: Detuned dual dual-oscillators with falling pitch sweep "Toot toot!"
  const playCelebrationHorns = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const time = ctx.currentTime;

    [0, 0.14, 0.28].forEach((delayVal, idx) => {
      const freq = [329.63, 392.00, 523.25][idx]; // Harmonizing E4, G4, C5 surprise chord

      [-3.5, 3.5].forEach(detune => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 1.5, time + delayVal); // Start bright and high
        osc.frequency.exponentialRampToValueAtTime(freq, time + delayVal + 0.14); // Toot pitch bend
        osc.detune.setValueAtTime(detune, time + delayVal);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1050, time + delayVal);
        filter.Q.setValueAtTime(2.2, time + delayVal);

        gain.gain.setValueAtTime(0, time + delayVal);
        gain.gain.linearRampToValueAtTime(0.16, time + delayVal + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, time + delayVal + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(time + delayVal);
        osc.stop(time + delayVal + 0.55);
      });
    });
  };

  // ─── Manage Background Waltz Interval ──────────────────────────────────────
  useEffect(() => {
    if (audioEnabled) {
      initAudio();
      
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!waltzIntervalRef.current) {
        // Play beat every 580ms (standard cozy waltz rhythm)
        waltzIntervalRef.current = setInterval(playWaltzBeat, 580);
      }
    } else {
      if (waltzIntervalRef.current) {
        clearInterval(waltzIntervalRef.current);
        waltzIntervalRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
    }

    return () => {
      if (waltzIntervalRef.current) {
        clearInterval(waltzIntervalRef.current);
        waltzIntervalRef.current = null;
      }
    };
  }, [audioEnabled]);

  // ─── Subscribe to global Zustand Store interaction triggers ──────────────────
  useEffect(() => {
    const unsubCandles = useStore.subscribe(
      s => s.candlesLit,
      (lit, prevLit) => {
        if (lit === false && prevLit === true) {
          playBlowCandles();
        } else if (lit === true && prevLit === false) {
          playMatchStrike();
        }
      }
    );

    const unsubCake = useStore.subscribe(
      s => s.cakeCut,
      (cut, prevCut) => {
        if (cut === true && prevCut === false) {
          playCutCake();
        }
      }
    );

    const unsubCelebrate = useStore.subscribe(
      s => s.celebrateActive,
      (active, prevActive) => {
        if (active === true && prevActive === false) {
          playCelebrationHorns();
        }
      }
    );

    let prevBalloons = { ...useStore.getState().balloons };
    const unsubBalloons = useStore.subscribe(
      s => s.balloons,
      (balloons) => {
        Object.keys(balloons).forEach(id => {
          if (balloons[id] === false && prevBalloons[id] === true) {
            playBalloonPop();
          }
        });
        prevBalloons = { ...balloons };
      }
    );

    return () => {
      unsubCandles();
      unsubCake();
      unsubCelebrate();
      unsubBalloons();
    };
  }, []);

  return null; // Logic-only silent 3D canvas child component
}
