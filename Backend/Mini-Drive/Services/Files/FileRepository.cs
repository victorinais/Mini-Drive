using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mini_Drive.Data;
using ModelFile = Mini_Drive.Models.File;

namespace Mini_Drive.Services.Files
{
    public class FileRepository : IFileRepository
    {
        private readonly BaseContext _context;
        public FileRepository(BaseContext context)
        {
            _context = context;
        }

        public void Add(ModelFile file)
        {
            _context.Files.Add(file);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var file = _context.Files.Find(id);
            if (file != null)
            {
                _context.Files.Remove(file);
                _context.SaveChanges();
            }
        }

        public IEnumerable<ModelFile> GetAll()
        {
            return _context.Files.ToList();
        }

        public ModelFile GetById(int id)
        {
            return _context.Files.FirstOrDefault(f => f.Id == id)!;
        }

        public void Update(ModelFile file)
        {
            _context.Files.Update(file);
            _context.SaveChanges();
        }

        public void AddFileToFolder(ModelFile file, int folderId)
        {
            var folder = _context.Folders.Find(folderId);
            if (folder == null)
            {
                throw new Exception("Folder not found");
            }

            file.FolderId = folderId;
            _context.Files.Add(file);
            _context.SaveChanges();
        }

    }
}