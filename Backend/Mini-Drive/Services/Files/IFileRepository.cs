using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ModelFile = Mini_Drive.Models.File;

namespace Mini_Drive.Services.Files
{
    public interface IFileRepository
    {
        IEnumerable<ModelFile> GetAll();
        ModelFile GetById(int id);
        void Add(ModelFile file);
        void Update(ModelFile file);
        void Delete(int id);

        void AddFileToFolder(ModelFile file, int folderId);
    }
}