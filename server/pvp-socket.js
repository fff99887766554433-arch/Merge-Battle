// server/pvp-socket.js
function chooseRandomTarget() {
  const maxLevel = 12;
  return { type: 'block', level: Math.floor(Math.random() * maxLevel) + 1 };
}

function setupPvp(io) {
  // For production replace Map with Redis-based storage for scaling
  const matches = new Map();

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('join_match', ({ matchId, userId }) => {
      socket.join(matchId);
      socket.data.userId = userId;
      if (!matches.has(matchId)) {
        matches.set(matchId, { players: {}, state: {}, createdAt: Date.now() });
      }
      const m = matches.get(matchId);
      m.players[userId] = { socketId: socket.id, connected: true };
      io.to(matchId).emit('player_list', Object.keys(m.players));
      console.log(`${userId} joined match ${matchId}`);
    });

    socket.on('start_match', ({ matchId }) => {
      const m = matches.get(matchId);
      if (!m) return;
      if (m.targetBlock) return;
      const target = chooseRandomTarget();
      m.targetBlock = target;
      m.startedAt = Date.now();
      io.to(matchId).emit('match_started', { targetBlock: target });
      console.log(`match ${matchId} started with target`, target);
    });

    socket.on('created_block', ({ matchId, userId, block }) => {
      const m = matches.get(matchId);
      if (!m || !m.targetBlock) return;
      const target = m.targetBlock;
      if (block && block.type === target.type && block.level === target.level) {
        io.to(matchId).emit('match_end', { winner: userId, reason: 'target_block', target });
        matches.delete(matchId);
        console.log(`match ${matchId} winner ${userId}`);
        return;
      }
      io.to(matchId).emit('state_update', { from: userId, action: { type: 'created_block', block } });
    });

    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      console.log('disconnect', socket.id, userId);
      // For production: mark player disconnected and schedule timeout -> loss.
    });
  });
}

module.exports = { setupPvp };
