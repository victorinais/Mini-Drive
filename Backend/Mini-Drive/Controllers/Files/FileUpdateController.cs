using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Mini_Drive.Services.Files;
using ModelFile = Mini_Drive.Models.File;

namespace Mini_Drive.Controllers.Files
{
    public class FileUpdateController : ControllerBase
    {
        private readonly IFileRepository _fileRepository;
        public FileUpdateController(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        [HttpPut]
        [Route("api/files/update/{id}")]
        public IActionResult UpdateFile(int id, [FromBody] ModelFile file)
        {
            if (file == null || file.Id != id)
            {
                return BadRequest("Datos de archivo inválidos.");
            }

            var updatedFile = _fileRepository.GetById(id);
            if (file == null)
            {
                return NotFound("Archivo no encontrado.");
            }

            updatedFile.Name = file.Name;
            updatedFile.Path = file.Path;
            updatedFile.Type = file.Type;
            updatedFile.Size = file.Size;
            updatedFile.FolderId = file.FolderId;

            _fileRepository.Update(file);
            return Ok(new { message = "El archivo se actualizó exitosamente."});
        }
    }
}