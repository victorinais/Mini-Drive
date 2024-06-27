using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mini_Drive.Models;

namespace Mini_Drive.Services.Users
{
    public interface IUserRepository
    {
        IEnumerable<User> GetAll();
        User GetById(int id);
        void Add(User user);
        void Update(User user);
        void Delete(int id);
    }
}