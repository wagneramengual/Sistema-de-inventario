const WebSocket = require('ws');

let wss = null;

function init(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('[WebSocket] Cliente conectado.');

    ws.on('close', () => {
      console.log('[WebSocket] Cliente desconectado.');
    });
  });
}

function broadcast(event, payload) {
  if (!wss) return;

  const data = JSON.stringify({ event, payload });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

module.exports = {
  init,
  broadcast
};
