import WebSocket from 'ws';

console.log("Connecting to Preview HMR WebSocket...");
const ws = new WebSocket('ws://127.0.0.1/', {
  headers: {
    Host: '019e7387-dc13-70aa-a88e-3fe96bac6c73.preview.localhost'
  }
});

ws.on('open', () => {
  console.log("SUCCESS! HMR WebSocket connected successfully.");
  ws.close();
  process.exit(0);
});

ws.on('unexpected-response', (req, res) => {
  console.error(`FAILED! Unexpected response: ${res.statusCode}`);
  process.exit(1);
});

ws.on('error', (err) => {
  console.error("FAILED! Connection error:", err.message);
  process.exit(1);
});
