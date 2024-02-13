@witnessco/client / Exports / WitnessClient

# Class: WitnessClient

Represents a client for interacting with the Witness server.

**`Example`**

```ts
import { WitnessClient } from "@witnessco/client";

// Instantiate a new client, default params should suffice for now.
const witness = new WitnessClient();

// Helper method for getting the hash of a string.
const sampleString = `Check the chain! @ ${Date.now()}`;
const leafHash = witness.hash(sampleString);
console.log(`Timestamping leaf ${leafHash}`);

// Post the leafHash to the server.
await witness.postLeaf(leafHash);

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

[src/WitnessClient.ts:87](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L87)

## Properties

### authToken

• `Private` `Readonly` **authToken**: `string` = `""`

The authentication token to use for requests.

#### Defined in

[src/WitnessClient.ts:88](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L88)

## Methods

### getCheckpointByTxHash

▸ **getCheckpointByTxHash**(`txHash`): `Promise`\<\{ `blockHash`: \`0x$\{string}\` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: \`0x$\{string}\` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `string`  }\>

Gets a checkpoint by its transaction hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txHash` | \`0x$\{string}\` | The transaction hash of the checkpoint to get. |

#### Returns

`Promise`\<\{ `blockHash`: \`0x$\{string}\` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: \`0x$\{string}\` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: `string`  }\>

The checkpoint with the specified transaction hash.

#### Defined in

[src/WitnessClient.ts:346](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L346)

___

### getCurrentTreeState

▸ **getCurrentTreeState**(): `Promise`\<\{ `checkpointedLeafCount`: `bigint` ; `checkpointedRoot`: \`0x$\{string}\` ; `leafCount`: `bigint` ; `merklizedLeafCount`: `bigint` ; `merklizedRoot`: \`0x$\{string}\` ; `unmerklizedLeafCount`: `bigint`  }\>

Gets the current tree state.

#### Returns

`Promise`\<\{ `checkpointedLeafCount`: `bigint` ; `checkpointedRoot`: \`0x$\{string}\` ; `leafCount`: `bigint` ; `merklizedLeafCount`: `bigint` ; `merklizedRoot`: \`0x$\{string}\` ; `unmerklizedLeafCount`: `bigint`  }\>

The current tree state.

#### Defined in

[src/WitnessClient.ts:119](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L119)

___

### getEarliestCheckpointCoveringLeafIndex

▸ **getEarliestCheckpointCoveringLeafIndex**(`leafIndex`): `Promise`\<\{ `blockHash`: \`0x$\{string}\` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: \`0x$\{string}\` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: \`0x$\{string}\`  }\>

Gets the earliest checkpoint that covers the specified leaf index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafIndex` | `bigint` | The index of the leaf to search for. |

#### Returns

