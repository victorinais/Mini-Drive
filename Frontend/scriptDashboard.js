if (!sessionStorage.getItem("loggedIn")) {
    window.location.href = "index.html"; // Redirige a la página de inicio de sesión si no hay sesión iniciada
}

document.addEventListener("DOMContentLoaded", function () {
    const createFolderBtn = document.getElementById("createFolderBtn");
    const createFolderModal = document.getElementById("createFolderModal");
    const closeModal = document.getElementsByClassName("close");
    const createFolderForm = document.getElementById("createFolderForm");
    const createFileForm = document.getElementById("createFileForm");
    const foldersContainer = document.getElementById("foldersContainer");
    const filesContainer = document.getElementById("filesContainer");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
    const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");

    const API_BASE_URL = "http://localhost:5231/api"; // Ruta actualizada
    const TOKEN = "Bearer " + localStorage.getItem("token"); // Reemplaza con el token real

    let selectedFolderId = null;

    // Abrir el modal
    // Verifica que los elementos existan antes de usarlos
    if (createFolderBtn) {
        createFolderBtn.onclick = function () {
            createFolderModal.style.display = "block";
        };
    }

    // Cerrar el modal
    if (closeModal.length) {
        Array.from(closeModal).forEach((element) => {
            element.onclick = function () {
                createFolderModal.style.display = "none";
                createFileModal.style.display = "none";
                logoutModal.style.display = "none";
            };
        });
    }

    // Cerrar el modal si se hace clic fuera de él
    window.onclick = function (event) {
        if (event.target === createFolderModal) {
            createFolderModal.style.display = "none";
        }
        if (event.target === createFileModal) {
            createFileModal.style.display = "none";
        }
        if (event.target === logoutModal) {
            logoutModal.style.display = "none";
        }
    };

    // Crear modal de formulario de carpeta
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

    // Crear modal de formulario de archivo
    if (createFileForm) {
        createFileForm.onsubmit = async function (event) {
            event.preventDefault();
            const fileName = document.getElementById("fileName").value;
            const filePath = document.getElementById("filePath").value;
            const fileType = document.getElementById("fileType").value;
            const fileSize = document.getElementById("fileSize").value;

            const response = await fetch(`${API_BASE_URL}/files/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: TOKEN,
                },
                body: JSON.stringify({
                    name: fileName,
                    path: filePath,
                    type: fileType,
                    size: fileSize,
                    folderId: selectedFolderId,
                }),
            });

            if (response.ok) {
                showSuccess("¡Archivo creado con éxito!.");
                createFileModal.style.display = "none";
                fetchFolders();
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
                        <button class="create-folder-btn">Crear Carpeta</button>
                        <button class="create-file-btn">Crear Archivo</button>
                        <button class="delete-folder-btn">Eliminar Carpeta</button>
                    </div>
                </div>
            `;
            // Verifica que los botones existan antes de agregarles eventos
            const optionsBtn = folderDiv.querySelector(".options-btn");
            const createFileBtn = folderDiv.querySelector(".create-file-btn");
            const deleteFolderBtn = folderDiv.querySelector(".delete-folder-btn");

            if (optionsBtn) {
                optionsBtn.addEventListener("click", (event) => {
                    event.stopPropagation();
                    const menu = folderDiv.querySelector(".options-menu");
                    if (menu) {
                        menu.style.display = menu.style.display === "none" ? "block" : "none";
                    }
                });
            }

            if (createFileBtn) {
                createFileBtn.addEventListener("click", (event) => {
                    event.stopPropagation();
                    selectedFolderId = folder.id;
                    createFileModal.style.display = "block";
                });
            }

            if (deleteFolderBtn) {
                deleteFolderBtn.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    if (confirm("¿Estás seguro de que quieres eliminar esta carpeta?")) {
                        await deleteFolder(folder.id);
                    }
                });
            }

            folderDiv.addEventListener("click", async () => {
                selectedFolderId = folder.id;
                const files = await fetchFiles(selectedFolderId);
                renderFiles(files);
            });
            foldersContainer.appendChild(folderDiv);
        });
    }

    // Renderizar archivos
    function renderFiles(files) {
        filesContainer.innerHTML = "";

        if (files && files.length > 0) {
            files.forEach((file) => {
                const fileDiv = document.createElement("div");
                fileDiv.className = "file";
                fileDiv.innerHTML = `
                <span>${file.name}</span>
                <button class="delete-file-btn">Eliminar</button
                `;

                const deleteFileBtn = fileDiv.querySelector(".delete-file-btn");

                if (deleteFileBtn) {
                    deleteFileBtn.addEventListener("click", async (event) => {
                        event.stopPropagation();
                        if (confirm("¿Estás seguro de que quieres eliminar este archivo?")) {
                            await deleteFile(file.id);
                        }
                    });
                }
                filesContainer.appendChild(fileDiv);
            });
        }
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

    // botón Cerrar sesión
    logoutBtn.onclick = function () {
        if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
            localStorage.removeItem("token");
            window.location.href = "index.html"; // Redirect to index.html
        }
    };

    // Mostrar el modal de confirmación de cierre de sesión
    logoutBtn.onclick = function () {
        logoutModal.style.display = "block";
    };

    // Confirmar cierre de sesión
    confirmLogoutBtn.onclick = function () {
        localStorage.removeItem("token");
        sessionStorage.removeItem("loggedIn"); // Remove loggedIn flag from sessionStorage
        window.location.href = "index.html"; // Redirigir a index.html
    };

    // Cancelar cierre de sesión
    cancelLogoutBtn.onclick = function () {
        logoutModal.style.display = "none";
    };

    // Búsqueda inicial de carpetas
    fetchFolders();
});
