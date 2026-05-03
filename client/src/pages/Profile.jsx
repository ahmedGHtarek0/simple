import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, LogOut } from 'lucide-react';
import api from '../api';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                setUserData(response.data);
            } catch (err) {
                console.error(err);
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-card glass animate-fade">
            <div className="avatar">
                {userData?.username?.[0]?.toUpperCase() || <User />}
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>@{userData?.username}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Verified Redis User</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                        <Calendar size={14} /> Member Since
                    </div>
                    <div style={{ fontWeight: '500' }}>
                        {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
            </div>

            <button onClick={handleLogout} className="btn btn-secondary">
                <LogOut size={18} /> Sign Out
            </button>
        </div>
    );
};

export default Profile;
