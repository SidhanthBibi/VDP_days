import Club from '../models/clubModel';

// Get all clubs
export const getClubs = async (req, res) => {
    const clubs = await Club.find();
    res.json(clubs);
};

// Create a new club
exports.createClub = async (req, res) => {
    const { name, description } = req.body;
    const newClub = new Club({ name, description });

    try {
        await newClub.save();
        res.status(201).json(newClub);
    } catch (error) {
        res.status(400).json({ message: "Error creating club." });
    }
};

// Get a club by ID
export const getClubById = async (req, res) => {
    const club = await Club.findById(req.params.id);
    res.json(club);
};

// Update a club
exports.updateClub = async (req, res) => {
    try {
        const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClub) {
            return res.status(404).json({ message: "Club not found." });
        }
        res.status(200).json(updatedClub);
    } catch (error) {
        res.status(400).json({ message: "Error updating club." });
    }
};

// Delete a club
exports.deleteClub = async (req, res) => {
    try {
        const deletedClub = await Club.findByIdAndDelete(req.params.id);
        if (!deletedClub) {
            return res.status(404).json({ message: "Club not found." });
        }
        res.status(200).json({ message: "Club deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting club." });
    }
};