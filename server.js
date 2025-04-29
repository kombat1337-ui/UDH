// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');

// Генерация уникального токена
function generateToken(length = 6) {
  return crypto.randomBytes(length).toString('hex');
}

// HTTP: эндпоинт для токена
const app = express();
app.get('/generate_token', (req, res) => {
  res.json({ token: generateToken() });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let devices = [];

function broadcastDeviceList() {
  const list = devices.map(d => d.token);
  const msg = JSON.stringify({ type: 'deviceList', devices: list });
  devices.forEach(d => d.ws.send(msg));
}

wss.on('connection', ws => {
  const token = generateToken();
  devices.push({ ws, token });

  // отправляем токен клиенту
  ws.send(JSON.stringify({ type: 'token', token }));
  broadcastDeviceList();

  ws.on('message', raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    const from = devices.find(d => d.ws === ws)?.token;

    switch (msg.type) {
      case 'syncRequest': {
        const target = devices.find(d => d.token === msg.targetToken);
        if (target) {
          target.ws.send(JSON.stringify({ type: 'syncRequest', fromToken: from, data: msg.data }));
        }
        break;
      }
      case 'syncAck': {
        const target = devices.find(d => d.token === msg.targetToken);
        if (target) {
          target.ws.send(JSON.stringify({ type: 'syncAck', fromToken: from, data: msg.data }));
        }
        break;
      }
      case 'file': {
        const target = devices.find(d => d.token === msg.targetToken);
        if (target) {
          target.ws.send(JSON.stringify({ type: 'file', fromToken: from, fileName: msg.fileName, fileData: msg.fileData }));
        }
        break;
      }
      case 'screenRequest': {
        const target = devices.find(d => d.token === msg.targetToken);
        if (target) {
          target.ws.send(JSON.stringify({ type: 'screenRequest', fromToken: from }));
        }
        break;
      }
      case 'screenFrame': {
        const target = devices.find(d => d.token === msg.targetToken);
        if (target) {
          target.ws.send(JSON.stringify({ type: 'screenFrame', fromToken: from, frame: msg.frame }));
        }
        break;
      }
      case 'inputEvent': {
        const target = devices.find(d => d.token === msg.targetToken);
        if (target) {
          target.ws.send(JSON.stringify({ type: 'inputEvent', fromToken: from, event: msg.event }));
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    devices = devices.filter(d => d.ws !== ws);
    broadcastDeviceList();
  });
});

server.listen(8080, () => console.log('Server running on http://localhost:8080'));