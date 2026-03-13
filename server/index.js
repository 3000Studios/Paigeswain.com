const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/status", (req, res) => {
  res.json({ status: "running" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
