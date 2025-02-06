import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
 // Ensure correct file path

const playlist = [
  "/music/song1.mp3",
  "/music/song2.mp3",
  "/music/song3.mp3"
];

function App() {
  return (
    <div>
      <ProfilePage />
      <h1>My Music Library</h1>
      <MusicPlayer playlist={playlist} />
    </div>
  );
}

export default App;
