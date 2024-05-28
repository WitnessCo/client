import { WitnessClient } from "./WitnessClient.js";

// Instantiate a new client, default params should suffice for now.
const witness = new WitnessClient();

// Helper method for getting the hash of a string.
const sampleString = `Check the chain! @ ${Date.now()}`;
const leafHash = witness.hash(sampleString);
console.log(`Timestamping leaf hash ${leafHash}`);

// Post the leafHash to the server.
await witness.postLeaf(leafHash);
// Wait for the data to be included in an onchain checkpoint.
await witness.waitForCheckpointedLeafHash(leafHash);
// Get the timestamp for the leaf.
const timestamp = await witness.getTimestampForLeafHash(leafHash);
console.log(`Leaf ${leafHash} was timestamped at ${timestamp}`);

const proof = await witness.getProofForLeafHash(leafHash);
const verified = await witness.verifyProofChain(proof);
console.log({ verified });

// Or shorthand:
// const timestamp = await witness.postLeafAndGetTimestamp(leafHash);
