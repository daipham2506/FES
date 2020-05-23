const express = require("express")
const sha256File = require('sha256-file')
const router = express.Router()


router.post('/', async (req, res) => {

  const { originalFile, decryptedFile } = req.body;
  
  try {
    let hashOri = sha256File(originalFile);
    let hashDec = sha256File(decryptedFile);

    res.json({hashOri, hashDec})
  }
  catch (err) {
    console.log(err.message);
    res.status(500).send("Server error!")
  }
})

module.exports = router