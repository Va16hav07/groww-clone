const axios = require('axios');

class StockService {
    async getLatestPrice(symbol, useFallback = false) {
        const apiKey = useFallback ? process.env.INDIAN_STOCK_API_KEY_FALLBACK : process.env.INDIAN_STOCK_API_KEY;

        try {
            const response = await axios.get(`${process.env.INDIAN_STOCK_API_URL}/stock?name=${symbol}`, {
                headers: { 'x-api-key': apiKey }
            });
            const data = response.data;

            let price = null;
            if (data.currentPrice) {
                price = data.currentPrice.NSE || data.currentPrice.BSE || data.currentPrice;
            } else {
                price = data.price || data.lastPrice || 100.00;
            }

            if (!price || isNaN(parseFloat(price))) {
                console.warn(`[StockService] Price not strictly found or NaN for ${symbol}. Using fallback 100.00.`);
                price = 100.00;
            }

            return parseFloat(price);
        } catch (error) {
            if (!useFallback && process.env.INDIAN_STOCK_API_KEY_FALLBACK) {
                console.warn(`[StockService] Primary API Key failed for ${symbol} (Rate Limit?). Retrying with backup API Key...`);
                return this.getLatestPrice(symbol, true);
            }

            console.error(`[StockService] Error fetching price for ${symbol}:`, error.message);
            throw new Error(`Failed to fetch current price for ${symbol}`);
        }
    }
}

module.exports = new StockService();
