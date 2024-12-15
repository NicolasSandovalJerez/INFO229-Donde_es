// public/js/components/logout.js
import { logout, displayUserId } from "../utils/auth.js";

document.addEventListener("DOMContentLoaded", () => {
	displayUserId(); // Mostrar userId al cargar

	const logoutBtn = document.querySelector(".logout-btn");
	if (logoutBtn) {
		logoutBtn.addEventListener("click", (e) => {
			e.preventDefault();
			logout();
		});
	}
});
