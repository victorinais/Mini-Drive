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

        const messageDiv = document.getElementById("message");
        if (response.ok) {
            messageDiv.textContent = "Registro exitoso.";
            messageDiv.className = "success";
        } else {
            const errorText = await response.text();
            messageDiv.textContent = `Error: ${errorText}`;
            messageDiv.className = "error";
        }
    } catch (error) {
        console.error("Error:", error);
        const messageDiv = document.getElementById("message");
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.className = "error";
    }
});

