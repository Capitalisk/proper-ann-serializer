# proper-ann-serializer
Utility to serialize and deserialize ProperANN model files.

## Usage

```js
const ProperANNSerializer = require('proper-ann-serializer');

// ...

(async () => {
  let annSerializer = new ProperANNSerializer();

  try {
    // This will look for a directory called my-model.
    await annSerializer.loadFromDir(ann, 'my-model');
  } catch (error) {
    console.log('Could not find an existing ANN model, will start from scratch...');
  }

  // ...

  // Will throw if it fails to save.
  await annSerializer.saveToDir(ann, 'my-model');
})();
```

## License

### AGPL by default

By default, this product is issued under `AGPL-3.0`.

### MIT license for CLSK token holders

If you own `10K CLSK` tokens (https://capitalisk.com/), then you are subject to the less restrictive `MIT` license and are therefore exempt from the AGPL requirement of making the code of your derived projects public. This alternative license applies automatically from the moment that you acquire 100K or more CLSK tokens and it is valid so long as you continue to hold that amount of tokens.

If your CLSK balance falls below 100K, then you will be once again bound to the conditions of AGPL-3.0 after a grace period of 90 days; after this grace period, your derived project's code should be made public. Timestamps which can be used to prove ownership of CLSK tokens over time are recorded on the Capitalisk blockchain in a decentralized, immutable way so it is important that you hold 100K CLSK throughout your derived project's entire commercial life if you intend to keep the code private.

This exemption also applies to companies; in this case, the total CLSK holdings of the company plus those of its directors and board members must be greater than 100K multiplied by the maximum number of contributors which have worked on the project concurrently since the start of the project (e.g. according to records in the project's code repository). If a company falls out of compliance, the standard 90-day grace period applies before reverting back to the AGPL-3.0 license.

The amount of CLSK tokens which need to be held to qualify for the MIT license (and exemption from AGPL-3.0) may be revised downwards in the future but never upwards.
