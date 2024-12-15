import { EventManager } from "../services/EventManager.js";

document.addEventListener("DOMContentLoaded", async () => {
	const eventManager = new EventManager();
	const eventGrid = document.querySelector(".event-grid");

	const userId = localStorage.getItem("userId");

	if (!userId) {
		console.error("No se encontró el userId en el localStorage");
		return;
	}

	try {
		const events = await eventManager.fetchEventsByUser(userId);

		if (events.length === 0) {
			eventGrid.innerHTML = "<p>No has creado ningún evento.</p>";
			return;
		}

		events.forEach((event) => {
			const eventCard = document.createElement("div");
			eventCard.classList.add("event-card");

			const eventTitle = document.createElement("h4");
			eventTitle.textContent = event.title;

			const eventDetails = document.createElement("div");
			eventDetails.classList.add("event-details");

			const eventDate = document.createElement("p");
			eventDate.textContent = `Fecha: ${new Date(
				event.start_date
			).toLocaleDateString()}`;

			const eventLocation = document.createElement("p");
			eventLocation.textContent = `Lugar: ${event.location_name}`;

			eventDetails.appendChild(eventDate);
			eventDetails.appendChild(eventLocation);

			const eventActions = document.createElement("div");
			eventActions.classList.add("event-actions");

			const editButton = document.createElement("button");
			editButton.classList.add("event-btn", "edit");
			editButton.textContent = "Editar";
			// Agrega funcionalidad de edición si es necesario

			const detailsButton = document.createElement("button");
			detailsButton.classList.add("event-btn");
			detailsButton.textContent = "Detalles";
			// Agrega funcionalidad para mostrar detalles

			eventActions.appendChild(editButton);
			eventActions.appendChild(detailsButton);

			eventCard.appendChild(eventTitle);
			eventCard.appendChild(eventDetails);
			eventCard.appendChild(eventActions);

			eventGrid.appendChild(eventCard);
		});
	} catch (error) {
		console.error("Error al obtener los eventos del usuario:", error);
		eventGrid.innerHTML = "<p>Error al cargar los eventos.</p>";
	}
});
