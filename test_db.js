const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'speakup_tms',
  ssl: false,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB CONNECTION ERROR:', err.message);
    process.exit(1);
  } else {
    console.log('DB CONNECTION OK:', res.rows[0]);
    process.exit(0);
  }
});
