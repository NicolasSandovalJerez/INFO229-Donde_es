// public/js/utils/auth.js
export const checkAuth = () => {
	const userId = localStorage.getItem("userId");
	if (!userId) {
		window.location.href = "/index.html";
		return false;
	}
	return true;
};

export const logout = () => {
	localStorage.removeItem("userId");
	localStorage.removeItem("token");
	window.location.href = "/index.html";
};

export const displayUserId = () => {
	const userId = localStorage.getItem("userId");
	const display = document.getElementById("userId-display");
	if (display && userId) {
		display.textContent = `Usuario ID: ${userId}`;
	}
};
