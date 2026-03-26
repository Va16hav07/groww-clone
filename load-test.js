const autocannon = require('autocannon');

async function runTest() {
    console.log('Running API Gateway Load Test (Rate Limiting check)...');

    const instance = autocannon({
        url: 'http://localhost:8000/api', // Health endpoint
        connections: 10,  // Number of concurrent connections
        pipelining: 1,    // Number of pipelined requests
        duration: 5       // Duration of the test in seconds
    });

    autocannon.track(instance, { renderProgressBar: false });

    instance.on('done', (result) => {
        console.log('\\nLoad Test Results:');
        console.log(`Total Requests Sent: ${result.requests.total}`);

        if (result['4xx'] > 0 && result['2xx'] <= 110) {
            console.log('\\n[SUCCESS] The Rate Limiter correctly throttled the requests! Only 100 allowed.');
        } else {
            console.log('\\n[WARNING] The Rate Limiter might not be working as expected.');
        }
    });
}

runTest();
