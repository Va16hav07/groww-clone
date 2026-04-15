const pool = require('../config/db');

exports.getPortfolio = async (req, res) => {
    try {
        const userId = req.userId;
        
        const query = `
            SELECT symbol, 
                   SUM(CASE WHEN type = 'BUY' THEN quantity ELSE -quantity END) as total_quantity
            FROM orders 
            WHERE user_id = $1 AND status = 'EXECUTED' 
            GROUP BY symbol;
        `;
        const { rows } = await pool.query(query, [userId]);

        let estimatedTotal = 0;
        
        res.json({
            success: true,
            portfolio: rows,
            estimatedTotal
        });
    } catch (err) {
        console.error('Error fetching portfolio:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
