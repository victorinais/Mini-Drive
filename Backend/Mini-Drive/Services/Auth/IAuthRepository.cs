using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mini_Drive.Models;

namespace Mini_Drive.Services.Auth
{
    public interface IAuthRepository
    {
        Task<AuthResult> Authenticate(string email, string password);
        string GenerateToken(User user);
    }
}