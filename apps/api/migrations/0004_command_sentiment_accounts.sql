ALTER TABLE minecraft_actions ADD COLUMN sentiment TEXT NOT NULL DEFAULT 'good';

UPDATE users
SET role = 'user',
    name = 'Тестер',
    updated_at = CURRENT_TIMESTAMP
WHERE lower(email) = 'bogdan3000tm@gmail.com';

UPDATE users
SET role = 'admin',
    name = 'Разработчик',
    updated_at = CURRENT_TIMESTAMP
WHERE lower(email) = 'ihnatenko.bogdan@gmail.com';
