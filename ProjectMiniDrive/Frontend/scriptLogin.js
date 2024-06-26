document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5231/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const messageDiv = document.getElementById("message");
    if (response.ok) {
        const data = await response.json();
        messageDiv.textContent = "Inicio de sesión exitoso. Redirigiendo...";
        messageDiv.style.color = "green";

        // Guardar el token en el almacenamiento local
        localStorage.setItem("token", data.token);

        // Redirigir después de 1 segundo al Dashboard
        setTimeout(() => {
            window.location.href = "dashboard.html"; // Página de redirección después del inicio de sesión
        }, 1000);
    } else {
        const errorText = await response.text();
        messageDiv.textContent = `Error: ${errorText}`;
        messageDiv.style.color = "red";
    }
});

