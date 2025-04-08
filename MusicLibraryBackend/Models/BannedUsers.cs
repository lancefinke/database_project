using System;

namespace MusicLibraryBackend.Models
{
    public class BannedUser : User
    {
        public string BanReason { get; set; }
        public DateTime DateBanned { get; set; }
    }
}
