namespace MusicLibraryBackend.Models
{
    public class ArtistDashboard
    {
        public int ArtistID { get; set; }
        public string ArtistName { get; set; }
        public double AverageRating { get; set; }
        public int BannedSongCount { get; set; }
        public int TotalListens { get; set; }
        public int TotalSongs { get; set; }
        public int TotalStrikes { get; set; }
        public string AccountStatus { get; set; }
    }
}

