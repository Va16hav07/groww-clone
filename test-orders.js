const axios = require('axios');

async function run() {
    try {
        const loginRes = await axios.post('http://localhost:8000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Token acquired');

        const orderRes = await axios.post('http://localhost:8000/api/orders', {
            symbol: 'TCS',
            type: 'BUY',
            quantity: 5
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Order created:', orderRes.data.order);

        console.log('Waiting 4 seconds...');
        await new Promise(r => setTimeout(r, 4000));

        const getRes = await axios.get('http://localhost:8000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Orders:', getRes.data.orders.slice(0, 2));

    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}
run();
