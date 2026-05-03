import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Notes from './pages/Notes';
import AddNote from './pages/AddNote';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notes" 
            element={isAuthenticated ? <Notes /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-note" 
            element={isAuthenticated ? <AddNote /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/notes" : "/login"} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
