const sodium = require('libsodium-wrappers-sumo');

const { Print } = require('./util/util.js');
const { NONCE, SENDER_PK, RECEIVER_PK, SENDER_SK, RECEIVER_SK } = require('./util/saved.js');

function PKSign() {
  let message = "test";
  
  // Generate keys.
  const keypair = sodium.crypto_sign_keypair();
  const signerPK = keypair.publicKey, signerSK = keypair.privateKey;

  // Encrypt.
  const signature = sodium.crypto_sign_detached(message, signerSK);
  Print(signature, message.length, signature.length);

  // Verify signature.
  const result = sodium.crypto_sign_verify_detached(signature, message, signerPK);
  Print(result);
}

// Wait for libsodium to initialize first
sodium.ready.then(PKSign);
