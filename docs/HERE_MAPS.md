# Integración HERE Maps

## Configuración

```javascript
const platform = new H.service.Platform({
	apikey: process.env.HERE_MAPS_API_KEY,
});
```

## Servicios Utilizados

- Autosuggest API
- Geocoding API
- Distance Matrix API

## Implementaciones

Búsqueda de Lugares

```javascript
searchService.autosuggest({
	q: query,
	at: "-39.81937,-73.24574", // Centro en Valdivia
});
```

## Cálculo de Distancias

Fórmula Haversine implementada en utils/helpers.js
