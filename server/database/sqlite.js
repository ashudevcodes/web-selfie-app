const Database = require('better-sqlite3');

const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/myDatabase.sqlite' : 'myDatabase.sqlite';
const db = new Database(dbPath, { verbose: console.log });

db.prepare(`
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        latitude REAL,
        longitude REAL,
        temperature REAL,
        image_path TEXT,
        timestamp INTEGER
    )
`).run();

module.exports = db;

