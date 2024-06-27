using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Mini_Drive.Data;
using Mini_Drive.Models;

namespace Mini_Drive.Services.Folders
{
    public class FolderRepository : IFolderRepository
    {
        private readonly BaseContext _context;
        public FolderRepository(BaseContext context)
        {
            _context = context;
        }

        public void Add(Folder folder)
        {
            _context.Folders.Add(folder);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var folder = _context.Folders.Find(id);
            if (folder != null)
            {
                _context.Folders.Remove(folder);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Folder> GetAll()
        {
            return _context.Folders.ToList();
        }

        public Folder GetById(int id)
        {
            return _context.Folders
                .Include(f => f.Files)
                .FirstOrDefault(f => f.Id == id)!;
        }

        public void Update(Folder folder)
        {
            _context.Folders.Update(folder);
            _context.SaveChanges();
        }

        public IEnumerable<Folder> GetByUserIdWithFiles(int userId)
        {
            return _context.Folders
                .Include(f => f.Files)
                .Include(f => f.SubFolders)
                .Where(f => f.UserId == userId)
                .ToList();
        }

    }
}