const sodium = require('libsodium-wrappers-sumo');

const { Print } = require('./util/util.js');
const { NONCE, SENDER_PK, RECEIVER_PK, SENDER_SK, RECEIVER_SK } = require('./util/saved.js');

function PKEncrypt() {
  let message = "test";
  
  // Generate keys.
  const keypair1 = sodium.crypto_box_keypair();
  const keypair2 = sodium.crypto_box_keypair();
  
  const senderPK = keypair1.publicKey, receiverPK = keypair2.publicKey;
  const senderSK = keypair1.privateKey, receiverSK = keypair2.privateKey;

  // Generate random nonce.
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  Print(nonce, sodium.crypto_box_NONCEBYTES);

  // Encrypt.
  const cipher = sodium.crypto_box_easy(message, nonce, receiverPK, senderSK);
  Print(cipher, message.length, cipher.length);

  // Decrypt.
  const plaintext = sodium.crypto_box_open_easy(cipher, nonce, senderPK, receiverSK);
  Print(plaintext);
}

function benchmark() {
  let message = "test";
  
  // Generate keys.
  const keypair1 = sodium.crypto_box_keypair();
  const keypair2 = sodium.crypto_box_keypair();
  
  const senderPK = keypair1.publicKey, receiverPK = keypair2.publicKey;
  const senderSK = keypair1.privateKey, receiverSK = keypair2.privateKey;

  // Generate random nonce.
  let d1 = new Date();
  for (let i = 0; i < 30000; i++) {
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const cipher = sodium.crypto_box_easy(message, nonce, receiverPK, senderSK);
  }
  let d2 = new Date();
  console.log(d2 - d1, 'ms');

}

// Wait for libsodium to initialize first
sodium.ready.then(PKEncrypt);
// sodium.ready.then(benchmark);
