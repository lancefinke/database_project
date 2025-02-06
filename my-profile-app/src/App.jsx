import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import NavBar from "./ProfilePage/Components/NavBar";
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
      
      <MusicPlayer playlist={playlist} />
      <NavBar />
    </div>
  );
}

export default App;
