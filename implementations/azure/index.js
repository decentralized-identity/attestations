

if (typeof fetch == 'undefined') fetch = require('node-fetch');
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

class Attestations {
  constructor (options = {}) {
    this.key = options.key;
  }

  create (options = {}) {
    console.log(options);
    return new Promise((resolve, reject) => {
      if ((!options.ids || !options.ids.length) && options.chainpoint === false) {
        throw 'You must specify an attestation action to perform - your choices are: identity signing, chain anchoring, or both';
      }
      if (!options.data) {
        throw 'You provided no attestation data';
      }
      options.key = this.key;
      jsonRequest('POST', azureService + '/doc', options).then(response => {
        response.json().then(function(json){
          resolve(json);
        });
      }).catch(response => {
        reject(response)
      })
    });
  }

  retrieve (id) {
    return new Promise((resolve, reject) => {
      if (this.record) resolve(this.record);
      else jsonRequest('GET', azureService + '/attestation/' + id, { key: this.key }).then(response => {
        response.json().then(function(json){
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

if (typeof module != 'undefined') module.exports = Attestations