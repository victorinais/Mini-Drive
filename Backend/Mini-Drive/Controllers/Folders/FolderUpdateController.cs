using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Models;
using Mini_Drive.Services.Folders;

namespace Mini_Drive.Controllers.Folders
{
    public class FolderUpdateController : ControllerBase
    {
        private readonly IFolderRepository _folderRepository;
        public FolderUpdateController(IFolderRepository folderRepository)
        {
            _folderRepository = folderRepository;
        }

        [HttpPut]
        [Route("api/folders/update/{id}")]
        public IActionResult UpdateFolder(int id, [FromBody] Folder folder)
        {
            if (folder == null || folder.Id != id)
            {
                return BadRequest("ID de carpeta no coincide.");
            }

            var existingFolder = _folderRepository.GetById(id);
            if (existingFolder == null)
            {
                return NotFound("Carpeta no encontrada.");
            }

            existingFolder.Name = folder.Name;

            _folderRepository.Update(existingFolder);
            return Ok(new { message = "La carpeta se actualizó exitosamente."});
        }
    }
}