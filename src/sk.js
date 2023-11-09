const sodium = require('libsodium-wrappers-sumo');

const { Print } = require('./util/util.js');
const { SYMMETRIC_NONCE, SYMMETRIC_KEY } = require('./util/saved.js');

function SKEncrypt() {
  let message = "test";
  
  // Generate key.
  const key = sodium.crypto_secretbox_keygen();

  // Generate random nonce.
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  Print(nonce, sodium.crypto_secretbox_NONCEBYTES);

  // Encrypt.
  const cipher = sodium.crypto_secretbox_easy(message, nonce, key);
  Print(cipher, message.length, cipher.length);

  // Decrypt.
  const plaintext = sodium.crypto_secretbox_open_easy(cipher, nonce, key);
  Print(plaintext);
}

function benchmark() {
  let message = "test";
  
  // Generate keys.
  const key = sodium.crypto_secretbox_keygen();

  // Generate random nonce.
  let d1 = new Date();
  for (let i = 0; i < 30000; i++) {
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const cipher = sodium.crypto_secretbox_easy(message, nonce, key);
  }
  let d2 = new Date();
  console.log(d2 - d1, 'ms');

}

// Wait for libsodium to initialize first
sodium.ready.then(SKEncrypt);
// sodium.ready.then(benchmark);
