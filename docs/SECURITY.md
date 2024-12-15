# Guía de Seguridad

## Autenticación

- JWT con expiración 24h
```javascript
// auth.js
const jwt = require('jsonwebtoken');

// Generar token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
```
- Passwords hasheados (bcrypt)
```javascript
// users.js
const bcrypt = require('bcrypt');

// Hashear contraseña
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verificar contraseña
const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
```

- Validación de emails

## Rate Limiting

```javascript
// Login/Register
windowMs: 15 * 60 * 1000, // 15 min
max: 5 // intentos

// API General
windowMs: 15 * 60 * 1000,
max: 100
```

## Validaciones

- SQL Injection: Parametrized queries
- XSS: Input sanitization
- CSRF: Token validation