`Promise`\<\{ `blockHash`: \`0x$\{string}\` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: \`0x$\{string}\` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: \`0x$\{string}\`  }\>

The earliest checkpoint that covers the specified leaf.

#### Defined in

[src/WitnessClient.ts:273](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L273)

___

### getLatestOnchainCheckpoint

▸ **getLatestOnchainCheckpoint**(): `Promise`\<\{ `blockHash`: \`0x$\{string}\` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: \`0x$\{string}\` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: \`0x$\{string}\`  }\>

Gets the latest onchain checkpoint.

#### Returns

`Promise`\<\{ `blockHash`: \`0x$\{string}\` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: \`0x$\{string}\` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: \`0x$\{string}\`  }\>

The latest onchain checkpoint.

#### Defined in

[src/WitnessClient.ts:312](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L312)

___

### getLeafIndexForHash

▸ **getLeafIndexForHash**(`leafHash`): `Promise`\<`bigint`\>

Gets the index of a leaf with the specified hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | \`0x$\{string}\` | The hash of the leaf to search for. |

#### Returns

`Promise`\<`bigint`\>

The index of the leaf with the specified hash.

#### Defined in

[src/WitnessClient.ts:255](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L255)

___

### getProofForLeafHash

▸ **getProofForLeafHash**(`leafHash`, `targetTreeSize?`): `Promise`\<\{ `leafHash`: \`0x$\{string}\` ; `leafIndex`: `bigint` ; `leftHashes`: \`0x$\{string}\`[] ; `rightHashes`: \`0x$\{string}\`[] ; `targetRootHash`: \`0x$\{string}\`  }\>

Gets the Merkle proof for a particular leafHash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | \`0x$\{string}\` | The hash of the leaf to get the proof for. |
| `targetTreeSize?` | `bigint` | Optional, the tree size to target for the proof. |

#### Returns

`Promise`\<\{ `leafHash`: \`0x$\{string}\` ; `leafIndex`: `bigint` ; `leftHashes`: \`0x$\{string}\`[] ; `rightHashes`: \`0x$\{string}\`[] ; `targetRootHash`: \`0x$\{string}\`  }\>

The Merkle proof for the specified leaf.

#### Defined in

[src/WitnessClient.ts:373](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L373)

___

### getTimestampForLeafHash

▸ **getTimestampForLeafHash**(`leafHash`): `Promise`\<`Date`\>

Gets the index of a leaf with the specified hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | \`0x$\{string}\` | The hash of the leaf to search for. |

#### Returns

`Promise`\<`Date`\>

The index of the leaf with the specified hash.

#### Defined in

[src/WitnessClient.ts:237](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L237)

___

### hash

▸ **hash**(`str`): \`0x$\{string}\`

Hashes a string using the keccak256 algorithm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | The string to hash. |

#### Returns

\`0x$\{string}\`

- The resulting hash.

#### Defined in

[src/WitnessClient.ts:459](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L459)

___

### postLeaf

▸ **postLeaf**(`leafHash`): `Promise`\<\{ `leafHash`: \`0x$\{string}\` ; `leafIndex`: `bigint`  }\>

Posts a leafHash to the server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | \`0x$\{string}\` | The leafHash to post. |

#### Returns

`Promise`\<\{ `leafHash`: \`0x$\{string}\` ; `leafIndex`: `bigint`  }\>

The index of the posted leafHash.

#### Defined in

[src/WitnessClient.ts:181](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L181)

___

### postLeafAndGetProof

▸ **postLeafAndGetProof**(`leafHash`): `Promise`\<\{ `leafHash`: \`0x$\{string}\` ; `leafIndex`: `bigint` ; `leftHashes`: \`0x$\{string}\`[] ; `rightHashes`: \`0x$\{string}\`[] ; `targetRootHash`: \`0x$\{string}\`  }\>

Posts a leaf and waits until it can return with a
checkpointed proof.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | \`0x$\{string}\` | The leaf to post. |

#### Returns

`Promise`\<\{ `leafHash`: \`0x$\{string}\` ; `leafIndex`: `bigint` ; `leftHashes`: \`0x$\{string}\`[] ; `rightHashes`: \`0x$\{string}\`[] ; `targetRootHash`: \`0x$\{string}\`  }\>

The proof for the specified leaf.

**`Remarks`**

This is a convenience method that combines `postLeaf` and
`waitForCheckpointedLeaf`. Because it waits for a
checkpointed leaf, it may take up to a few minutes to return.

#### Defined in

[src/WitnessClient.ts:206](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L206)

___

### postLeafAndGetTimestamp

▸ **postLeafAndGetTimestamp**(`leafHash`): `Promise`\<`Date`\>

Posts a leaf and waits until it can return with a
checkpointed timestamp.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | \`0x$\{string}\` | The leaf to post. |

#### Returns

`Promise`\<`Date`\>

The timestamp for the specified leaf.

**`Remarks`**

This is a convenience method that combines `postLeaf`,
`waitForCheckpointedLeaf`, and `getTimestampForLeafHash`.
Because it waits for a checkpointed leaf, it may take up
to a few minutes to return.

#### Defined in

[src/WitnessClient.ts:225](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L225)

___

### verifyProofChain

▸ **verifyProofChain**(`proof`): `Promise`\<`boolean`\>

Verifies a Merkle proof for a given leaf against the chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Object` | The Merkle proof to verify. |
| `proof.leafHash` | \`0x$\{string}\` | - |
| `proof.leafIndex` | `bigint` | - |
| `proof.leftHashes?` | \`0x$\{string}\`[] | - |
| `proof.rightHashes?` | \`0x$\{string}\`[] | - |
| `proof.targetRootHash` | \`0x$\{string}\` | - |

#### Returns

`Promise`\<`boolean`\>

A boolean indicating whether the proof is valid.

**`Remarks`**

This method calls out to the provided RPC node to verify the proof provided
corresponds to a legitimate checkpoint. While a default public RPC node is
provided for convenience, it's recommended to bring your own to avoid any
potential issues such as rate limits.

#### Defined in

[src/WitnessClient.ts:431](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L431)

___

### verifyProofServer

▸ **verifyProofServer**(`proof`): `Promise`\<\{ `success`: `boolean`  }\>

Verifies a Merkle proof for a given leaf.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Object` | The Merkle proof to verify. |
| `proof.leafHash` | \`0x$\{string}\` | - |
| `proof.leafIndex` | `bigint` | - |
| `proof.leftHashes?` | \`0x$\{string}\`[] | - |
| `proof.rightHashes?` | \`0x$\{string}\`[] | - |
| `proof.targetRootHash` | \`0x$\{string}\` | - |

#### Returns

`Promise`\<\{ `success`: `boolean`  }\>

A boolean indicating whether the proof is valid.

**`Remarks`**

This method calls out to the Witness server, to verify the proof provided
corresponds to an actual checkpoint. It's recommended to cross-check the
proof and checkpoint against the corresponding Witness contract on-chain.

#### Defined in

[src/WitnessClient.ts:403](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L403)

___

### waitForCheckpointedLeafHash

▸ **waitForCheckpointedLeafHash**(`leafHash`): `Promise`\<\{ `blockHash`: \`0x$\{string}\` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: \`0x$\{string}\` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: \`0x$\{string}\`  }\>

Waits for a checkpoint covering the given leaf hash.
This method will wait up to 5 minutes for a checkpoint to be
created covering the given leaf, polling at a 2.5s interval.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leafHash` | \`0x$\{string}\` | The leaf to wait for. |

#### Returns

`Promise`\<\{ `blockHash`: \`0x$\{string}\` ; `blockNumber`: `bigint` ; `chainId`: `number` ; `rootHash`: \`0x$\{string}\` ; `status`: ``"pending"`` \| ``"finalized"`` \| ``"included"`` ; `timestamp`: `Date` ; `treeSize`: `bigint` ; `txHash`: \`0x$\{string}\`  }\>

The earliest checkpoint that covers the specified leaf.

#### Defined in

[src/WitnessClient.ts:151](https://github.com/WitnessCo/client/blob/eedebbd/src/WitnessClient.ts#L151)
