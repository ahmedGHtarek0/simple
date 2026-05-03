import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Redis<span style={{ color: 'var(--primary)' }}>Auth</span>
                </Link>
            </div>
            <div className="nav-links">
                {token ? (
                    <>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <button 
                            onClick={handleLogout} 
                            className="nav-link" 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
