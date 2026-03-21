require('dotenv').config();
const axios = require('axios');

async function testApi() {
    try {
        const res = await axios.get('https://stock.indianapi.in/stock?name=RELIANCE', {
            headers: { 'x-api-key': process.env.INDIAN_STOCK_API_KEY }
        });

        // Find the current price
        let price = null;

        // Some APIs return directly
        if (res.data.currentPrice) price = res.data.currentPrice;
        else if (res.data.price) price = res.data.price;
        // others return nested
        else if (res.data.companyProfile && res.data.companyProfile.price) price = res.data.companyProfile.price;

        console.log("Raw DATA keys:", Object.keys(res.data));
        console.log("Found price:", price);

        // print the price from currentPrice object if it exists
        if (res.data.currentPrice && typeof res.data.currentPrice === 'object') {
            console.log("currentPrice object:", res.data.currentPrice);
        }
    } catch (err) {
        console.error(err);
    }
}

testApi();
