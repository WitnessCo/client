@witnessco/client / Exports / WitnessClient

# Class: WitnessClient

Represents a client for interacting with the Witness server and contract.

**`Example`**

```ts
import { WitnessClient } from "@witnessco/client";

// Instantiate a new client, default params should suffice for now.
const witness = new WitnessClient();

// Unique string, so we get an unseen leaf hash.
const sampleString = `Check the chain! @ ${Date.now()}`;
// Helper method for getting the hash of a string.
const leafHash = witness.hash(sampleString);
console.log(`Timestamping leaf ${leafHash}`);

// Post the leafHash to the server.
await witness.postLeaf(leafHash);
// Use an old leafHash if you don't want to wait for this step.
await witness.waitForCheckpointedLeafHash(leafHash);
const timestamp = await witness.getTimestampForLeafHash(leafHash);
console.log(`Leaf ${leafHash} was timestamped at ${timestamp}`);

// Or shorthand for the above:
// const timestamp = await witness.postLeafAndGetTimestamp(leafHash);
```

## Table of contents

### Constructors

- [constructor](WitnessClient.md#constructor)

### Methods

- [getCheckpointByTxHash](WitnessClient.md#getcheckpointbytxhash)
- [getCurrentTreeState](WitnessClient.md#getcurrenttreestate)
- [getEarliestCheckpointCoveringLeafIndex](WitnessClient.md#getearliestcheckpointcoveringleafindex)
- [getLatestCheckpointForAllChains](WitnessClient.md#getlatestcheckpointforallchains)
- [getLatestOnchainCheckpoint](WitnessClient.md#getlatestonchaincheckpoint)
- [getLeafIndexForHash](WitnessClient.md#getleafindexforhash)
- [getProofForLeafHash](WitnessClient.md#getproofforleafhash)
- [getTimestampForLeafHash](WitnessClient.md#gettimestampforleafhash)
- [hash](WitnessClient.md#hash)
- [postLeaf](WitnessClient.md#postleaf)
- [postLeafAndGetProof](WitnessClient.md#postleafandgetproof)
- [postLeafAndGetTimestamp](WitnessClient.md#postleafandgettimestamp)
- [verifyProofChain](WitnessClient.md#verifyproofchain)
- [verifyProofServer](WitnessClient.md#verifyproofserver)
- [waitForCheckpointedLeafHash](WitnessClient.md#waitforcheckpointedleafhash)

## Constructors

### constructor

• **new WitnessClient**(`config?`): [`WitnessClient`](WitnessClient.md)

Constructs an instance of `WitnessClient`.

An optional authToken can be provided as either the sole argument or as part of a config object:
```ts
const authToken = "my-auth-token";
new WitnessClient(authToken);
```

Full client config customization options are as follows:

```ts
 // ChainConfig lets you configure how proofs are verified against a blockchain.
 type ChainConfig = { ethRpc: string };
 // ServerConfig lets you configure how the client interacts with the Witness server.
 type ServerConfig = { authToken: string; chainId: number; endpoint: string; fetchFn: typeof fetch };
 // All values are optional and can be comfortably omitted.
 type Config = { chain?: ChainConfig; server?: ServerConfig };
 // WitnessClient can be instantiated with an optional config object.
 // Example usage (populate with your config values).
 const chain = { ethRpc: "my-rpc-url.com/" };
 const server = { authToken: "my-auth-token", chainId: 1 }
 const myConfig: Config = { chain: chainConfig, server: serverConfig };
 new WitnessClient(myConfig);
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `config?` | `string` \| `Config` | `""` | Optional config entailing either just an auth token or a richer server & chain configurations for the client. |

#### Returns

[`WitnessClient`](WitnessClient.md)

#### Defined in

[src/WitnessClient.ts:102](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L102)

## Methods

### getCheckpointByTxHash

▸ **getCheckpointByTxHash**(`txHash`): `Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"included"`` \| ``"finalized"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `string`  }\>

Gets a checkpoint by its transaction hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `Hash` | The transaction hash of the checkpoint to get. |

#### Returns

`Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"included"`` \| ``"finalized"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `string`  }\>

The checkpoint with the specified transaction hash.

#### Defined in

[src/WitnessClient.ts:408](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L408)

___

### getCurrentTreeState

▸ **getCurrentTreeState**(): `Promise`\<\{ `checkpointedLeafCount`: `bigint` ; `checkpointedRoot`: `Hash` ; `leafCount`: `bigint` ; `merklizedLeafCount`: `bigint` ; `merklizedRoot`: `Hash` ; `unmerklizedLeafCount`: `bigint`  }\>

Gets the current tree state.

#### Returns

`Promise`\<\{ `checkpointedLeafCount`: `bigint` ; `checkpointedRoot`: `Hash` ; `leafCount`: `bigint` ; `merklizedLeafCount`: `bigint` ; `merklizedRoot`: `Hash` ; `unmerklizedLeafCount`: `bigint`  }\>

The current tree state.

#### Defined in

[src/WitnessClient.ts:127](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L127)

___

### getEarliestCheckpointCoveringLeafIndex

▸ **getEarliestCheckpointCoveringLeafIndex**(`leafIndex`, `chainId?`): `Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"included"`` \| ``"finalized"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

Gets the earliest checkpoint that covers the specified leaf index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafIndex` | `bigint` | The index of the leaf to search for. |
| `chainId` | `number` | Optional, the chain ID to search on. |

#### Returns

`Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"included"`` \| ``"finalized"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

The earliest checkpoint that covers the specified leaf.

#### Defined in

[src/WitnessClient.ts:296](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L296)

___

### getLatestCheckpointForAllChains

▸ **getLatestCheckpointForAllChains**(): `Promise`\<`Record`\<`string`, \{ `[key: string]`: `string` \| `bigint` \| `Date` \| `number`;  }\>\>

Gets the latest onchain checkpoints for all chains.

#### Returns

`Promise`\<`Record`\<`string`, \{ `[key: string]`: `string` \| `bigint` \| `Date` \| `number`;  }\>\>

The latest onchain checkpoint for all chains.

#### Defined in

[src/WitnessClient.ts:366](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L366)

___

### getLatestOnchainCheckpoint

▸ **getLatestOnchainCheckpoint**(`chainId?`): `Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"included"`` \| ``"finalized"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

Gets the latest onchain checkpoint.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` | Optional, the chain ID to get the latest checkpoint for. |

#### Returns

`Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"included"`` \| ``"finalized"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

The latest onchain checkpoint.

#### Defined in

[src/WitnessClient.ts:333](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L333)

___

### getLeafIndexForHash

▸ **getLeafIndexForHash**(`leafHash`): `Promise`\<`bigint`\>

Gets the index of a leaf with the specified hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The hash of the leaf to search for. |

#### Returns

`Promise`\<`bigint`\>

The index of the leaf with the specified hash.

#### Defined in

[src/WitnessClient.ts:277](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L277)

___

### getProofForLeafHash

▸ **getProofForLeafHash**(`leafHash`, `options?`): `Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint` ; `leftHashes`: `Hash`[] ; `rightHashes`: `Hash`[] ; `targetRootHash`: `Hash`  }\>

Gets the Merkle proof for a particular leafHash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The hash of the leaf to get the proof for. |
| `options?` | `Object` | The options object. |
| `options.chainId?` | `number` | Optional. The chain ID to target for the proof. If not provided and `targetTreeSize` is not set, the latest checkpoint for this chainId will be targeted. |
| `options.targetTreeSize?` | `bigint` | Optional. The tree size to target for the proof. This takes precedence over `chainId`. |

#### Returns

`Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint` ; `leftHashes`: `Hash`[] ; `rightHashes`: `Hash`[] ; `targetRootHash`: `Hash`  }\>

The Merkle proof for the specified leaf.

#### Defined in

[src/WitnessClient.ts:439](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L439)

___

### getTimestampForLeafHash

▸ **getTimestampForLeafHash**(`leafHash`, `chainId?`): `Promise`\<`Date`\>

Gets the index of a leaf with the specified hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The hash of the leaf to search for. |
| `chainId` | `number` | Optional, the chain ID to get a timestamp for. |

#### Returns

`Promise`\<`Date`\>

The index of the leaf with the specified hash.

#### Defined in

[src/WitnessClient.ts:256](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L256)

___

### hash

▸ **hash**(`str`): `Hash`

Hashes a string using the keccak256 algorithm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | The string to hash. |

#### Returns

`Hash`

- The resulting hash.

#### Defined in

[src/WitnessClient.ts:541](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L541)

___

### postLeaf

▸ **postLeaf**(`leafHash`): `Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint`  }\>

Posts a leafHash to the server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The leafHash to post. |

#### Returns

`Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint`  }\>

The index of the posted leafHash.

#### Defined in

[src/WitnessClient.ts:192](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L192)

___

### postLeafAndGetProof

▸ **postLeafAndGetProof**(`leafHash`, `chainId?`): `Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint` ; `leftHashes`: `Hash`[] ; `rightHashes`: `Hash`[] ; `targetRootHash`: `Hash`  }\>

Posts a leaf and waits until it can return with a
checkpointed proof.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The leaf to post. |
| `chainId` | `number` | Optional, the chain ID to get a proof for. |

#### Returns

`Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint` ; `leftHashes`: `Hash`[] ; `rightHashes`: `Hash`[] ; `targetRootHash`: `Hash`  }\>

The proof for the specified leaf.

**`Remarks`**

This is a convenience method that combines `postLeaf` and
`waitForCheckpointedLeaf`. Because it waits for a
checkpointed leaf, it may take up to a few minutes to return.

#### Defined in

[src/WitnessClient.ts:214](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L214)

___

### postLeafAndGetTimestamp

▸ **postLeafAndGetTimestamp**(`leafHash`, `chainId?`): `Promise`\<`Date`\>

Posts a leaf and waits until it can return with a
checkpointed timestamp.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The leaf to post. |
| `chainId` | `number` | Optional, the chain ID to get a timestamp for. |

#### Returns

`Promise`\<`Date`\>

The timestamp for the specified leaf.

**`Remarks`**

This is a convenience method that combines `postLeaf`,
`waitForCheckpointedLeaf`, and `getTimestampForLeafHash`.
Because it waits for a checkpointed leaf, it may take up
to a few minutes to return.

#### Defined in

[src/WitnessClient.ts:240](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L240)

___

### verifyProofChain

▸ **verifyProofChain**(`proof`, `config?`): `Promise`\<`boolean`\>

Verifies a Merkle proof for a given leaf against the chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Object` | The Merkle proof to verify. |
| `proof.leafHash` | `Hash` | - |
| `proof.leafIndex` | `bigint` | - |
| `proof.leftHashes?` | `Hash`[] | - |
| `proof.rightHashes?` | `Hash`[] | - |
| `proof.targetRootHash` | `Hash` | - |
| `config?` | `ChainConfig` | Optional, the chain configuration to use for verification. |

#### Returns

`Promise`\<`boolean`\>

A boolean indicating whether the proof is valid.

**`Remarks`**

This method calls out to the provided RPC node to verify the proof provided
corresponds to a legitimate checkpoint. While a default public RPC node is
provided for convenience, it's recommended to bring your own to avoid any
potential issues such as rate limits.

#### Defined in

[src/WitnessClient.ts:508](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L508)

___

### verifyProofServer

▸ **verifyProofServer**(`proof`): `Promise`\<`boolean`\>

Verifies a Merkle proof for a given leaf.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Object` | The Merkle proof to verify. |
| `proof.leafHash` | `Hash` | - |
| `proof.leafIndex` | `bigint` | - |
| `proof.leftHashes?` | `Hash`[] | - |
| `proof.rightHashes?` | `Hash`[] | - |
| `proof.targetRootHash` | `Hash` | - |

#### Returns

`Promise`\<`boolean`\>

A boolean indicating whether the proof is valid.

**`Remarks`**

This method calls out to the Witness server, to verify the proof provided
corresponds to an actual checkpoint. It's recommended to cross-check the
proof and checkpoint against the corresponding Witness contract on-chain.

#### Defined in

[src/WitnessClient.ts:479](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L479)

___

### waitForCheckpointedLeafHash

▸ **waitForCheckpointedLeafHash**(`leafHash`, `chainId?`): `Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"included"`` \| ``"finalized"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

Waits for a checkpoint covering the given leaf hash.
This method will wait up to 15 minutes for a checkpoint to be
created covering the given leaf, polling at a 5s interval.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The leaf to wait for. |
| `chainId` | `number` | Optional, the chain ID to query for. |

#### Returns

`Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"included"`` \| ``"finalized"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

The earliest checkpoint that covers the specified leaf.

#### Defined in

[src/WitnessClient.ts:159](https://github.com/WitnessCo/client/blob/4db501c/src/WitnessClient.ts#L159)
