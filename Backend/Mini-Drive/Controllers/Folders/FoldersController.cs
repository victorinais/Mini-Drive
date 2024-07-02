using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Services.Folders;
using Mini_Drive.Services.Users;

namespace Mini_Drive.Controllers.Folders
{
    public class FoldersController : ControllerBase
    {
        private readonly IFolderRepository _folderRepository;
        private readonly IUserRepository _userRepository;
        public FoldersController(IFolderRepository folderRepository, IUserRepository userRepository)
        {
            _folderRepository = folderRepository;
            _userRepository = userRepository;
        }

        [Authorize]
        [HttpGet]
        [Route("api/folders")]
        public IActionResult GetUserFoldersAndFiles()
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

            var folders = _folderRepository.GetByUserIdWithFiles(userId);
            return Ok(folders);
        }
    }
}