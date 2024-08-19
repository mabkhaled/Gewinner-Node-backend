const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (socket) => {
  console.log('New WebSocket client connected');

  let latitude = 36.8410624;
  let longitude = 10.1548032;

  // Function to simulate movement
  function simulateMovement() {
    // Slightly vary latitude and longitude
    latitude += (Math.random() - 0.5) * 0.0001; // Change in latitude
    longitude += (Math.random() - 0.5) * 0.0001; // Change in longitude

    const locationData = {
      latitude: parseFloat(latitude.toFixed(7)),
      longitude: parseFloat(longitude.toFixed(7))
    };

    socket.send(JSON.stringify(locationData));
  }

  // Send simulated data every 2 seconds
  const intervalId = setInterval(simulateMovement, 2000);

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  socket.on('close', () => {
    console.log('WebSocket client disconnected');
    clearInterval(intervalId); // Clear the interval on disconnect
  });

  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});







/* const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

// Broadcast function to send messages to all connected clients
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Handle new WebSocket connections
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log('Received message:', message);

        // Broadcast the received message to all clients
        broadcast(message);
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
    });
});

console.log('WebSocket server is running on ws://localhost:3000');*/ 


