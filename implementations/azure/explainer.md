# Azure Attestation Service

The servuce allows the user to submit a payload for either decentralized identity signing, chainpoint blockchain anchoring, or both. The API exposes two primary endpoints:

1. Signing and anchoring of a payload
2. Verification of a payload's signatures/chainpoint proof

The following section will describe the endpoints and provide example code from select client libraries that developers can use to interact with the service.


## Node and Client JavaScript

```js
import Attestations from 'azure-attestations';

var attestations = new Attestations(AZURE_ACCT_ID);

var attestation = attestations.create({ 
  ids: ['foo.id', 'bar.id'],
  chainpoint: true,
  data: { ... }, // full data or hash, at user discretion
  callback: 'https://blockchain.nasdaq.com/attestations/callback'
});

attestation.on('change', response => {
  console.log('These identities have signed ' + response.signed.join(', '));
  console.log('These identities still need to sign' + response.unsigned.join(', '));
});

attestation.send().then(response => {
  if (response.status == 200) return response.json();
}).then(response => {
  if (response.finalized) {
    console.log('The fully compiled proof receipt: ' + JSON.stringify(response.proof))
  }
});

attestation.status().then(response => {
  console.log('These identities have signed ' + response.signed.join(', '));
  console.log('These identities still need to sign' + response.unsigned.join(', '));
});

// helpful if the user wants to store the attestation stub outside of Azure
var serialized = attestation.serialize();

// Takes either active instance or a serialized stub and performs
// a validation check on the Azure service
attestations.validate(attestation).then(response => {
  if (response.status == 200) return response.json();
}).then(response => {
  console.log('Can I trust this attestation? --> ' + response.valid)
});


```
