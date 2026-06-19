import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Load saved messages from localStorage
function loadMessages() {
  try {
    const saved = localStorage.getItem('birthday_messages');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveMessages(messages) {
  try {
    localStorage.setItem('birthday_messages', JSON.stringify(messages.slice(0, 100)));
  } catch {}
}

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // ── Phase / Screen ──────────────────────────────────────────────────────
    phase: 'menu',           // 'menu' | 'loading' | 'scene'
    setPhase: (phase) => set({ phase }),

    // ── Local User ──────────────────────────────────────────────────────────
    localUser: null,          // { username, color }
    setLocalUser: (user) => set({ localUser: user }),

    // ── Room State ──────────────────────────────────────────────────────────
    candlesLit: true,
    setCandlesLit: (v) => set({ candlesLit: v }),

    cakeCut: false,
    setCakeCut: (v) => set({ cakeCut: v }),

    balloons: {
      balloon_0: true, balloon_1: true, balloon_2: true,
      balloon_3: true, balloon_4: true, balloon_5: true,
      balloon_6: true, balloon_7: true, balloon_8: true,
      balloon_9: true, balloon_10: true, balloon_11: true,
      balloon_12: true, balloon_13: true, balloon_14: true,
      balloon_15: true, balloon_16: true, balloon_17: true,
      balloon_18: true, balloon_19: true,
    },
    popBalloon: (id) => set(s => ({ balloons: { ...s.balloons, [id]: false } })),
    resetBalloons: () => set({
      balloons: {
        balloon_0: true, balloon_1: true, balloon_2: true,
        balloon_3: true, balloon_4: true, balloon_5: true,
        balloon_6: true, balloon_7: true, balloon_8: true,
        balloon_9: true, balloon_10: true, balloon_11: true,
        balloon_12: true, balloon_13: true, balloon_14: true,
        balloon_15: true, balloon_16: true, balloon_17: true,
        balloon_18: true, balloon_19: true,
      },
    }),

    // ── Celebrate Sequence ──────────────────────────────────────────────────
    celebrateActive: false,
    setCelebrateActive: (v) => set({ celebrateActive: v }),

    // ── Camera Mode ─────────────────────────────────────────────────────────
    cameraMode: 'orbit',      // 'orbit' | 'explore' | 'cinematic'
    cinematicTarget: null,    // null | 'cake' | 'overview' | 'decorations'
    setCameraMode: (mode) => set({ cameraMode: mode }),
    setCinematicTarget: (t) => set({ cinematicTarget: t }),

    // ── UI Panels ───────────────────────────────────────────────────────────
    activePanel: null,        // null | 'guestbook' | 'gallery' | 'users'
    setActivePanel: (p) => set(s => ({ activePanel: s.activePanel === p ? null : p })),
    closePanel: () => set({ activePanel: null }),

    // ── Gallery ─────────────────────────────────────────────────────────────
    galleryIndex: 0,
    galleryOpen: false,
    setGalleryIndex: (i) => set({ galleryIndex: i }),
    openGallery: (i) => set({ galleryOpen: true, galleryIndex: i }),
    closeGallery: () => set({ galleryOpen: false }),

    // ── Guest Book Messages (persisted to localStorage) ─────────────────────
    messages: loadMessages(),
    addMessage: (msg) => set(s => {
      const updated = [msg, ...s.messages].slice(0, 100);
      saveMessages(updated);
      return { messages: updated };
    }),
    setMessages: (msgs) => {
      saveMessages(msgs);
      set({ messages: msgs });
    },

    // ── HUD Notifications ───────────────────────────────────────────────────
    notification: null,
    showNotification: (text, duration = 3000) => {
      set({ notification: text });
      setTimeout(() => set(s => s.notification === text ? { notification: null } : {}), duration);
    },

    // ── Audio ───────────────────────────────────────────────────────────────
    audioEnabled: false,
    toggleAudio: () => set(s => ({ audioEnabled: !s.audioEnabled })),
  }))
);

export default useStore;
