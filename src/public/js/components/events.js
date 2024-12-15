// Función para obtener la ubicación del usuario
function obtenerUbicacion() {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve({
						lat: position.coords.latitude,
						lon: position.coords.longitude,
					});
				},
				(error) => {
					reject("Error al obtener la ubicación: " + error.message);
				}
			);
		} else {
			reject("La geolocalización no es soportada por este navegador.");
		}
	});
}

// Función para calcular la distancia entre dos puntos geográficos usando la fórmula de Haversine
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

// Lógica para obtener los eventos y ordenarlos
document.addEventListener("DOMContentLoaded", async () => {
	try {
		// Obtener la ubicación del usuario
		const usuarioUbicacion = await obtenerUbicacion();

		// Mostrar las coordenadas del usuario en la consola
		console.log("Mi latitud:", usuarioUbicacion.lat);
		console.log("Mi longitud:", usuarioUbicacion.lon);

		const response = await fetch("http://localhost:3000/api/events"); // Ruta del backend para obtener eventos

		if (response.ok) {
			const events = await response.json(); // Los eventos se reciben como un array JSON
			const eventCardsContainer = document.querySelector(".event-cards");
			const modal = document.querySelector(".modal");
			const modalContent = document.querySelector(".modal-content");

			// Limpiar el contenedor antes de agregar nuevos eventos
			eventCardsContainer.innerHTML = "";

			// Calcular la distancia de cada evento desde la ubicación del usuario y ordenar los eventos
			const eventosConDistancia = events.map((event) => {
				const distancia = calcularDistancia(
					usuarioUbicacion.lat,
					usuarioUbicacion.lon,
					event.latitude,
					event.longitude
				);
				return { ...event, distancia };
			});

			// Ordenar los eventos por distancia (más cercanos primero)
			eventosConDistancia.sort((a, b) => a.distancia - b.distancia);

			// Crear una tarjeta para cada evento
			eventosConDistancia.forEach((event) => {
				const eventCard = document.createElement("div");
				eventCard.classList.add("event-card");

				const eventTitle = document.createElement("h3");
				eventTitle.textContent = event.title;

				const eventDescription = document.createElement("p");
				eventDescription.textContent = event.description;

				const eventButton = document.createElement("button");
				eventButton.classList.add("event-btn");
				eventButton.textContent = "Ver detalles";

				// Agregar evento al botón para abrir el modal con los detalles del evento
				eventButton.addEventListener("click", () => {
					modalContent.innerHTML = `
			  <span class="close-btn">&times;</span>
			  <h2>${event.title}</h2>
			  <p><strong>Descripción:</strong> ${event.description}</p>
			  <p><strong>Ubicación:</strong> ${event.location_name}</p>
			  <p><strong>Fecha de inicio:</strong> ${new Date(
					event.start_date
				).toLocaleString()}</p>
			  <p><strong>Fecha de fin:</strong> ${new Date(event.end_date).toLocaleString()}</p>
			  <p><strong>Participantes máximos:</strong> ${event.max_participants || "N/A"}</p>
			  <p><strong>Privado:</strong> ${event.is_private ? "Sí" : "No"}</p>
			  <p><strong>Coordenadas:</strong> Latitud: ${event.latitude}, Longitud: ${
						event.longitude
					}</p>
			`;

					// Mostrar el modal
					modal.style.display = "block";

					// Añadir funcionalidad al botón de cerrar
					modal.querySelector(".close-btn").addEventListener("click", () => {
						modal.style.display = "none";
					});

					// Cerrar el modal al hacer clic fuera del cuadro de contenido
					modal.addEventListener("click", (event) => {
						if (event.target === modal) {
							// Si el clic fue en el fondo del modal
							modal.style.display = "none";
						}
					});
				});

				// Agregar título, descripción y botón a la tarjeta
				eventCard.appendChild(eventTitle);
				eventCard.appendChild(eventDescription);
				eventCard.appendChild(eventButton);

				// Agregar la tarjeta al contenedor
				eventCardsContainer.appendChild(eventCard);
			});
		} else {
			console.error("Error al obtener los eventos");
		}
	} catch (error) {
		console.error("Error de conexión:", error);
	}
});
