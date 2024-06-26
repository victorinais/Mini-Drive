using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Models;
using Mini_Drive.Services.Folders;
using Mini_Drive.Services.Users;

namespace Mini_Drive.Controllers.Folders
{
    public class FolderCreateController : ControllerBase
    {
        private readonly IFolderRepository _folderRepository;
        private readonly IUserRepository _userRepository;
        public FolderCreateController(IFolderRepository folderRepository, IUserRepository userRepository)
        {
            _folderRepository = folderRepository;
            _userRepository = userRepository;
        }

        //[Authorize]
        [HttpPost]
        [Route("api/create")]
        public IActionResult CreateFolder([FromBody] Folder folder)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null)
            {
                return Unauthorized("Usuario no autenticado.");
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest("Id de usuario no válido.");
            }

            var user = _userRepository.GetById(userId);
            if (user == null)
            {
                return Unauthorized("Usuario no encontrado.");
            }

            folder.UserId = userId;
            _folderRepository.Add(folder);

            return Ok(new { message = "Carpeta creada con éxito.", folder });
        }

        [HttpGet]
        [Route("userfolders")]
        public IActionResult GetUserFolders()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null)
            {
                return Unauthorized("Usuario no autenticado.");
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest("Id de usuario no válido.");
            }

            var folders = _folderRepository.GetByUserId(userId);
            return Ok(folders);
        }
    }
}