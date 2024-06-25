document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5231/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            localStorage.setItem('registrationMessage', 'Registro exitoso.');
            localStorage.setItem('messageColor', 'green');
        } else {
            const errorText = await response.text();
            localStorage.setItem('registrationMessage', `Error: ${errorText}`);
            localStorage.setItem('messageColor', 'red');
        }
        location.reload();
    } catch (error) {
        console.error("Error:", error);
        localStorage.setItem('registrationMessage', `Error: ${error.message}`);
        localStorage.setItem('messageColor', 'red');
        location.reload();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const messageDiv = document.getElementById("message");
    const message = localStorage.getItem('registrationMessage');
    const messageColor = localStorage.getItem('messageColor');

    if (message) {
        messageDiv.textContent = message;
        messageDiv.style.color = messageColor;
        localStorage.removeItem('registrationMessage');
        localStorage.removeItem('messageColor');
    }
});
