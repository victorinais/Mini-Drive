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
        public IActionResult GetFolders()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null)
            {
                return Unauthorized("Usuario no autenticado.");
            }

            int userId = int.Parse(userIdClaim.Value);
            var folders = _folderRepository.GetAll()
                .Where(f => f.UserId == userId);

            return Ok(folders);       
        }
    }
}