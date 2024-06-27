using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Mini_Drive.Services.Users;

namespace Mini_Drive.Controllers.Users
{
    public class UsersControllers : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UsersControllers(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        [Route("api/users")]
        public IActionResult GetAllUsers()
        {
            var users = _userRepository.GetAll();
            return Ok(users);
        }

        [HttpGet]
        [Route("api/users/{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _userRepository.GetById(id);
            return Ok(user);
        }
    }
}