const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3003 });

server.on('connection', (socket) => {
  console.log('New WebSocket client connected');

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
  });

  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

console.log('WebSocket server running on port 3003');
