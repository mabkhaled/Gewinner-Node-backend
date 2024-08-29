const WebSocket = require('ws');
const express = require('express');
const client = require('prom-client');

// Create a new express app for metrics
const app = express();
const portMetrics = 3004;

// Create a Registry to register metrics
const register = new client.Registry();

// Define a new gauge metric to track active WebSocket connections
const activeConnectionsGauge = new client.Gauge({
  name: 'websocket_active_connections',
  help: 'Number of active WebSocket connections',
});

// Register the gauge metric
register.registerMetric(activeConnectionsGauge);

// WebSocket server
const server = new WebSocket.Server({ port: 3003 });

server.on('connection', (socket) => {
  console.log('New WebSocket client connected');

  // Increment the active connections gauge
  activeConnectionsGauge.inc();

  let latitude = 36.8410624;
  let longitude = 10.1548032;

  function simulateMovement() {
    latitude += (Math.random() - 0.5) * 0.0001;
    longitude += (Math.random() - 0.5) * 0.0001;

    const locationData = {
      latitude: parseFloat(latitude.toFixed(7)),
      longitude: parseFloat(longitude.toFixed(7))
    };

    socket.send(JSON.stringify(locationData));
  }

  const intervalId = setInterval(simulateMovement, 2000);

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  socket.on('close', () => {
    console.log('WebSocket client disconnected');
    clearInterval(intervalId);

    // Decrement the active connections gauge
    activeConnectionsGauge.dec();
  });

  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

console.log('WebSocket server running on port 3003');

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start the HTTP server for metrics
app.listen(portMetrics, () => {
  console.log(`Metrics server running on port ${portMetrics}`);
});
