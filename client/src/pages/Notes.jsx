import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, StickyNote } from 'lucide-react';
import api from '../api';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            setNotes(response.data);
        } catch (err) {
            console.error('Failed to fetch notes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            alert('Failed to delete note');
        }
    };

    if (loading) return <div className="empty-state">Loading your notes...</div>;

    return (
        <div style={{ width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StickyNote className="text-primary" /> My Redis Notes
                </h2>
                <Link to="/add-note" className="btn" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>
                    <Plus size={18} /> New Note
                </Link>
            </div>

            {notes.length === 0 ? (
                <div className="empty-state animate-fade">
                    <StickyNote size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No notes found. Create your first note stored in Redis!</p>
                </div>
            ) : (
                <div className="notes-grid animate-fade">
                    {notes.map(note => (
                        <div key={note.id} className="note-card glass">
                            <button onClick={() => handleDelete(note.id)} className="delete-btn">
                                <Trash2 size={16} />
                            </button>
                            <div>
                                <h3>{note.title}</h3>
                                <p>{note.content}</p>
                            </div>
                            <div className="note-date">
                                {new Date(note.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notes;
