export class EventManager {
	constructor() {
		this.events = [];
		this.baseUrl = "http://localhost:3000/api";
	}

	async fetchEvents() {
		try {
			const response = await fetch(`${this.baseUrl}/events`);
			if (!response.ok) throw new Error("Error al obtener eventos");
			this.events = await response.json();
			return this.events;
		} catch (error) {
			this.handleAPIError(error);
		}
	}
	async fetchEventsByUser(userId) {
		try {
			const response = await fetch(`${this.baseUrl}/events/user/${userId}`);
			if (!response.ok) throw new Error("Error al obtener los eventos del usuario");
			return await response.json();
		} catch (error) {
			this.handleAPIError(error);
		}
	}

	async createEvent(eventData) {
		try {
			const response = await fetch(`${this.baseUrl}/events`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(eventData),
			});
			if (!response.ok) throw new Error("Error al crear evento");
			return await response.json();
		} catch (error) {
			this.handleAPIError(error);
		}
	}

	sortByDistance(userLocation) {
		return this.events
			.map((event) => ({
				...event,
				distance: this.calculateDistance(
					userLocation.lat,
					userLocation.lon,
					event.latitude,
					event.longitude
				),
			}))
			.sort((a, b) => a.distance - b.distance);
	}

	calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371; // Radio de la Tierra en km
		const dLat = this.toRad(lat2 - lat1);
		const dLon = this.toRad(lon2 - lon1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRad(lat1)) *
				Math.cos(this.toRad(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	toRad(value) {
		return (value * Math.PI) / 180;
	}
}
