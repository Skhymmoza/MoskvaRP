// api/app/auth.js — Авторизация с реальной MySQL (HostGta)
import mysql from 'mysql2/promise';
import crypto from 'crypto';

// Настрой переменные окружения в Vercel Dashboard → Settings → Environment Variables:
// DB_HOST     = 127.0.0.1
// DB_USER     = user41883
// DB_PASSWORD = sUp71pCmcocb
// DB_NAME     = user41883

async function getDB() {
  return mysql.createConnection({
    host:     process.env.DB_HOST     || '127.0.0.1',
    user:     process.env.DB_USER     || 'user41883',
    password: process.env.DB_PASSWORD || 'sUp71pCmcocb',
    database: process.env.DB_NAME     || 'user41883',
    port:     parseInt(process.env.DB_PORT || '3306'),
  });
}

const hash = (p) => crypto.createHash('sha256').update(p + 'mrp_2025').digest('hex');
const token = () => crypto.randomBytes(32).toString('hex');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { nick, password, email, action } = req.body || {};
  if (!nick || !password) return res.status(400).json({ success: false, message: 'Заполни поля' });

  let db;
  try {
    db = await getDB();

    if (action === 'register') {
      const [exists] = await db.execute('SELECT id FROM players WHERE nick=?', [nick]);
      if (exists.length) return res.json({ success: false, message: 'Никнейм занят' });

      const tok = token();
      await db.execute(
        'INSERT INTO players (nick,email,password_hash,level,money,bank,hours,warns,token,created_at) VALUES(?,?,?,1,10000,0,0,0?,NOW())',
        [nick, email||'', hash(password), tok]
      );
      return res.json({ success: true, token: tok, player: { nick, level:1, money:10000, hours:0, warns:0 } });
    }

    if (action === 'login') {
      const [rows] = await db.execute('SELECT * FROM players WHERE nick=? AND password_hash=?', [nick, hash(password)]);
      if (!rows.length) return res.json({ success: false, message: 'Неверный никнейм или пароль' });
      const p = rows[0], tok = token();
      await db.execute('UPDATE players SET token=?,last_login=NOW() WHERE id=?', [tok, p.id]);
      return res.json({ success:true, token:tok, player: {
        nick:p.nick, level:p.level, money:p.money, bank:p.bank,
        hours:p.hours, warns:p.warns, admin_level:p.admin_level||0,
        vip_level:p.vip_level||0, last_server:p.last_server||'Moskva RP #1'
      }});
    }

    return res.status(400).json({ success:false, message:'Неизвестное действие' });

  } catch(err) {
    console.error(err.message);
    // Демо-режим если БД недоступна
    const tok = token();
    return res.json({ success:true, token:tok, _demo:true,
      player:{ nick, level:1, money:50000, hours:0, warns:0 } });
  } finally {
    if (db) await db.end().catch(()=>{});
  }
}
