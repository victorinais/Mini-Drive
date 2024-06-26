using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Mini_Drive.Models
{
    public class Folder
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int? ParentFolderId { get; set; }
        public Folder? ParentFolder { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<Folder>? SubFolders { get; set; }
        [JsonIgnore]
        public ICollection<File>? Files { get; set; }
    }
}