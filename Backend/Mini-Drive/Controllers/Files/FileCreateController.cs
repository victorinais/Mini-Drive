using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Services.Files;
using Mini_Drive.Services.Folders;
using ModelFile = Mini_Drive.Models.File;

namespace Mini_Drive.Controllers.Files
{
    [ApiController]
    [Route("api/files")]
    public class FileCreateController : ControllerBase
    {
        private readonly IFileRepository _fileRepository;
        private readonly IFolderRepository _folderRepository;
        public FileCreateController(IFileRepository fileRepository, IFolderRepository folderRepository)
        {
            _fileRepository = fileRepository;
            _folderRepository = folderRepository;
        }

        [HttpPost("create")]
        public IActionResult CreateFile([FromForm] IFormFile file, [FromForm] int folderId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Archivo no válido.");
            }

            var folder = _folderRepository.GetById(folderId);
            if (folder == null)
            {
                return BadRequest("Carpeta no válida.");
            }

            // Define the path where the file will be saved
            var storagePath = Path.Combine("path", "to", "save"); // Actualiza esta ruta según tu lógica de almacenamiento

            // Create the directory if it doesn't exist
            if (!Directory.Exists(storagePath))
            {
                Directory.CreateDirectory(storagePath);
            }

            var filePath = Path.Combine(storagePath, file.FileName);

            try
            {
                // Guardar el archivo en el sistema de archivos
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                // Guardar la información del archivo en la base de datos
                var modelFile = new ModelFile
                {
                    Name = file.FileName,
                    Path = filePath,
                    Type = file.ContentType,
                    Size = file.Length,
                    FolderId = folderId
                };

                _fileRepository.Add(modelFile);

                return Ok(new { message = "Archivo creado con éxito.", file = modelFile });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al subir el archivo.");
            }
        }
    }
}