using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mini_Drive.Models
{
    public class File
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Path { get; set; }
        public string? Type { get; set; }
        public long Size { get; set; }
        public int FolderId { get; set; }
        public Folder? Folder { get; set; }
        public DateTime DateUploaded { get; set; } = DateTime.UtcNow;  
    }
}