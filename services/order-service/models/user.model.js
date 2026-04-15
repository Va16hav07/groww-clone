const pool = require('../config/db');

class User {
    static async create(name, email, passwordHash) {
        const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at;
    `;
        const values = [name, email, passwordHash];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1;';
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, name, email, balance, created_at, updated_at FROM users WHERE id = $1;';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    static async updateBalance(id, amountChange) {
        const query = `
          UPDATE users 
          SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          RETURNING id, balance;
        `;
        const { rows } = await pool.query(query, [amountChange, id]);
        return rows[0];
    }
}

module.exports = User;
