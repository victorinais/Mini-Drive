document.addEventListener("DOMContentLoaded", function() {
    const createFolderBtn = document.getElementById('createFolderBtn');
    const createFolderModal = document.getElementById('createFolderModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const createFolderForm = document.getElementById('createFolderForm');
    const createFileForm = document.getElementById('createFileForm');
    const foldersContainer = document.getElementById('foldersContainer');
    const filesContainer = document.getElementById('filesContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    const API_BASE_URL = 'http://localhost:5231/api'; // Ruta actualizada
    const TOKEN = 'Bearer ' + localStorage.getItem("token"); // Reemplaza con el token real

    // Open the modal
    createFolderBtn.onclick = function() {
        createFolderModal.style.display = "block";
    }

    // Close the modal
    Array.from(closeModal).forEach(element => {
        closeModal.onclick = function() {
            createFolderModal.style.display = "none";
            createFileModal.style.display = "none";
        }
    });
    

    // Close the modal if clicked outside of it
    window.onclick = function(event) {
        if (event.target === createFolderModal) {
            createFolderModal.style.display = "none";
        }
        if (event.target === createFileModal) {
            createFileModal.style.display = "none";
        }
    }

    // Create folder form submission
    createFolderForm.onsubmit = async function(event) {
        event.preventDefault();

        const folderName = document.getElementById('folderName').value;

        const response = await fetch(`${API_BASE_URL}/create`, {
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

     // Create file form submission
     createFileForm.onsubmit = async function(event) {
        event.preventDefault();

        const fileName = document.getElementById('fileName').value;
        const filePath = document.getElementById('filePath').value;
        const fileType = document.getElementById('fileType').value;
        const fileSize = document.getElementById('fileSize').value;

        const response = await fetch(`${API_BASE_URL}/files/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': TOKEN
            },
            body: JSON.stringify({ name: fileName, path: filePath, type: fileType, size: fileSize, folderId: selectedFolderId })
        });

        if (response.ok) {
            alert('Archivo creado con éxito.');
            createFileModal.style.display = "none";
            fetchFolders(); // Refresh folder list
        } else {
            const errorText = await response.text();
            alert(`Error: ${errorText}`);
        }
    }

    // Fetch and display folders
    async function fetchFolders() {
        const response = await fetch(`${API_BASE_URL}/folders`, {
            headers: {
                'Authorization': TOKEN
            }
        });

        if (response.ok) {
            const folders = await response.json();
            renderFolders(folders);
        } else {
            const errorText = await response.text();
            alert(`Error fetching folders: ${errorText}`);
        }
    }

    // Render folders
    function renderFolders(folders) {
        foldersContainer.innerHTML = '';
        filesContainer.innerHTML = '';

        folders.forEach(folder => {
            const folderDiv = document.createElement('div');
            folderDiv.className = 'folder';
            folderDiv.innerHTML = `
                <span>${folder.name}</span>
                <div class="folder-options">
                    <button class="options-btn">...</button>
                    <div class="options-menu" style="display: none;">
                        <button class="create-file-btn">Crear Archivo</button>
                    </div>
                </div>
            `;
            folderDiv.querySelector('.options-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                const menu = folderDiv.querySelector('.options-menu');
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            });
            folderDiv.querySelector('.create-file-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                selectedFolderId = folder.id;
                createFileModal.style.display = 'block';
            });
            folderDiv.addEventListener('click', () => {
                selectedFolderId = folder.id;
                showFiles(folder);
            });
            foldersContainer.appendChild(folderDiv);
        });
    }

    // Show files inside a folder
    function showFiles(folder) {
        filesContainer.innerHTML = '';

        if (folder.files && folder.files.length > 0) {
            folder.files.forEach(file => {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'file';
                fileDiv.textContent = file.name;
                filesContainer.appendChild(fileDiv);
            });
        }
    
        if (folder.subFolders && folder.subFolders.length > 0) {
            folder.subFolders.forEach(subFolder => {
                const subFolderDiv = document.createElement('div');
                subFolderDiv.className = 'sub-folder';
                subFolderDiv.textContent = subFolder.name;
                subFolderDiv.addEventListener('click', () => showFiles(subFolder));
                filesContainer.appendChild(subFolderDiv);
            });
        }
    }

    // Log out button
    logoutBtn.onclick = function() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem("token");
            // Clear the token or handle other logout logic
            //alert('Logged out');
            window.location.href = 'Index.html'; // Redirect to index.html
        }
    }

    // Initial fetch of folders
    fetchFolders();
});
