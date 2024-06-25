using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Services.Users;

namespace Mini_Drive.Controllers.Users
{
    public class UserDeleteController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UserDeleteController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpDelete]
        [Route("api/delete/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _userRepository.GetById(id);

            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado." });
            }

            _userRepository.Delete(id);
            
            return Ok(new { message = "El usuario se eliminó exitosamente."});
        }
    }
}