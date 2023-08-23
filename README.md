# proper-ann-serializer
Utility to serialize and deserialize ProperANN model files.

## Usage

```js
const ProperANNSerializer = require('proper-ann-serializer');

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
