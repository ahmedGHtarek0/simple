import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../api';

const AddNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/notes', { title, content });
            navigate('/notes');
        } catch (err) {
            alert('Failed to save note to Redis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container glass animate-fade" style={{ maxWidth: '600px' }}>
            <button onClick={() => navigate('/notes')} className="btn-secondary" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <ArrowLeft size={16} /> Back to Notes
            </button>
            <div className="auth-header">
                <h1>New Note</h1>
                <p>Data will be persisted in Redis</p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Note title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        className="input-field"
                        placeholder="Write something amazing..."
                        rows="5"
                        style={{ resize: 'none' }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Saving...' : <><Save size={18} /> Save Note</>}
                </button>
            </form>
        </div>
    );
};

export default AddNote;
