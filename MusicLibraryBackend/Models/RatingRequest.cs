namespace MusicLibraryBackend.Models
{
    public class RatingRequest
    {
        public int UserId { get; set; }
        public int SongId { get; set; }
        public float Rating { get; set; }
    }
}