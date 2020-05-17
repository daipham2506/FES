const express = require("express")

const app = express()

// Init Middleware
app.use(express.json({ extended: false}))


// Define Route
app.use('/api/aes', require('./routes/api/aes'))

const PORT = process.env.PORT || 5053

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})
