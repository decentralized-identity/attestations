# Azure Attestation Service

The service allows the user to submit a payload for either decentralized identity signing, chainpoint blockchain anchoring, or both. The API exposes two primary endpoints:

1. Signing and anchoring of a payload
2. Verification of a payload's signatures/chainpoint proof

The following section will describe the endpoints and provide example code from select client libraries that developers can use to interact with the service.


## Node and Client JavaScript

```js
import Attestations from 'azure-attestations';

var attestations = new Attestations(AZURE_ACCT_ID);
var id;
attestations.create({ 
  signers: [
    'foo.id',
    'bar.id'
  ],
  chainpoint: true, // defaults to true
  data: { ... }, // full data or hash, at user discretion
  callback: 'https://blockchain.nasdaq.com/attestations/callback'
}).then(response => {
  id = response.id;
})

attestations.retrieve(id).then(response => {
  console.log('The record for this attestation: ', response);
});

attestations.sign({
  key: 'D3s44xhB...',
  id: '89eaa73b-7b89-921b-6bfd-3d8a2367f83a',
  data: { ... }
}).then(response => {
  console.log('Signature accepted', response);
});

attestations.signer(id).then(response => {
  console.log('Data about this signer: ', response);
});

attestations.listen(id, 'change', response => {
  console.log('These identities have signed: ' + response.signed.join(', '));
  console.log('These identities still need to sign: ' + response.unsigned.join(', '));
});

attestations.status(id).then(response => {
  console.log('These identities have signed: ' + response.signed.join(', '));
  console.log('These identities still need to sign: ' + response.unsigned.join(', '));
});

// Probably will just be a variant of the status() call
// Performs a validation check on the Azure service
attestations.verify(id).then(response => {
  console.log('Can I trust this attestation? --> ' + response.verified)
});


```

## Generating Dist

`$ browserify index.js -s attestations > dist.js`

