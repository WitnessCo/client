# Witness Client

## Features

**Witness Client**: A client for interacting with Witness.
- Fetch-based client built on OpenAPI specification
- Supports customizing fetch function for different environments
- Configurable with API key and custom RPC URL
- Verifies proofs against the chain

## Usage

```bash
bun add @witnessco/client
```

```typescript
import { WitnessClient } from '@witnessco/client'

// Instantiate a new client, default params should suffice for now.
const witness = new WitnessClient()

// Unique string, so we get an unseen leafHash.
const sampleString = `Check the chain! @ ${Date.now()}`
const leafHash = witness.hash(sampleString)

console.log(`Posting leaf hash ${leafHash}`)
await witness.postLeaf(leafHash)
console.log('Waiting for onchain inclusion (may take up to 10min)')
await witness.waitForCheckpointedLeafHash(leafHash)

// Get the timestamp for the leaf.
const timestamp = await witness.getTimestampForLeafHash(leafHash)
console.log(`Leaf ${leafHash} was timestamped at ${timestamp}`)

// Get and verify proof.
const proof = await witness.getProofForLeafHash(leafHash)
const verified = await witness.verifyProofChain(proof)
console.log(`Proof verified: ${verified}`)
```

See [this repl](https://codedamn.com/playground/XLvUU81JcDPTA_9OZPOsZ) for a live example.

## Contract Deployments

Canonical deployments for `Witness.sol` are available as follows:

| Chain ID                    | Deployment Address                                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Mainnet (1)                 | [0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a](https://etherscan.io/address/0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a)                    |
| Base (8453)                 | [0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a](https://base.blockscout.com/address/0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a)             |
| Optimism (10)               | [0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a](https://optimism.blockscout.com/address/0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a)         |
| Sepolia (11155111)          | [0x00000008bcf12Eeb9E4162687D6D251f0F4e7FC2](https://eth-sepolia.blockscout.com/address/0x00000008bcf12Eeb9E4162687D6D251f0F4e7FC2)      |
| Base Sepolia (84532)        | [0x0000000159C8253802551eEaf8b475db1A50d712](https://base-sepolia.blockscout.com/address/0x0000000159C8253802551eEaf8b475db1A50d712)     |
| Optimism Sepolia (11155420) | [0x0000000a3fa5CFe56b202F376cCa7334c93aEB8b](https://optimism-sepolia.blockscout.com/address/0x0000000a3fa5CFe56b202F376cCa7334c93aEB8b) |
| Arbitrum Sepolia (421614)   | [0x00000006399970c8bdad606abD03b1712974E4eA](https://arbiscan.io/address/0x00000006399970c8bdad606abD03b1712974E4eA)                     |
| Gnosis Chiado (10200)       | [0x000000031C0d9df77F390CED953219E561B67089](https://gnosis-chiado.blockscout.com/address/0x000000031C0d9df77F390CED953219E561B67089)    |

See [the contracts-core repo](https://github.com/witnessco/contracts-core) for more details.

## More Info

See [docs.witness.co](https://docs.witness.co) for more background on Witness, or [the contracts-core repo](https://github.com/witnessco/contracts-core) for more details on the contracts.

## Built With

- [Bun](https://bun.sh)
- [feTS](https://github.com/ardatan/feTS)
- [viem](https://github.com/wevm/viem)
