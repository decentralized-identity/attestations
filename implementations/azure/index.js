
const got = require('got');
const azureService = 'http://ctdevattserv.azurewebsites.net';

module.exports = class Attestations {
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
      got.post(azureService + '/doc', {
        json: true,
        body: options
      }).then(response => {
        console.log(response);
        response.json().then(function(json){
          console.log(json);
        })
        resolve(response.record);
      }).catch(response => {
        reject(response)
      })
    });
  }

  retrieve (id) {
    return new Promise((resolve, reject) => {
      if (this.record) resolve(this.record);
      else got.get(azureService + '/attestation/' + id, {
        json: true,
        body: { key: this.key }
      }).then(response => {
        resolve(response.record);
      })
    });
  }

  listen (id) {
    
  }

  status (id) {
    return got.get(azureService + '/status/' + id, {
      json: true,
      body: { key: this.key }
    })
  }

  verify (id) {
    
  }

} 