document.addEventListener("DOMContentLoaded", function () {
    const createFolderBtn = document.getElementById("createFolderBtn");
    const createFolderModal = document.getElementById("createFolderModal");
    const closeModal = document.getElementsByClassName("close");
    const createFolderForm = document.getElementById("createFolderForm");
    const foldersContainer = document.getElementById("foldersContainer");
    const filesContainer = document.getElementById("filesContainer");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
    const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
    const uploadFileModal = document.getElementById("uploadFileModal");
    const uploadFileForm = document.getElementById("uploadFileForm");

    const API_BASE_URL = "http://localhost:5231/api"; // Ruta actualizada
    const TOKEN = "Bearer " + localStorage.getItem("token"); // Reemplaza con el token real

    // Verifica si el usuario está autenticado
    const isLoggedIn = localStorage.getItem("loggedin") === "true";

    if (!isLoggedIn) {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        window.location.href = "login.html";
    }

    let selectedFolderId = null;

    // Mostrar el nombre del usuario
    const usernameDisplay = document.getElementById("usernameDisplay");
    const username = localStorage.getItem("username");
    if (username) {
        usernameDisplay.textContent = `${username}`;
    }

    // Abrir el modal para crear carpeta
    if (createFolderBtn) {
        createFolderBtn.onclick = function () {
            createFolderModal.style.display = "block";
        };
    }

    // Cerrar los modales
    if (closeModal.length) {
        Array.from(closeModal).forEach((element) => {
            element.onclick = function () {
                createFolderModal.style.display = "none";
                logoutModal.style.display = "none";
                uploadFileModal.style.display = "none";
            };
        });
    }

    // Cerrar el modal si se hace clic fuera de él
    window.onclick = function (event) {
        if (event.target === createFolderModal) {
            createFolderModal.style.display = "none";
        }
        if (event.target === uploadFileModal) {
            uploadFileModal.style.display = "none";
        }
        if (event.target === logoutModal) {
            logoutModal.style.display = "none";
        }
    };

    // Crear carpeta
    if (createFolderForm) {
        createFolderForm.onsubmit = async function (event) {
            event.preventDefault();
            const folderName = document.getElementById("folderName").value;
            const response = await fetch(`${API_BASE_URL}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: TOKEN,
                },
                body: JSON.stringify({ name: folderName, parentFolderId: null }),
            });

            if (response.ok) {
                showSuccess("¡Carpeta creada con éxito!.");
                createFolderModal.style.display = "none";
                fetchFolders();
            } else {
                const errorText = await response.text();
                showError(`Error: ${errorText}`);
            }
        };
    }

    // Subir archivo
    if (uploadFileForm) {
        uploadFileForm.onsubmit = async function (event) {
            event.preventDefault();
            const fileInput = document.getElementById("fileInput").files[0];
            if (!fileInput) {
                showError("Por favor, selecciona un archivo.");
                return;
            }

            const formData = new FormData();
            formData.append("file", fileInput);
            formData.append("folderId", selectedFolderId);

            const response = await fetch(`${API_BASE_URL}/files/create`, {
                method: "POST",
                headers: {
                    Authorization: TOKEN,
                },
                body: formData,
            });

            if (response.ok) {
                showSuccess("¡Archivo subido con éxito!.");
                //Ocultar la lista de archivos modales y actualizar
                uploadFileModal.style.display = "none";
                const files = await fetchFiles(selectedFolderId);
                renderFiles(files);
            } else {
                const errorText = await response.text();
                showError(`Error: ${errorText}`);
            }
        };
    }

    // Recuperar y mostrar las carpetas
    async function fetchFolders() {
        const response = await fetch(`${API_BASE_URL}/folders`, {
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.ok) {
            const folders = await response.json();
            renderFolders(folders);
        } else {
            const errorText = await response.text();
            showError(`Error: ${errorText}`);
        }
    }

    // Recuperar archivos por ID de carpeta
    async function fetchFiles(folderId) {
        const response = await fetch(`${API_BASE_URL}/files/folder/${folderId}`, {
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorText = await response.text();
            showError(`Error: ${errorText}`);
            return [];
        }
    }

    // Renderizar carpetas
    function renderFolders(folders) {
        foldersContainer.innerHTML = "";
        filesContainer.innerHTML = "";

        folders.forEach((folder) => {
            const folderDiv = document.createElement("div");
            folderDiv.className = "folder";
            folderDiv.innerHTML = `
                <span>${folder.name}</span>
                <div class="folder-options">
                    <button class="options-btn">...</button>
                    <div class="options-menu" style="display: none;">
                        <button class="uploadFileBtn">Subir Archivos</button>
                        <button class="delete-folder-btn">Eliminar Carpeta</button>
                    </div>
                </div>
            `;

            const optionsBtn = folderDiv.querySelector(".options-btn");
            const optionsMenu = folderDiv.querySelector(".options-menu");
            const uploadFileBtn = folderDiv.querySelector(".uploadFileBtn");
            const deleteFolderBtn = folderDiv.querySelector(".delete-folder-btn");

            optionsBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                optionsMenu.style.display = optionsMenu.style.display === "none" ? "block" : "none";
            });

            uploadFileBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                selectedFolderId = folder.id;
                uploadFileModal.style.display = "block";
            });

            deleteFolderBtn.addEventListener("click", async (event) => {
                event.stopPropagation();
                if (confirm("¿Estás seguro de que quieres eliminar esta carpeta?")) {
                    await deleteFolder(folder.id);
                }
            });

            foldersContainer.appendChild(folderDiv);
        });
    }

    // Renderizar archivos
    function renderFiles(files) {
        filesContainer.innerHTML = "";

        files.forEach((file) => {
            const fileDiv = document.createElement("div");
            fileDiv.className = "file";
            fileDiv.innerHTML = `
                <span>${file.name}</span>
                <button class="delete-file-btn" data-file-id="${file.id}">Eliminar Archivo</button>
            `;

            const deleteFileBtn = fileDiv.querySelector(".delete-file-btn");
            deleteFileBtn.addEventListener("click", async () => {
                if (confirm("¿Estás seguro de que quieres eliminar este archivo?")) {
                    await deleteFile(file.id);
                }
            });

            filesContainer.appendChild(fileDiv);
        });
    }

    // Eliminar carpeta
    async function deleteFolder(folderId) {
        const response = await fetch(`${API_BASE_URL}/folders/delete/${folderId}`, {
            method: "DELETE",
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.ok) {
            showSuccess("La carpeta se eliminó exitosamente.");
            fetchFolders();
        } else {
            const errorText = await response.text();
            showError(`Error: ${errorText}`);
        }
    }

    // Eliminar archivo
    async function deleteFile(fileId) {
        const response = await fetch(`${API_BASE_URL}/files/delete/${fileId}`, {
            method: "DELETE",
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.ok) {
            showSuccess("El archivo se eliminó exitosamente.");
            const files = await fetchFiles(selectedFolderId);
            renderFiles(files);
        } else {
            const errorText = await response.text();
            showError(`Error: ${errorText}`);
        }
    }

    // Mostrar mensajes de error
    function showError(message) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000); // Ocultar después de 3 segundos
    }

    // Mostrar mensajes de éxito
    function showSuccess(message) {
        const successMessage = document.getElementById("successMessage");
        successMessage.textContent = message;
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000); // Ocultar después de 3 segundos
    }

    // Mostrar el modal de confirmación de cierre de sesión
    logoutBtn.onclick = function () {
        logoutModal.style.display = "block";
    };

    // Confirmar cierre de sesión
    confirmLogoutBtn.onclick = function () {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("loggedin");
        window.location.href = "index.html"; // Redirigir a index.html
    };

    // Cancelar cierre de sesión
    cancelLogoutBtn.onclick = function () {
        logoutModal.style.display = "none";
    };

    // Búsqueda inicial de carpetas
    fetchFolders();
});
