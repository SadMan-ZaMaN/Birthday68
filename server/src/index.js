import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// ─── Express & HTTP Setup ─────────────────────────────────────────────────────
const app = express();
const httpServer = createServer(app);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use('/api', limiter);

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/birthday';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.warn('⚠️  MongoDB not connected (messages wont persist):', err.message));

// ─── Database Schema ──────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  username: { type: String, required: true, maxlength: 30 },
  message: { type: String, required: true, maxlength: 500 },
  color: { type: String, default: '#FFD700' },
  timestamp: { type: Date, default: Date.now },
});

const GuestMessage = mongoose.model('GuestMessage', messageSchema);

// ─── Socket.IO Setup ──────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ─── In-Memory State ─────────────────────────────────────────────────────────
const connectedUsers = new Map(); // socketId → { id, username, color, position, rotation }
const roomState = {
  candlesLit: true,
  cakeCut: false,
  balloons: {
    balloon_0: true,
    balloon_1: true,
    balloon_2: true,
    balloon_3: true,
    balloon_4: true,
    balloon_5: true,
    balloon_6: true,
    balloon_7: true,
  },
  celebrateTriggered: false,
  celebrateVotes: new Set(),
};

// Avatar colors pool
const AVATAR_COLORS = [
  '#FF6B9D', '#FF8C42', '#FFC947', '#A8E063',
  '#56D8CD', '#5B86E5', '#B06AB3', '#FF4E50',
];
let colorIndex = 0;

function sanitize(str, maxLen = 30) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'&]/g, '').substring(0, maxLen).trim();
}

function getNextColor() {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  colorIndex++;
  return color;
}

// ─── Socket.IO Event Handlers ─────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔗 Socket connected: ${socket.id}`);

  // --- JOIN ROOM ---
  socket.on('join_room', ({ username }) => {
    const cleanName = sanitize(username, 30) || 'Guest';
    const color = getNextColor();
    const userId = uuidv4();

    const user = {
      id: userId,
      socketId: socket.id,
      username: cleanName,
      color,
      position: { x: 0, y: 0, z: 0 },
      rotation: { y: 0 },
      joinedAt: Date.now(),
    };

    connectedUsers.set(socket.id, user);

    // Send the joining user their info + full room state
    socket.emit('joined', {
      user,
      users: Array.from(connectedUsers.values()),
      roomState: {
        ...roomState,
        celebrateVotes: Array.from(roomState.celebrateVotes),
        balloons: { ...roomState.balloons },
      },
    });

    // Tell everyone else about the new user
    socket.broadcast.emit('user_joined', user);

    console.log(`👤 ${cleanName} joined (${connectedUsers.size} users online)`);
  });

  // --- PLAYER MOVEMENT ---
  socket.on('player_move', ({ position, rotation }) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    // Validate position (keep within café bounds)
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    user.position = {
      x: clamp(Number(position?.x) || 0, -12, 12),
      y: clamp(Number(position?.y) || 0, 0, 3),
      z: clamp(Number(position?.z) || 0, -12, 12),
    };
    user.rotation = { y: Number(rotation?.y) || 0 };

    socket.broadcast.emit('player_moved', {
      socketId: socket.id,
      position: user.position,
      rotation: user.rotation,
    });
  });

  // --- BLOW CANDLES ---
  socket.on('blow_candles', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    roomState.candlesLit = false;
    io.emit('candles_blown', { by: user.username, candlesLit: false });
    console.log(`🕯️ ${user.username} blew the candles`);
  });

  // --- RELIGHT CANDLES ---
  socket.on('relight_candles', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    roomState.candlesLit = true;
    io.emit('candles_relit', { by: user.username, candlesLit: true });
    console.log(`🕯️ ${user.username} relit the candles`);
  });

  // --- CUT CAKE ---
  socket.on('cut_cake', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    roomState.cakeCut = true;
    io.emit('cake_cut', { by: user.username, cakeCut: true });
    console.log(`🎂 ${user.username} cut the cake`);
  });

  // --- RESET CAKE (redo cut) ---
  socket.on('reset_cake', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    roomState.cakeCut = false;
    io.emit('cake_reset', { by: user.username, cakeCut: false });
    console.log(`🎂 ${user.username} reset the cake`);
  });

  // --- POP BALLOON ---
  socket.on('pop_balloon', ({ balloonId }) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    const id = sanitize(String(balloonId), 20);
    if (roomState.balloons.hasOwnProperty(id) && roomState.balloons[id]) {
      roomState.balloons[id] = false;
      io.emit('balloon_popped', { balloonId: id, by: user.username });
      console.log(`🎈 ${user.username} popped ${id}`);
    }
  });

  // --- CELEBRATE (all-users feature) ---
  socket.on('vote_celebrate', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    roomState.celebrateVotes.add(socket.id);
    const total = connectedUsers.size;
    const votes = roomState.celebrateVotes.size;
    io.emit('celebrate_vote_update', { votes, total });

    // Trigger when enough people vote (min 1, or majority)
    if (!roomState.celebrateTriggered && votes >= Math.max(1, Math.ceil(total * 0.5))) {
      roomState.celebrateTriggered = true;
      io.emit('celebrate_start');
      console.log('🎉 CELEBRATE sequence triggered!');
    }
  });

  // --- RESET CELEBRATE ---
  socket.on('reset_celebrate', () => {
    roomState.celebrateTriggered = false;
    roomState.celebrateVotes.clear();
    io.emit('celebrate_reset');
  });

  // --- GUEST BOOK: POST MESSAGE ---
  socket.on('post_message', async ({ message }) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    const cleanMsg = sanitize(message, 500);
    if (!cleanMsg) return;

    const newMessage = {
      id: uuidv4(),
      username: user.username,
      message: cleanMsg,
      color: user.color,
      timestamp: new Date(),
    };

    io.emit('new_message', newMessage);

    // Persist to MongoDB if available
    try {
      await GuestMessage.create(newMessage);
    } catch (e) {
      // MongoDB not available — message still broadcast live
    }
  });

  // --- DISCONNECT ---
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      roomState.celebrateVotes.delete(socket.id);
      connectedUsers.delete(socket.id);
      io.emit('user_left', { socketId: socket.id, username: user.username });
      console.log(`👋 ${user.username} disconnected (${connectedUsers.size} remaining)`);
    }
  });
});

// ─── REST API Routes ──────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    users: connectedUsers.size,
    roomState: {
      ...roomState,
      celebrateVotes: Array.from(roomState.celebrateVotes),
    },
  });
});

// Get all guest book messages (with pagination)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await GuestMessage.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();
    res.json(messages.reverse());
  } catch (e) {
    res.json([]);
  }
});

// Get online users
app.get('/api/users', (req, res) => {
  res.json(Array.from(connectedUsers.values()).map(u => ({
    id: u.id,
    username: u.username,
    color: u.color,
  })));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🎂 Birthday server running on http://localhost:${PORT}`);
});

export default app;
