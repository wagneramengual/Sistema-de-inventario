require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

const apiRouter = require('./routes/api');
const websocketService = require('./services/websocket');

const app = express();
const server = http.createServer(app);

// CORS – libera o frontend no GitHub Pages
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ||
  'https://wagneramengual.github.io';

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api', apiRouter);

// Rota simples de health
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString()
  });
});

// (Opcional) servir frontend estático, se quiser rodar tudo no Railway também
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// WebSocket
websocketService.init(server);

// Porta
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
