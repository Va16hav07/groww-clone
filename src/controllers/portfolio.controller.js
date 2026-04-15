const pool = require('../config/db');
const User = require('../models/user.model');

exports.getPortfolio = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        
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
            balance: user.balance,
            estimatedTotal
        });
    } catch (err) {
        console.error('Error fetching portfolio:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.addMoney = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount } = req.body;
        
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, error: 'Invalid amount' });
        }
        
        const updatedUser = await User.updateBalance(userId, amount);
        
        res.json({
            success: true,
            message: 'Money added successfully',
            balance: updatedUser.balance
        });
    } catch (err) {
        console.error('Error adding money:', err);
        res.status(500).json({ success: false, error: 'Server error adding money' });
    }
};
