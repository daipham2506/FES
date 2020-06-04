const NodeRSA = require('node-rsa');
const fs = require('fs');


class CryptRSA {

  /**
     * Encrypts files using a public key.
     * 
     * @param {String} filePath The file path.
     * @param {String} keyPath the key file path
     * @return {String} The new file path.
     */
  encryptFile(filePath, keyPath) {
    try {
      let publicKey = fs.readFileSync(keyPath, 'utf-8');
      const key = new NodeRSA(publicKey);

      const file = fs.readFileSync(filePath);
      const encryptedFile = key.encrypt(file);

      let newPath = filePath + ".rsa_enc"
      fs.writeFileSync(newPath, encryptedFile);

      return newPath

    } catch (error) {
      return error
    }
  }

  /**
     * Decrypts files using a private key.
     * 
     * @param {String} filePath The file path.
     * @param {String} keyPath the key file path
     * @return {String} The new file path.
     */
  decryptFile(filePath, keyPath) {
    try {
      let privateKey = fs.readFileSync(keyPath, 'utf-8');
      const key = new NodeRSA(privateKey);

      const file = fs.readFileSync(filePath);
      const decryptedFile = key.decrypt(file);

      let path = filePath.replace(/\.rsa_enc$/, '');
      path = path.split('.');

      let newPath ="";
      for(let i=0;i< path.length - 1 ;i++){
        newPath += path[i];
      }
      newPath = newPath + "_rsa." + path[path.length-1];

      fs.writeFileSync(newPath, decryptedFile);

      return newPath

    } catch (error) {
      return error
    }
  }
}

module.exports = CryptRSA;
