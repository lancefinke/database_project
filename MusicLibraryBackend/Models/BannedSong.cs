namespace MusicLibraryBackend.Models
{
    public class BannedSong
    {
        public int ReportID { get; set; }
        public int SongID { get; set; }
        public string SongName { get; set; }
        public string Duration { get; set; }
        public string CoverArtFileName { get; set; }
        public string SongFileName { get; set; }
        public int AuthorID { get; set; }
        public int ArtistID { get; set; }
        public string ArtistUsername { get; set; }
        public string ReportedBy { get; set; }
        public string Reason { get; set; }
        public DateTime ReportedOn { get; set; }
        public bool IsReported { get; set; }
        public bool IsDeleted { get; set; }
    }
}
