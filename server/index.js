const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventSchema = require('./models/events.js')

const app = express();
app.use(express.json())
const PORT = 3000;

app.post('/api/events', async (req, res) => {
    try {
        const event = await eventSchema.create(req.body)
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

mongoose.connect('mongodb+srv://admin:rIbmanOwx5BHApTv@backenddb.79b8l.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB')
  .then(() => console.log('Connected!'))
  .catch(() => {
    console.log("couldn't connect!!")
  })