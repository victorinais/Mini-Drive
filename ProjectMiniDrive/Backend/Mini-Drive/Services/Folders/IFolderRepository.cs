using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mini_Drive.Models;

namespace Mini_Drive.Services.Folders
{
    public interface IFolderRepository
    {
        IEnumerable<Folder> GetAll();
        Folder GetById(int id);
        void Add(Folder folder);
        void Update(Folder folder);
        void Delete(int id);

        IEnumerable<Folder> GetByUserId(int userId); // Método para listar folders por usuario
    }
}