const express = require("express")

const app = express()

// Init Middleware
app.use(express.json({ extended: false}))


// Define Route
app.use('/api/crypt', require('./routes/api/crypt'));
app.use('/api/integrity', require('./routes/api/integrity'));

const PORT = process.env.PORT || 5053

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})
