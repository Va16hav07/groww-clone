require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function initDb() {
    try {
        const sqlPath = path.join(__dirname, 'src', 'db', 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await pool.query(sql);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await pool.end();
    }
}

initDb();
