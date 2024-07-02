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
         public IActionResult CreateFile([FromBody] ModelFile file)
        {
            if (file == null)
            {
                return BadRequest("Datos de archivo inválidos.");
            }

            _fileRepository.Add(file);
            return Ok(new { message = "Archivo creado con éxito.", file });
        }
    }
}