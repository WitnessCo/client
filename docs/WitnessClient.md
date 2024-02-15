@witnessco/client / Exports / WitnessClient

# Class: WitnessClient

Represents a client for interacting with the Witness server.

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

### Properties

- [authToken](WitnessClient.md#authtoken)

### Methods

- [getCheckpointByTxHash](WitnessClient.md#getcheckpointbytxhash)
- [getCurrentTreeState](WitnessClient.md#getcurrenttreestate)
- [getEarliestCheckpointCoveringLeafIndex](WitnessClient.md#getearliestcheckpointcoveringleafindex)
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

• **new WitnessClient**(`authToken?`, `endpoint?`, `fetchFn?`, `ethRpc?`): [`WitnessClient`](WitnessClient.md)

Constructs an instance of `WitnessClient`.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `authToken` | `string` | `""` | The authentication token to use for requests. |
| `endpoint` | ``"https://api.witness.co"`` | `DEFAULT_API_URL` | The URL of the Witness server. |
| `fetchFn` | (`input`: `RequestInfo` \| `URL`, `init?`: `RequestInit`) => `Promise`\<`Response`\>(`input`: `string` \| `Request` \| `URL`, `init?`: `RequestInit`) => `Promise`\<`Response`\> | `fetch` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch) |
| `ethRpc` | `string` | `DEFAULT_ETH_RPC_URL` | The URL of the Ethereum RPC endpoint to use. Implies the chainId used in server calls too. |

#### Returns

[`WitnessClient`](WitnessClient.md)

#### Defined in

[src/WitnessClient.ts:88](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L88)

## Properties

### authToken

• `Private` `Readonly` **authToken**: `string` = `""`

The authentication token to use for requests.

#### Defined in

[src/WitnessClient.ts:89](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L89)

## Methods

### getCheckpointByTxHash

▸ **getCheckpointByTxHash**(`txHash`): `Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `string`  }\>

Gets a checkpoint by its transaction hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `Hash` | The transaction hash of the checkpoint to get. |

#### Returns

`Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `string`  }\>

The checkpoint with the specified transaction hash.

#### Defined in

[src/WitnessClient.ts:347](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L347)

___

### getCurrentTreeState

▸ **getCurrentTreeState**(): `Promise`\<\{ `checkpointedLeafCount`: `bigint` ; `checkpointedRoot`: `Hash` ; `leafCount`: `bigint` ; `merklizedLeafCount`: `bigint` ; `merklizedRoot`: `Hash` ; `unmerklizedLeafCount`: `bigint`  }\>

Gets the current tree state.

#### Returns

`Promise`\<\{ `checkpointedLeafCount`: `bigint` ; `checkpointedRoot`: `Hash` ; `leafCount`: `bigint` ; `merklizedLeafCount`: `bigint` ; `merklizedRoot`: `Hash` ; `unmerklizedLeafCount`: `bigint`  }\>

The current tree state.

#### Defined in

[src/WitnessClient.ts:120](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L120)

___

### getEarliestCheckpointCoveringLeafIndex

▸ **getEarliestCheckpointCoveringLeafIndex**(`leafIndex`): `Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

Gets the earliest checkpoint that covers the specified leaf index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafIndex` | `bigint` | The index of the leaf to search for. |

#### Returns

`Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

The earliest checkpoint that covers the specified leaf.

#### Defined in

[src/WitnessClient.ts:274](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L274)

___

### getLatestOnchainCheckpoint

▸ **getLatestOnchainCheckpoint**(): `Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

Gets the latest onchain checkpoint.

#### Returns

`Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

The latest onchain checkpoint.

#### Defined in

[src/WitnessClient.ts:313](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L313)

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

[src/WitnessClient.ts:256](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L256)

___

### getProofForLeafHash

▸ **getProofForLeafHash**(`leafHash`, `targetTreeSize?`): `Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint` ; `leftHashes`: `Hash`[] ; `rightHashes`: `Hash`[] ; `targetRootHash`: `Hash`  }\>

Gets the Merkle proof for a particular leafHash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The hash of the leaf to get the proof for. |
| `targetTreeSize?` | `bigint` | Optional, the tree size to target for the proof. |

#### Returns

`Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint` ; `leftHashes`: `Hash`[] ; `rightHashes`: `Hash`[] ; `targetRootHash`: `Hash`  }\>

The Merkle proof for the specified leaf.

#### Defined in

[src/WitnessClient.ts:374](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L374)

___

### getTimestampForLeafHash

▸ **getTimestampForLeafHash**(`leafHash`): `Promise`\<`Date`\>

Gets the index of a leaf with the specified hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The hash of the leaf to search for. |

#### Returns

`Promise`\<`Date`\>

The index of the leaf with the specified hash.

#### Defined in

[src/WitnessClient.ts:238](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L238)

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

[src/WitnessClient.ts:460](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L460)

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

[src/WitnessClient.ts:182](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L182)

___

### postLeafAndGetProof

▸ **postLeafAndGetProof**(`leafHash`): `Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint` ; `leftHashes`: `Hash`[] ; `rightHashes`: `Hash`[] ; `targetRootHash`: `Hash`  }\>

Posts a leaf and waits until it can return with a
checkpointed proof.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The leaf to post. |

#### Returns

`Promise`\<\{ `leafHash`: `Hash` ; `leafIndex`: `bigint` ; `leftHashes`: `Hash`[] ; `rightHashes`: `Hash`[] ; `targetRootHash`: `Hash`  }\>

The proof for the specified leaf.

**`Remarks`**

This is a convenience method that combines `postLeaf` and
`waitForCheckpointedLeaf`. Because it waits for a
checkpointed leaf, it may take up to a few minutes to return.

#### Defined in

[src/WitnessClient.ts:207](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L207)

___

### postLeafAndGetTimestamp

▸ **postLeafAndGetTimestamp**(`leafHash`): `Promise`\<`Date`\>

Posts a leaf and waits until it can return with a
checkpointed timestamp.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The leaf to post. |

#### Returns

`Promise`\<`Date`\>

The timestamp for the specified leaf.

**`Remarks`**

This is a convenience method that combines `postLeaf`,
`waitForCheckpointedLeaf`, and `getTimestampForLeafHash`.
Because it waits for a checkpointed leaf, it may take up
to a few minutes to return.

#### Defined in

[src/WitnessClient.ts:226](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L226)

___

### verifyProofChain

▸ **verifyProofChain**(`proof`): `Promise`\<`boolean`\>

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

#### Returns

`Promise`\<`boolean`\>

A boolean indicating whether the proof is valid.

**`Remarks`**

This method calls out to the provided RPC node to verify the proof provided
corresponds to a legitimate checkpoint. While a default public RPC node is
provided for convenience, it's recommended to bring your own to avoid any
potential issues such as rate limits.

#### Defined in

[src/WitnessClient.ts:432](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L432)

___

### verifyProofServer

▸ **verifyProofServer**(`proof`): `Promise`\<\{ `success`: `boolean`  }\>

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

`Promise`\<\{ `success`: `boolean`  }\>

A boolean indicating whether the proof is valid.

**`Remarks`**

This method calls out to the Witness server, to verify the proof provided
corresponds to an actual checkpoint. It's recommended to cross-check the
proof and checkpoint against the corresponding Witness contract on-chain.

#### Defined in

[src/WitnessClient.ts:404](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L404)

___

### waitForCheckpointedLeafHash

▸ **waitForCheckpointedLeafHash**(`leafHash`): `Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

Waits for a checkpoint covering the given leaf hash.
This method will wait up to 15 minutes for a checkpoint to be
created covering the given leaf, polling at a 5s interval.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | `Hash` | The leaf to wait for. |

#### Returns

`Promise`\<\{ `blockHash`: `Hash` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: `Hash` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `Hash`  }\>

The earliest checkpoint that covers the specified leaf.

#### Defined in

[src/WitnessClient.ts:152](https://github.com/WitnessCo/client/blob/c286679/src/WitnessClient.ts#L152)
