const axios = require('axios');

class StockService {
    constructor() {
        this.api = axios.create({
            baseURL: process.env.INDIAN_STOCK_API_URL,
            headers: {
                'x-api-key': process.env.INDIAN_STOCK_API_KEY
            }
        });
    }

    async getLatestPrice(symbol) {
        try {
            const response = await this.api.get(`/stock?name=${symbol}`);
            const data = response.data;

            let price = null;
            if (data.currentPrice) {
                price = data.currentPrice.NSE || data.currentPrice.BSE || data.currentPrice;
            } else {
                price = data.price || data.lastPrice || 100.00;
            }

            if (!price || isNaN(parseFloat(price))) {
                console.warn(`Price not strictly found or NaN for ${symbol}. Using fallback 100.00.`);
                price = 100.00;
            }

            return parseFloat(price);
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error.message);
            throw new Error(`Failed to fetch current price for ${symbol}`);
        }
    }
}

module.exports = new StockService();
