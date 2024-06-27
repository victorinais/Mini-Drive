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
        [Route("api/files")]
        public IActionResult GetAllFiles()
        {
            var files = _fileRepository.GetAll();
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