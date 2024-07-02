using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Mini_Drive.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public DateTime RecordDate { get; set; } = DateTime.Now;

        [JsonIgnore]
        public ICollection<Folder>? Folders { get; set; }
    }
}