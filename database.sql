-- Импортируй этот файл через кнопку "Импорт SQL" на HostGta
-- Панель → База данных MYSQL → Импорт SQL

CREATE TABLE IF NOT EXISTS `players` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `nick`          VARCHAR(24) NOT NULL UNIQUE,
  `email`         VARCHAR(100) DEFAULT '',
  `password_hash` VARCHAR(64) NOT NULL,
  `token`         VARCHAR(64) DEFAULT NULL,
  `level`         INT DEFAULT 1,
  `money`         INT DEFAULT 10000,
  `bank`          INT DEFAULT 0,
  `hours`         INT DEFAULT 0,
  `warns`         TINYINT DEFAULT 0,
  `admin_level`   TINYINT DEFAULT 0,
  `vip_level`     TINYINT DEFAULT 0,
  `fraction_id`   INT DEFAULT 0,
  `fraction_rank` TINYINT DEFAULT 0,
  `job`           VARCHAR(50) DEFAULT 'Безработный',
  `skin_id`       INT DEFAULT 0,
  `last_server`   VARCHAR(50) DEFAULT 'Moskva RP #1',
  `last_login`    DATETIME DEFAULT NULL,
  `created_at`    DATETIME DEFAULT NOW(),
  INDEX idx_token (`token`),
  INDEX idx_nick  (`nick`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Тестовый аккаунт: nick=Admin, pass=admin123
INSERT IGNORE INTO `players` (nick, email, password_hash, level, money, bank, admin_level)
VALUES ('Admin', 'admin@moskva-rp.ru',
  SHA2(CONCAT('admin123','mrp_2025'), 256),
  99, 9999999, 9999999, 6);
