const express = require("express")
const router = express.Router()

const CryptAES = require('../../algorithms/AES')
const CryptRSA = require('../../algorithms/RSA')

router.post('/', async (req, res) => {

  const { fileList, keyPath, mode, algo } = req.body;

  try {

    var Crypt;
    if (algo === "aes") {
      Crypt = new CryptAES();
    } else if (algo === "rsa") {
      Crypt = new CryptRSA();
    }

    let result = [];
    let resultPath = null;


    for (let i = 0; i < fileList.length; i++) {
      if (mode === 'enc') {
        resultPath = Crypt.encryptFile(fileList[i], keyPath)
        console.log("\nPath contain file is encrypted: ", resultPath)
      }
      else if (mode === "dec") {
        resultPath = Crypt.decryptFile(fileList[i], keyPath)
        console.log("\nPath contain file is decrypted: ", resultPath)
      }

      let arr = resultPath.split("/");
      let nameFile = arr[arr.length - 1];
      result.push({ path: resultPath, name: nameFile });
    }

    return res.json(result);
  }
  catch (err) {
    console.log(err.message);
    res.status(500).send(" Mac check failed!")
  }
})

module.exports = router