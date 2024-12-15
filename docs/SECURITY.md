# Guía de Seguridad

## Autenticación

- JWT con expiración 24h
- Passwords hasheados (bcrypt)
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
