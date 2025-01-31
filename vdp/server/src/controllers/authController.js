import User from '../models/userModel';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to register a new user
export const register = async (req, res) => {
    const { email, password } = req.body;

    // Check if the email is a college email
    if (!email.endsWith('@college.edu')) {
        return res.status(400).json({ message: 'Please use your college email to register.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user.' });
    }
};

// Function to login a user
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if the email is a college email
    if (!email.endsWith('@college.edu')) {
        return res.status(400).json({ message: 'Please use your college email to login.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.' });
    }
};