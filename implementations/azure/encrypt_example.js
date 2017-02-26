
var ec = require('eccrypto');

// convert a binary string to its raw bytes
function decode_hex( hex ) {
    var bytes = [];
    for(var i=0; i< hex.length-1; i+=2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    return Buffer.from(bytes)
}

// generated with `python -c 'import keylib; print keylib.ECPrivateKey().to_hex()'`
// can also be your "data_privkey" from `blockstack_wallet`
var privateKeyA_hex = '6f0c6fffcea9b05620676eeec9037fb93f5dd1698be802f8c84acb04c8dc768f01';

if( privateKeyA_hex.length == 66 && privateKeyA_hex.slice(64, 66) == '01' ) {
  // truncate the '01', which is a hint to Bitcoin to expect a compressed public key
  privateKeyA_hex = privateKeyA_hex.slice(0, 64);
}

// decode from hex to binary
var privateKeyA = decode_hex(privateKeyA_hex)
var publicKeyA = ec.getPublic(privateKeyA);

// encrypt the message with private key
ec.encrypt(publicKeyA, Buffer("hello world")).then(function(encrypted) {
  // decrypt with public key
  ec.decrypt(privateKeyA, encrypted).then(function(plaintext) {
    console.log("Encrypted and decrypted:", plaintext.toString());
  });
});