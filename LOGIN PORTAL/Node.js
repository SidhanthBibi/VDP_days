const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const otpStorage = {};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    otpStorage[email] = otp;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// Endpoint to validate OTP
app.post('/validate-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    if (otpStorage[email] && otpStorage[email] === parseInt(otp)) {
        delete otpStorage[email]; // Clear OTP after validation
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid OTP' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
