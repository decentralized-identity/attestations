# Azure Attestation Service

The servuce allows the user to submit a payload for either decentralized identity signing, chainpoint blockchain anchoring, or both. The API exposes two primary endpoints:

1. Signing and anchoring of a payload
2. Verification of a payload's signatures/chainpoint proof

The following section will describe the endpoints and provide example code from select client libraries that developers can use to interact with the service.


## Node and Client JavaScript

```js
import Attestations from 'azure-attestations';

var attestations = new Attestations(AZURE_ACCT_ID);

var promise = attestations.requestProof({ 
  ids: ['foo.id', 'bar.id'],
  chainpoint: true,
  payload: { ... },
  callback: 'https://blockchain.nasdaq.com/attestations/callback'
}).then(response => {
  if (response.status == 200) return response.json();
}).then(attestation => {
  if (attestation.finalized) {
    console.log('The following identities have signed ' + attestation.signers.join(', '));
  }
})


```
