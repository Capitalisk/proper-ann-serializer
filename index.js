const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const WEIGHT_GROUPS_PER_FILE = 1000;

class ProperANNSerializer {
  constructor(options) {
    let { metaFileName, weightsFileNameFunction, biasesFileNameFunction } = options || {};
    this.metaFileName = metaFileName || 'meta.json';
    this.weightsFileNameFunction = weightsFileNameFunction || ((layerIndex, startNodeIndex, endNodeIndex) => `weights-${layerIndex}-${startNodeIndex}-${endNodeIndex}.json`);
    this.biasesFileNameFunction = biasesFileNameFunction || (index => `biases-${index}.json`);
  }

  async saveToDir(ann, dirPath) {
    try {
      await mkdir(dirPath, { recursive: true });
      await writeFile(
        path.join(dirPath, this.metaFileName),
        JSON.stringify({
          layerNodeCounts: ann.layerNodeCounts
        }),
        { encoding: 'utf8' }
      );
      let len = ann.layerNodeCounts.length - 1;
      for (let i = 0; i < len; i++) {
        let currentLayerNodeCount = ann.layerNodeCounts[i];
        for (let j = 0; j < currentLayerNodeCount; j += WEIGHT_GROUPS_PER_FILE) {
          let endNodeIndex = j + WEIGHT_GROUPS_PER_FILE;
          await writeFile(
            path.join(dirPath, this.weightsFileNameFunction(i, j, endNodeIndex - 1)),
            JSON.stringify((ann.weights[i] || []).slice(j, endNodeIndex)),
            { encoding: 'utf8' }
          );
        }
        await writeFile(
          path.join(dirPath, this.biasesFileNameFunction(i)),
          JSON.stringify(ann.biases[i] || []),
          { encoding: 'utf8' }
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to save model to directory ${
          dirPath
        } because of error: ${
          error.message
        }`
      );
    }
  }

  async loadFromDir(ann, dirPath) {
    try {
      let annCountsString = ann.layerNodeCounts.join(',');

      let meta = JSON.parse(
        await readFile(
          path.join(dirPath, this.metaFileName),
          { encoding: 'utf8' }
        )
      );
      let snapshotCountsString = meta.layerNodeCounts.join(',');
      if (snapshotCountsString !== annCountsString) {
        throw new Error(
          `Failed to set JSON on ANN because layerNodeCounts of snapshot was ${
            snapshotCountsString
          } and ANN expected ${
            annCountsString
          }`
        );
      }

      let len = ann.layerNodeCounts.length - 1;
      for (let i = 0; i < len; i++) {
        ann.weights[i] = [];
        let currentLayerNodeCount = ann.layerNodeCounts[i];
        for (let j = 0; j < currentLayerNodeCount; j += WEIGHT_GROUPS_PER_FILE) {
          let endNodeIndex = j + WEIGHT_GROUPS_PER_FILE;
          let weights = JSON.parse(
            await readFile(
              path.join(dirPath, this.weightsFileNameFunction(i, j, endNodeIndex - 1)),
              { encoding: 'utf8' }
            )
          );
          for (let nodeWeights of weights) {
            ann.weights[i].push(nodeWeights);
          }
        }
        let biases = JSON.parse(
          await readFile(
            path.join(dirPath, this.biasesFileNameFunction(i)),
            { encoding: 'utf8' }
          )
        );
        ann.biases[i] = biases;
      }
    } catch (error) {
      throw new Error(
        `Failed to load model from directory ${
          dirPath
        } because of error: ${
          error.message
        }`
      );
    }
  }
}

module.exports = ProperANNSerializer;
