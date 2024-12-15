export const debounce = (fn, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

export const handleAPIError = (error) => {
	console.error("Error API:", error);
	if (error.response?.status === 401) {
		localStorage.removeItem("token");
		window.location.href = "/components/login.html";
	} else {
		showErrorNotification(error.message);
	}
};

export const showErrorNotification = (message) => {
	// Implementar lógica de notificación
	alert(message); // Temporal - Mejorar con una UI más amigable
};

export const validateEventForm = (data) => {
	const errors = [];
	if (!data.title?.trim()) errors.push("El título es requerido");
	if (!data.description?.trim()) errors.push("La descripción es requerida");
	if (!isValidDate(data.start_date)) errors.push("Fecha de inicio inválida");
	if (!isValidDate(data.end_date)) errors.push("Fecha de fin inválida");
	if (!data.location_name?.trim()) errors.push("La ubicación es requerida");
	return errors;
};

export const isValidDate = (dateString) => {
	const date = new Date(dateString);
	return date instanceof Date && !isNaN(date);
};
