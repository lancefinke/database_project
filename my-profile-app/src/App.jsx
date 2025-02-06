import { useState } from 'react'; // Only import useState if you plan to use it
import ProfilePage from './ProfilePage'; // Ensure the path is correct
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './HomePage/HomePage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='profile' element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

