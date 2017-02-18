
var win = typeof window != 'undefined';

if (!win || !window.fetch) fetch = require('node-fetch');
azureService = 'http://ctdevattserv.azurewebsites.net';

function fetchJSON(method, path, obj){
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
      fetchJSON('POST', azureService + '/doc', options).then(response => {
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
      else fetchJSON('GET', azureService + '/attestation/' + id, { key: this.key }).then(response => {
        response.json().then(function(json){
          resolve(json);
        });
      })
    });
  }

  listen (id) {
    
  }

  status (id) {
    return fetchJSON('GET', azureService + '/status/' + id, { key: this.key })
  }

  verify (id) {
    
  }

}

if (!win || win.module) module.exports = Attestations