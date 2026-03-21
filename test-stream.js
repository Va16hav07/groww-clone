const http = require('http');

http.get('http://localhost:8000/api/prices/stream', (res) => {
    console.log(`Connected with status: ${res.statusCode}`);
    let eventCount = 0;

    res.on('data', (chunk) => {
        console.log(`[Event ${++eventCount}]`, chunk.toString());
        if (eventCount >= 3) {
            console.log('Received enough events. Closing.');
            process.exit(0);
        }
    });

    res.on('error', (err) => console.error(err));
});
