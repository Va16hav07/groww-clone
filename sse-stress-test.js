const http = require('http');

console.log('Initiating 200 concurrent SSE Streams...');

const NUM_CLIENTS = 200;
let connected = 0;
let eventsReceived = 0;

for (let i = 0; i < NUM_CLIENTS; i++) {
    const req = http.get('http://localhost:8000/api/prices/stream', (res) => {
        if (res.statusCode === 200) connected++;
        res.on('data', (chunk) => {
            eventsReceived++;
        });
        res.on('error', () => { });
    });
    req.on('error', () => { });
}

setTimeout(() => {
    console.log(`\\nSSE Load Test Results (10 seconds):`);
    console.log(`Successfully connected clients: ${connected}/${NUM_CLIENTS}`);
    console.log(`Total SSE Data packets received: ${eventsReceived}`);

    if (connected === NUM_CLIENTS && eventsReceived >= NUM_CLIENTS * 2) {
        console.log('[SUCCESS] Node.js safely handled 200 simultaneous streams and broadcasted successfully.');
    } else {
        console.log('[WARNING] SSE streaming missed connections or dropped packets.');
    }
    process.exit(0);
}, 10000);
