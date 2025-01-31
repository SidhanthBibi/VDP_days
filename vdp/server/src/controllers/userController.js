const User = require('../models/userModel');

module.exports = {
    getUserProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user profile." });
        }
    },

    updateUserProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Error updating user profile." });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
            res.status(500).json({ message: "Error deleting user." });
        }
    }
};