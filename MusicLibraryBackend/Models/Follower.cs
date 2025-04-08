namespace MusicLibraryBackend.Models
{
    public class Follower
    {
        public int UserID { get; set; }
        public string Username { get; set; } = string.Empty;
        //public string ProfilePicture { get; set; } = string.Empty;

        public int FollowedID { get; set; }

    }
}
