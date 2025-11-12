// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { setupPvp } = require('./pvp-socket');
const paymentsRouter = require('./payments');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/payments', paymentsRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
setupPvp(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
