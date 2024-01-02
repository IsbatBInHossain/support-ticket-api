const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }

  // Define the support ticket schema
  const supportTicketSchema = new mongoose.Schema({
    userID: String,
    date: Date,
    deviceID: String,
    queryText: String,
    createAt: Date,
  })

  const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema)

  app.use(express.json())

  // API endpoint for creating a support ticket
  app.post('/support/create_ticket', async (req, res) => {
    const { userID, date, deviceID, queryText } = req.body

    // Check if a ticket was submitted within the last 30 minutes
    const lastTicket = await SupportTicket.findOne({ userID }).sort({
      createAt: -1,
    })

    if (
      !lastTicket ||
      Date.now() - lastTicket.createAt.getTime() > 30 * 60 * 1000
    ) {
      // If last ticket was more than 30 minutes ago, save the record in DB
      const newTicket = new SupportTicket({
        userID,
        date: new Date(date),
        deviceID,
        queryText,
        createAt: new Date(),
      })

      const savedTicket = await newTicket.save()

      return res.status(200).json({
        data: { _id: savedTicket._id },
      })
    } else {
      // If last ticket was less than or equal to 30 minutes ago, send conflict response
      return res.status(409).json({
        message:
          'You have already placed a support ticket. Please wait at least one hour before sending another request',
      })
    }
  })

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

// Call the main function
main()
