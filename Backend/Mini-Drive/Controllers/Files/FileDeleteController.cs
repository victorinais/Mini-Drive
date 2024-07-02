using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Services.Files;

namespace Mini_Drive.Controllers.Files
{
    [ApiController]
    [Route("api/files")]
    public class FileDeleteController : ControllerBase
    {
        private readonly IFileRepository _fileRepository;
        public FileDeleteController(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult DeleteFile(int id)
        {
            var file = _fileRepository.GetById(id);
            if (file == null)
            {
                return NotFound(new { message = "Archivo no encontrado." });
            }

            _fileRepository.Delete(id);
            return Ok(new { message = "El archivo se eliminó exitosamente."});
        }
    }
}