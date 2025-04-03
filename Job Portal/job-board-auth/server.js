const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line

const app = express();

// Enable CORS
app.use(cors()); // Add this line

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/jobBoard', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


// User Schema
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Job Schema
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true }
});

const Job = mongoose.model('Job', jobSchema);

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for form data
app.use(express.static('public')); // Serve static files

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user && user.isAdmin) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({ message: '❌ Access denied. Admins only.' });
        }
    } catch (error) {
        console.error('Error checking admin:', error);
        return res.status(500).json({ message: '❌ Internal server error.' });
    }
};

// Routing for HTML files
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/public/register.html'));
app.get('/admin', isAdmin, (req, res) => res.sendFile(__dirname + '/public/admin.html'));

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: '✅ Login successful', user });
        } else {
            res.status(401).json({ message: '❌ Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: '❌ Internal server error' });
    }
});

// Register Route
app.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '❌ User already exists with this email.' });
        }
        const newUser = new User({ fullName, email, password });
        await newUser.save();
        res.status(201).json({ message: '✅ User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: '❌ Error registering user.' });
    }
});

// Create a job (Admin Only)
app.post('/jobs', isAdmin, async (req, res) => {
    const { title, description, company, location, salary } = req.body;
    try {
        const job = new Job({ title, description, company, location, salary });
        await job.save();
        res.status(201).json({ message: '✅ Job created successfully!' });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: '❌ Error creating job.' });
    }
});

// Get all jobs
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: '❌ Error fetching jobs.' });
    }
});

// Update a job (Admin Only)
app.put('/jobs/:id', isAdmin, async (req, res) => {
    const { title, description, company, location, salary } = req.body;
    try {
        await Job.findByIdAndUpdate(req.params.id, { title, description, company, location, salary });
        res.status(200).json({ message: '✅ Job updated successfully!' });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: '❌ Error updating job.' });
    }
});

// Delete a job (Admin Only)
app.delete('/jobs/:id', isAdmin, async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: '✅ Job deleted successfully!' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: '❌ Error deleting job.' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
