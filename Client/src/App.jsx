import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LandingPage from './pages/common/LandingPage';
import Login from './pages/common/Login';
import Signup from './pages/common/Signup';

function App() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  const toggleDarkMode = () => {
    const mode = !darkMode;
    setDarkMode(mode);
    localStorage.setItem('theme', mode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', mode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
        <Route
          path="/login"
          element={<Login darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
        <Route
          path="/signup"
          element={<Signup darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
