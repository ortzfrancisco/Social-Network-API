const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path if necessary
const Thought = require('./models/Thought'); // Adjust the path if necessary
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/socialNetworkDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Route for creating a user
app.post('/users', async (req, res) => {
    console.log('Request Body:', req.body);
    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: 'Username or email already taken!' });
        } else {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
});

// Route for getting all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find().populate('thoughts').populate('friends');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Route for getting a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: err.message });
    }
});


// Custom 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).send('Wrong route!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
