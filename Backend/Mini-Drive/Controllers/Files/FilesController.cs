using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Services.Files;

namespace Mini_Drive.Controllers.Files
{
    public class FilesController : ControllerBase
    {
        private readonly IFileRepository _fileRepository;
        public FilesController(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        [HttpGet]
        [Route("api/files/folder/{folderId}")]
        public IActionResult GetFilesByFolderId(int folderId)
        {
            var files = _fileRepository.GetFilesByFolderId(folderId);
            if (files == null || !files.Any())
            {
                return NotFound("No se encontraron archivos para esta carpeta.");
            }
            return Ok(files);
        }


        [HttpGet]
        [Route("api/files/{id}")]
        public IActionResult GetFileById(int id)
        {
            var file = _fileRepository.GetById(id);
            if (file == null)
            {
                return NotFound("Archivo no encontrado.");
            }
            return Ok(file);
        }
    }
}