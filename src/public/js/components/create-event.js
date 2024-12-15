import { EventManager } from "../services/EventManager.js";
import { debounce, validateEventForm } from "../utils/helpers.js";
import { checkAuth } from "../utils/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
	if (!checkAuth()) return;
	const eventManager = new EventManager();

	// Obtener elementos del DOM
	const form = document.getElementById("create-event-form");
	const locationInput = document.getElementById("location");
	const autocompleteResults = document.getElementById("autocomplete-results");
	const latitudeInput = document.getElementById("latitude");
	const longitudeInput = document.getElementById("longitude");

	// Configurar HERE Maps
	let apiKey;
	try {
		const response = await fetch("http://localhost:3000/api/config");
		if (!response.ok) throw new Error("Error al obtener la clave de API");
		const config = await response.json();
		apiKey = config.HERE_MAPS_API_KEY;
		/* console.log("HERE Maps API Key obtenida correctamente:", apiKey) */
	} catch (error) {
		console.error("Error al cargar la configuración:", error);
		alert("Error al cargar la configuración. Contacte al administrador.");
		return;
	}

	const platform = new H.service.Platform({ apikey: apiKey });
	const searchService = platform.getSearchService();

	// Función de búsqueda de lugares mejorada
	const searchPlaces = async (query) => {
		console.log("Buscando:", query);
		if (query.length < 3) {
			autocompleteResults.innerHTML = "";
			return;
		}

		try {
			const result = await new Promise((resolve, reject) => {
				searchService.autosuggest(
					{
						q: query,
						at: "-39.81937,-73.24574", // Centro en Valdivia
					},
					resolve,
					reject
				);
			});

			displayAutocompleteResults(result.items);
		} catch (error) {
			console.error("Error en búsqueda:", error);
		}
	};

	const displayAutocompleteResults = (items) => {
		autocompleteResults.innerHTML = "";
		items.forEach((item) => {
			const div = document.createElement("div");
			div.className = "autocomplete-item";
			div.textContent = item.title;
			div.setAttribute("role", "option");
			div.addEventListener("click", () => selectLocation(item));
			autocompleteResults.appendChild(div);
		});
	};

	const selectLocation = (item) => {
		locationInput.value = item.title;
		latitudeInput.value = item.position.lat;
		longitudeInput.value = item.position.lng;
		autocompleteResults.innerHTML = "";
	};

	// Aplicar debounce a la búsqueda
	const debouncedSearch = debounce(searchPlaces, 300);
	locationInput.addEventListener("input", (e) => debouncedSearch(e.target.value));

	// Manejo del formulario
	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const eventData = {
			title: formData.get("title"),
			description: formData.get("description"),
			start_date: formData.get("start-date"),
			end_date: formData.get("end-date"),
			location_name: formData.get("location"),
			max_participants: formData.get("max-participants"),
			is_private: formData.get("is-private") === "on",
			latitude: formData.get("latitude"),
			longitude: formData.get("longitude"),
			creator_id: localStorage.getItem("userId"),
		};

		const errors = validateEventForm(eventData);
		if (errors.length > 0) {
			alert(errors.join("\n"));
			return;
		}

		try {
			const newEvent = await eventManager.createEvent(eventData);
			window.location.href = "/components/main.html";
		} catch (error) {
			console.error("Error al crear evento:", error);
		}
	});
});
