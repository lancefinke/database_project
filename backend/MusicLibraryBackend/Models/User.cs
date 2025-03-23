namespace MusicLibraryBackend.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string ProfilePicture { get; set; }
        public string Bio { get; set; }
        public string UserPassword { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool isArtist { get; set; }
    }
}
