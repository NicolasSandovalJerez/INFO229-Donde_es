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

Fórmula Haversine implementada

```javascript
function calcularDistancia(lat1, lon1, lat2, lon2) {
	const R = 6371; // Radio de la Tierra en kilómetros
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distancia = R * c; // Distancia en kilómetros
	return distancia;
}
```
