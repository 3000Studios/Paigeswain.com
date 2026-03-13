const mongoose = require("mongoose")

const uri = process.env.MONGO_URI

if (!uri) {
  throw new Error("Missing MONGO_URI environment variable")
}

mongoose.connect(uri, {
  autoIndex: true,
})

module.exports = mongoose
