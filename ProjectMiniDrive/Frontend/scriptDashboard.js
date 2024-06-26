document.addEventListener("DOMContentLoaded", function() {
    const createFolderBtn = document.getElementById('createFolderBtn');
    const createFolderModal = document.getElementById('createFolderModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const createFolderForm = document.getElementById('createFolderForm');
    const foldersContainer = document.getElementById('foldersContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    const API_BASE_URL = 'http://localhost:5231/api/create'; // Ruta actualizada
    const TOKEN = 'Bearer ' + localStorage.getItem("token"); // Reemplaza con el token real

    // Open the modal
    createFolderBtn.onclick = function() {
        createFolderModal.style.display = "block";
    }

    // Close the modal
    closeModal.onclick = function() {
        createFolderModal.style.display = "none";
    }

    // Close the modal if clicked outside of it
    window.onclick = function(event) {
        if (event.target === createFolderModal) {
            createFolderModal.style.display = "none";
        }
    }

    // Create folder form submission
    createFolderForm.onsubmit = async function(event) {
        event.preventDefault();

        const folderName = document.getElementById('folderName').value;

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': TOKEN
            },
            body: JSON.stringify({ name: folderName, parentFolderId: null })
        });

        if (response.ok) {
            alert('Carpeta creada con éxito.');
            createFolderModal.style.display = "none";
            fetchFolders(); // Refresh folder list
        } else {
            const errorText = await response.text();
            alert(`Error: ${errorText}`);
        }
    }

    // Fetch and display folders
    async function fetchFolders() {
        const response = await fetch(API_BASE_URL, {
            headers: {
                'Authorization': TOKEN
            }
        });

        const folders = await response.json();
        foldersContainer.innerHTML = '';

        folders.forEach(folder => {
            const folderDiv = document.createElement('div');
            folderDiv.className = 'folder';
            folderDiv.textContent = folder.name;
            foldersContainer.appendChild(folderDiv);
        });
    }

    // Log out button
    logoutBtn.onclick = function() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            // Clear the token or handle other logout logic
            //alert('Logged out');
            window.location.href = 'index.html'; // Redirect to index.html
        }
    }

    // Initial fetch of folders
    fetchFolders();
});
