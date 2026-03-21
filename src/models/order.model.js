const pool = require('../config/db');

class Order {
    static async create(userId, symbol, type, quantity, price, status = 'PENDING') {
        const query = `
      INSERT INTO orders (user_id, symbol, type, quantity, price, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const values = [userId, symbol, type, quantity, price, status];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;';
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }
}

module.exports = Order;
