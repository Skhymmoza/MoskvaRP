// api/texdb/player.js — Профиль игрока из MySQL
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const tok = (req.headers.authorization || '').replace('Bearer ', '');
  if (!tok) return res.status(401).json({ success:false, message:'Нет токена' });

  let db;
  try {
    db = await getDB();
    const [rows] = await db.execute('SELECT * FROM players WHERE token=?', [tok]);
    if (!rows.length) return res.status(401).json({ success:false, message:'Токен недействителен' });
    const p = rows[0];
    return res.json({
      success: true,
      nick: p.nick, level: p.level, money: p.money,
      bank: p.bank, hours: p.hours, warns: p.warns,
      admin_level: p.admin_level||0, vip_level: p.vip_level||0,
      fraction_id: p.fraction_id||0, job: p.job||'Безработный',
      last_server: p.last_server||'Moskva RP #1',
      skin_id: p.skin_id||0
    });
  } catch(err) {
    console.error(err.message);
    return res.json({ success:true, _demo:true, nick:'Player', level:1, money:50000, hours:0, warns:0 });
  } finally {
    if (db) await db.end().catch(()=>{});
  }
}
