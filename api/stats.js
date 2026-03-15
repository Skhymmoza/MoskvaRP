// api/stats.js — Статистика из MySQL
import mysql from 'mysql2/promise';

async function getDB() {
  return mysql.createConnection({
    host:     process.env.DB_HOST     || '127.0.0.1',
    user:     process.env.DB_USER     || 'user41883',
    password: process.env.DB_PASSWORD || 'sUp71pCmcocb',
    database: process.env.DB_NAME     || 'user41883',
    port:     parseInt(process.env.DB_PORT || '3306'),
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  let db;
  try {
    db = await getDB();
    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM players');
    return res.json({ online: 0, total_players: total,
      servers: [{ id:1, name:'Moskva RP #1', online:0, max:500 }] });
  } catch(err) {
    return res.json({ online:0, total_players:0, servers:[] });
  } finally {
    if (db) await db.end().catch(()=>{});
  }
}
