# Moskva RP — Сайт + API

## Структура
```
moskva-rp/
├── index.html              — Главная страница сайта
├── vercel.json             — Роутинг Vercel
├── api/
│   ├── download.json       — Конфиг для APK (IP, кэш, версия)
│   ├── stats.js            — Онлайн статистика
│   ├── admins-list.js      — Список администраторов
│   ├── app/
│   │   ├── auth.js         — Авторизация/регистрация
│   │   └── roulette.js     — Рулетка (опционально)
│   └── texdb/
│       ├── player.js       — Профиль игрока
│       └── menu.js         — Данные меню
```

## Деплой на Vercel

1. Зарегистрируйся на vercel.com
2. Создай новый проект → Import Git Repository
3. Залей папку москва-рп в GitHub
4. Vercel автоматически задеплоит

Или через CLI:
```bash
npm i -g vercel
cd moskva-rp
vercel
```

## Что менять при патчинге APK

В APK нужно заменить эти строки:

| Старое (Black Russia)                        | Новое (Moskva RP)                              |
|----------------------------------------------|------------------------------------------------|
| `http://arizona-cloudy.ru/download.json`     | `https://moskva-rp.vercel.app/api/download.json` |
| `https://api.blackrussia.online/`            | `https://moskva-rp.vercel.app/api/`            |
| `https://blackrussia.online/play.php`        | `https://moskva-rp.vercel.app/play`            |
| `https://dl.blackcdn.me/launcher.apk`        | `https://moskva-rp.vercel.app/moskva-rp.apk`  |
| `https://crashtool.blackrussia.online:6787/` | (можно удалить или оставить)                   |
| `https://t.me/daniellestudio`                | твой телеграм                                  |

## Настройка download.json

Отредактируй `/api/download.json`:

```json
{
  "version": 1,
  "apk_url": "ССЫЛКА_НА_ТВОЙ_APK",
  "servers": [
    {
      "name": "Moskva RP #1",
      "host": "ТВОЙ_IP",
      "port": 7777
    }
  ],
  "cache_url": "ССЫЛКА_НА_КЭШ.zip",
  "api_url": "https://moskva-rp.vercel.app/api"
}
```

## Подключение базы данных

Сейчас API работает в демо-режиме. Для реальной работы:

1. Создай базу на [Supabase](https://supabase.com) (бесплатно)
2. Добавь переменные окружения в Vercel:
   - `DATABASE_URL`
   - `JWT_SECRET`
3. Раскомментируй код в `api/app/auth.js` и `api/texdb/player.js`

## Таблицы БД (SQL)

```sql
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  nick VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(256) NOT NULL,
  level INT DEFAULT 1,
  money INT DEFAULT 10000,
  bank INT DEFAULT 0,
  hours INT DEFAULT 0,
  warns INT DEFAULT 0,
  admin_level INT DEFAULT 0,
  vip_level INT DEFAULT 0,
  last_server VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players(id),
  token VARCHAR(256) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```
