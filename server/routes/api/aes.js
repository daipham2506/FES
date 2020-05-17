const express = require("express")
const router = express.Router()

const CryptAES = require('../../algorithms/AES')

router.post('/', async (req, res) => {

  const { fileList, outputPath, keyPath, mode } = req.body;

  try {
    const AES = new CryptAES();

    let count = 0;
    for (let i = 0; i < fileList.length; i++) {
      if (mode === 'enc') {
        const msg = AES.encryptFile(fileList[i], keyPath[0], outputPath)
        console.log("\nPath contain file is encrypted: ", msg)
        count++;
      }
      else if (mode === "dec") {
        const msg = AES.decryptFile(fileList[i], keyPath[0], outputPath)
        console.log("\nPath contain file is decrypted: ", msg)
        count++;
      }
    }
    if (mode === "enc") {
      return res.json(count + " file is encrypted successfully!")
    } else if(mode === "dec"){
      return res.json(count + " file is decrypted successfully!")
    }

  }
  catch (err) {
    console.log(err.message);
    res.status(500).send("Server error")
  }
})

module.exports = router