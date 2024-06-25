using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Models;
using Mini_Drive.Services.Users;

namespace Mini_Drive.Controllers.Users
{
    public class UserUpdateController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UserUpdateController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPut]
        [Route("api/update/{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest("ID de usuario no coincide.");
            }

            var existingUser = _userRepository.GetById(id);

            if (existingUser == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            _userRepository.Update(user);

            return NoContent();
        }
    }
}