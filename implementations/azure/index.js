

if (typeof fetch == 'undefined') fetch = require('node-fetch');
const crypto = require('crypto');
const ec = require('eccrypto');
const azureService = 'http://ctdevattserv.azurewebsites.net';

function jsonRequest(method, path, obj){
  return fetch(path, {
    method: method,
      headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
}

// convert a binary string to its raw bytes
function decode_hex( hex ) {
    var bytes = [];
    for(var i=0; i< hex.length-1; i+=2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return Buffer.from(bytes)
}

function bufferToHex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

class Attestations {
  constructor (options = {}) {
    this.key = options.key;
  }

  create (options = {}) {
    return new Promise((resolve, reject) => {
      if ((!options.signers || !options.signers.length) && options.chainpoint === false) {
        throw 'You must specify an attestation action to perform - your choices are: identity signing, chain anchoring, or both';
      }
      if (!options.data) {
        throw 'You provided no attestation data';
      }
      options.key = this.key;
      console.log(options);
      jsonRequest('POST', azureService + '/doc', options).then(response => {
        response.json().then(function(json){
          console.log(json);
          resolve(json);
        });
      }).catch(response => {
        console.log(response);
        reject(response)
      })
    });
  }

  retrieve (id) {
    return new Promise((resolve, reject) => {
      jsonRequest('GET', azureService + '/doc/' + id, {}).then(response => {
        response.json().then(function(json){
          resolve(json);
        });
      })
    });
  }

  sign (obj = { output: 'hex', send: true }){
    return new Promise((resolve, reject) => {
      var privateKey = obj.key;
      if(privateKey.length == 66 && privateKey.slice(64, 66) == '01') {
        // truncate the '01', which is a hint to Bitcoin to expect a compressed public key
        privateKey = privateKey.slice(0, 64);
      }
      // decode from hex to binary
      privateKey = decode_hex(privateKey);
      // For sig validity test
      // var publicKey = ec.getPublic(privateKey);
      var data = crypto.createHash('sha256').update(typeof obj.data == 'string' ? obj.data : JSON.stringify(obj.data)).digest();
      ec.sign(privateKey, data).then(function(sig) {
        // Sig returns in DER Uint8Array format
        // Test sig validity
        // ec.verify(publicKey, data, sig).then(function() {
        //   console.log("Signature is OK");
        // }).catch(function() {
        //   console.log("Signature is BAD");
        // });
        if (obj.output != 'der') sig = bufferToHex(sig);
        console.log("Signature:", sig);
        if (obj.send) {
          jsonRequest('POST', azureService + '/doc/' + obj.doc, { signature: sig }).then(response => {
            response.json().then(function(json){
              console.log(json);
              resolve(json);
            });
          }).catch(response => {
            console.log(response);
            reject(response)
          })
        }
        else resolve(sig);
      }).catch(e => {
        console.log('Error in signing', e);
        reject(e);
      });
    }).catch(e => {
      console.log('Error in key preparation', e);
      reject(e);
    })
  }

  signer (id){
    return new Promise((resolve, reject) => {
      jsonRequest('GET', azureService + '/signer/' + id, { key: this.key }).then(response => {
        response.json().then(json => {
          resolve(json);
        });
      })
    });
  }

  listen (id) {
    
  }

  status (id) {
    return jsonRequest('GET', azureService + '/status/' + id, { key: this.key })
  }

  verify (id) {
    
  }

}

if (typeof module != 'undefined') module.exports = Attestations;
if (typeof window != 'undefined') window.Attestations = Attestations;