namespace MusicLibraryBackend.Models;

    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ProfilePicture { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string UserPassword { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool isArtist { get; set; }

        public bool IsAdmin { get; set; }

        public int FlaggedNew { get; set; }
    }

