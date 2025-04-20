using System;

namespace MusicLibraryBackend.Models
{
    public class BannedUser : User
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string BanReason { get; set; }
        public DateTime DateBanned { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? BannedAt { get; set; }
        public bool isArtist { get; set; }
    }
}
