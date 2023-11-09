const sodium = require('libsodium-wrappers-sumo');

const { Print } = require('./util/util.js');

function hashToPoint(input) {
  const hash = sodium.crypto_generichash(sodium.crypto_core_ristretto255_HASHBYTES, sodium.from_string(input));
  return sodium.crypto_core_ristretto255_from_hash(hash);
}

function OPRF() {
  // The server has a secret seed.
  let seed = new Uint8Array([
    211, 120,  35, 100, 135, 220,   1, 184,
    157,  56, 156,  62, 160,  33,  29, 135,
    243, 181, 186, 166, 134, 160, 225, 175,
    113,  59, 239, 253,  58,  48, 212,  10
  ]);

  // The client hashes the message to a point on the elliptic curve.
  let message = "test";
  let point = hashToPoint(message);

  // Client phase 1.
  // Generate mask and hide point using mask.
  const mask = sodium.crypto_core_ristretto255_scalar_random();
  const masked_point = sodium.crypto_scalarmult_ristretto255(mask, point);
  Print(masked_point);
  // Now client sends masked_point to server.
  // End of client phase 1.
  
  // Server phase.
  const seeded_masked_point = sodium.crypto_scalarmult_ristretto255(seed, masked_point);
  Print(seeded_masked_point);
  // Now server sends seeded_masked_point to client.
  // End of server phase.
  
  // Client phase 2.
  const mask_inverse = sodium.crypto_core_ristretto255_scalar_invert(mask);
  const output = sodium.crypto_scalarmult_ristretto255(mask_inverse, seeded_masked_point);
  Print(output);
  // End of client phase 2.

  // For testing, the output should be the same as PRF(seed, point) = point^seed.
  const expected = sodium.crypto_scalarmult_ristretto255(seed, point);
  console.log(output.join('') == expected.join(''));
}

function PSI() {
  // Find intersection of these two sets.
  let aliceSet = ["Kinan", "Malte", "Livia", "Alice"];
  let bobSet = ["Bob", "Kinan", "Alice", "Spongebob", "Patrick"];

  // Alice and Bob come up with two secret seeds.
  const aliceSeed = sodium.crypto_core_ristretto255_scalar_random();
  const bobSeed = sodium.crypto_core_ristretto255_scalar_random();

  // Alice phase 1 - applies seed to all elements.
  const aliceSet1 = aliceSet.map(function (element) {
    const point = hashToPoint(element);
    return sodium.crypto_scalarmult_ristretto255(aliceSeed, point);
  });
  // End of Alice phase 1.

  // Bob phase 1 - applies seed to all elements.
  const bobSet1 = bobSet.map(function (element) {
    const point = hashToPoint(element);
    return sodium.crypto_scalarmult_ristretto255(bobSeed, point);
  });
  // End of Bob phase 1.

  // Alice and bob now exchange seeded sets.

  // Alice phase 2.
  const bobSet2 = bobSet1.map(function (point) {
    return sodium.crypto_scalarmult_ristretto255(aliceSeed, point);
  });
  // End of Alice phase 2.

  // Bob phase 2.
  const aliceSet2 = aliceSet1.map(function (point) {
    return sodium.crypto_scalarmult_ristretto255(bobSeed, point);
  });
  // End of Bob phase 2.

  // One more round of exchaning sets.
  // Say we are Alice, we now have access to bobSet2 and aliceSet2.
  const set = new Set(bobSet2.map(function (element) { return element.join(''); }));
  for (let i = 0; i < aliceSet2.length; i++) {
    if (set.has(aliceSet2[i].join(''))) {
      console.log(aliceSet[i]);
    }
  }
  
  // Bob can do the same symmetrically.
}

// Wait for libsodium to initialize first
sodium.ready.then(OPRF);
// sodium.ready.then(PSI);
