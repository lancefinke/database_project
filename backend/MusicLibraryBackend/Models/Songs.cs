namespace MusicLibraryBackend.Models;

public class Song
{
    public int SongID { get; set; }

    public int GenreCode { get; set; }

    public required string SongFileName { get; set; }

    public required string Title { get; set; }

    public DateTime ReleaseDate { get; set; }

    public string CoverArtFileName { get; set; }

    public int Duration { get; set; }

    public int AuthorID { get; set; }

    public double TotalRatings { get; set; }

    public bool IsReported { get; set; }
}
