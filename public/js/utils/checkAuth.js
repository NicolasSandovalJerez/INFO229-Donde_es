// Verificar autenticación inmediatamente
if (!localStorage.getItem("userId")) {
	window.location.href = "/index.html";
}
