--CREATE EXTENSION IF NOT EXISTS cube;
--CREATE EXTENSION IF NOT EXISTS earthdistance;
--CREATE INDEX idx_events_location ON events USING gist (ll_to_earth(latitude, longitude));

-- Crear tipos enumerados
CREATE TYPE user_role AS ENUM ('common', 'admin');
CREATE TYPE event_status AS ENUM ('active', 'cancelled', 'finished');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');

-- Crear tablas

-- Tabla de usuarios
CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
role user_role DEFAULT 'common',
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
last_login TIMESTAMP WITH TIME ZONE,
is_active BOOLEAN DEFAULT true
);

-- Tabla de perfiles de usuario
CREATE TABLE user_profiles (
profile_id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
full_name VARCHAR(100),
bio TEXT,
avatar_url VARCHAR(255),
phone VARCHAR(20),
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de eventos
CREATE TABLE events (
event_id SERIAL PRIMARY KEY,
creator_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
title VARCHAR(100) NOT NULL,
description TEXT,
location_name VARCHAR(255) NOT NULL,
latitude DECIMAL(10, 8) NOT NULL,
longitude DECIMAL(11, 8) NOT NULL,
start_date TIMESTAMP WITH TIME ZONE NOT NULL,
end_date TIMESTAMP WITH TIME ZONE NOT NULL,
status event_status DEFAULT 'active',
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
max_participants INTEGER,
is_private BOOLEAN DEFAULT false
);

-- Tabla de participantes de eventos
CREATE TABLE event_participants (
event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (event_id, user_id)
);

-- Tabla de comentarios
CREATE TABLE comments (
comment_id SERIAL PRIMARY KEY,
event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
content TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
is_deleted BOOLEAN DEFAULT false
);

-- Tabla de denuncias
CREATE TABLE reports (
report_id SERIAL PRIMARY KEY,
reporter_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
reason TEXT NOT NULL,
status report_status DEFAULT 'pending',
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
resolved_at TIMESTAMP WITH TIME ZONE,
resolved_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL
);

-- Tabla de mensajes directos
CREATE TABLE direct_messages (
message_id SERIAL PRIMARY KEY,
sender_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
receiver_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
content TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
read_at TIMESTAMP WITH TIME ZONE,
is_deleted BOOLEAN DEFAULT false
);

-- Crear índices
CREATE INDEX idx_events_location ON events USING gist (
ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_messages_users ON direct_messages(sender_id, receiver_id);
CREATE INDEX idx_reports_status ON reports(status);