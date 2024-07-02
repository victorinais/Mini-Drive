using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Services.Files;
using Mini_Drive.Services.Folders;

namespace Mini_Drive.Controllers.Folders
{
    [ApiController]
    [Route("api/folders")]
    public class FolderDeleteController : ControllerBase
    {
        private readonly IFolderRepository _folderRepository;
        private readonly IFileRepository _fileRepository;
        public FolderDeleteController(IFolderRepository folderRepository, IFileRepository fileRepository)
        {
            _folderRepository = folderRepository;
            _fileRepository = fileRepository;
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult DeleteFolder(int id)
        {
            var folder = _folderRepository.GetById(id);
            if (folder == null)
            {
                return NotFound(new { message = "Carpeta no encontrada." });
            }

            // Elimina todos los archivos de la carpeta
            var files = _fileRepository.GetFilesByFolderId(id);
            foreach (var file in files)
            {
                _fileRepository.Delete(file.Id);
            }

            // Luego elimina la carpeta
            _folderRepository.Delete(id);
            return Ok(new { message = "La carpeta y sus archivos se eliminaron exitosamente." });
        }

    }
}