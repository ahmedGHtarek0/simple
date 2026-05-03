import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { client, connectRedis } from './config/redis.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = 'your_super_secret_key_123';

// Connect to Redis
connectRedis();

// --- Auth Routes ---

// Signup
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user exists
        const userExists = await client.hGet(`user:${username}`, 'username');
        if (userExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user in Redis
        await client.hSet(`user:${username}`, {
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Fetch user from Redis
        const user = await client.hGetAll(`user:${username}`);
        
        if (!user || !user.username) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                username: user.username,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Profile (Protected)
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await client.hGetAll(`user:${req.user.username}`);
        if (!user || !user.username) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't send password
        const { password, ...userData } = user;
        res.json(userData);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Notes CRUD Routes ---

// Create Note
app.post('/api/notes', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const noteId = Date.now().toString();
        const username = req.user.username;

        const note = {
            id: noteId,
            title,
            content,
            username,
            createdAt: new Date().toISOString()
        };

        // Store note in a hash
        await client.hSet(`note:${noteId}`, note);
        // Add note ID to the user's set of notes
        await client.sAdd(`user:${username}:notes`, noteId);

        res.status(201).json(note);
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Notes for User
app.get('/api/notes', authMiddleware, async (req, res) => {
    try {
        const username = req.user.username;
        const noteIds = await client.sMembers(`user:${username}:notes`);
        
        const notes = [];
        for (const id of noteIds) {
            const note = await client.hGetAll(`note:${id}`);
            if (note && note.id) {
                notes.push(note);
            }
        }

        // Sort by creation date (newest first)
        notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(notes);
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Note
app.delete('/api/notes/:id', authMiddleware, async (req, res) => {
    try {
        const noteId = req.params.id;
        const username = req.user.username;

        // Check if note belongs to user
        const isMember = await client.sIsMember(`user:${username}:notes`, noteId);
        if (!isMember) {
            return res.status(403).json({ message: 'Not authorized to delete this note' });
        }

        // Delete from user's set and the note hash
        await client.sRem(`user:${username}:notes`, noteId);
        await client.del(`note:${noteId}`);

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

