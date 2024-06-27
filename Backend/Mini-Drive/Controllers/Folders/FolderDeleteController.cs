using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Services.Folders;

namespace Mini_Drive.Controllers.Folders
{
    public class FolderDeleteController : ControllerBase
    {
        private readonly IFolderRepository _folderRepository;
        public FolderDeleteController(IFolderRepository folderRepository)
        {
            _folderRepository = folderRepository;
        }

        [HttpDelete]
        [Route("api/delete/{id}")]
        public IActionResult DeleteFolder(int id)
        {
            var folder = _folderRepository.GetById(id);
            if (folder == null)
            {
                return NotFound(new { message = "Carpeta no encontrada." });
            }

            _folderRepository.Delete(id);
            return Ok(new { message = "La carpeta se eliminó exitosamente." });
        }

    }
}