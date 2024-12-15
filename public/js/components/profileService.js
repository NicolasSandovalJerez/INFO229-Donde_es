document.addEventListener("DOMContentLoaded", () => {
	const profileForm = document.getElementById("profileForm");
	const errorMessage = document.getElementById("error-message"); // Asegúrate de que este ID exista en el HTML

	profileForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const userId = localStorage.getItem("user_id");
		if (!userId) {
			errorMessage.textContent =
				"No se encontró el ID de usuario. Por favor, inicia sesión.";
			return;
		}

		const formData = new FormData(profileForm);
		const profileData = {
			user_id: userId,
			full_name: formData.get("full_name"),
			bio: formData.get("bio"),
			avatar_url: formData.get("avatar_url"),
			phone: formData.get("phone"),
		};

		try {
			const response = await fetch("http://localhost:3000/api/submit-profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(profileData),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("userId", profileData.user_id);
				/* alert(data.message); */
				// Guardar la información del perfil en el localStorage
				/* localStorage.setItem("profile_id", data.profile_id); // Aquí guardas el ID del perfil
				localStorage.setItem("full_name", profileData.full_name);
				localStorage.setItem("bio", profileData.bio);
				localStorage.setItem("avatar_url", profileData.avatar_url);
				localStorage.setItem("phone", profileData.phone);
 */
				// Redirigir a otra página HTML después de que el perfil se suba correctamente
				window.location.href = "../../components/main.html"; // Cambia esta URL a la página que desees
			} else {
				const errorData = await response.json();
				errorMessage.textContent =
					errorData.message || "Error al guardar el perfil.";
			}
		} catch (error) {
			console.error("Error en la solicitud:", error);
			errorMessage.textContent = "Error en la conexión con el servidor.";
		}
	});
});
