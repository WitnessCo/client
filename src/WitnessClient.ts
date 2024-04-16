import { type NormalizeOAS, OASClient, createClient } from "fets";
import {
	http,
	Address,
	Chain,
	GetContractReturnType,
	Hash,
	PublicClient,
	Transport,
	createPublicClient,
	encodePacked,
	getContract,
	keccak256,
} from "viem";
import {
	type SupportedChainType,
	getSupportedChainFromChainId,
	witnessAbi,
	witnessDeployments,
} from "./contracts";
import type openapi from "./openapi";
import { strArrToHash, strToHash } from "./utils";

/** @internal */
export type OpenapiConfigType = NormalizeOAS<typeof openapi>;
/** @internal */
export type EndpointType = OpenapiConfigType["servers"][number]["url"];

/**
 * The default API URL.
 */
export const DEFAULT_API_URL = "https://api.witness.co" as const;

// Defaults to Base for onchain stuff.
const DEFAULT_ETH_RPC_URL =
	"https://base-mainnet.g.alchemy.com/v2/0EArwrcjeLdLrQ9b-3Nac-dktS4LNMDM" as const;

interface CheckpointResponse {
	chainId: number;
	txHash: string;
	status: "pending" | "included" | "finalized";
	rootHash: string;
	treeSize: string;
	blockNumber: string;
	blockHash: string;
	timestamp: string;
}

/**
 * Represents a client for interacting with the Witness server.
 *
 * @example
 * ```ts
 * import { WitnessClient } from "@witnessco/client";
 *
 * // Instantiate a new client, default params should suffice for now.
 * const witness = new WitnessClient();
 *
 * // Unique string, so we get an unseen leaf hash.
 * const sampleString = `Check the chain! @ ${Date.now()}`;
 * // Helper method for getting the hash of a string.
 * const leafHash = witness.hash(sampleString);
 * console.log(`Timestamping leaf ${leafHash}`);
 *
 * // Post the leafHash to the server.
 * await witness.postLeaf(leafHash);
 * // Use an old leafHash if you don't want to wait for this step.
 * await witness.waitForCheckpointedLeafHash(leafHash);
 * const timestamp = await witness.getTimestampForLeafHash(leafHash);
 * console.log(`Leaf ${leafHash} was timestamped at ${timestamp}`);
 *
 * // Or shorthand for the above:
 * // const timestamp = await witness.postLeafAndGetTimestamp(leafHash);
 * ```
 */
export class WitnessClient {
	/** @internal */
	private readonly client: OASClient<OpenapiConfigType>;
	/** @internal */
	private readonly chain: Promise<SupportedChainType>;
	/** @internal */
	private readonly contract: Promise<
		GetContractReturnType<
			typeof witnessAbi,
			PublicClient<Transport, Chain>,
			Address
		>
	>;

	/**
	 * Constructs an instance of `WitnessClient`.
	 *
	 * @param {string} authToken - The authentication token to use for requests.
	 * @param {string} endpoint - The URL of the Witness server.
	 * @param {typeof fetch} fetchFn - The fetch function to use for requests.
	 * @param {string} ethRpc - The URL of the Ethereum RPC endpoint to use.
	 * 	Implies the chainId used in server calls too.
	 */
	constructor(
		private readonly authToken: string = "",
		endpoint: EndpointType = DEFAULT_API_URL,
		fetchFn: typeof fetch = fetch,
		ethRpc: string = DEFAULT_ETH_RPC_URL,
	) {
		this.client = createClient<OpenapiConfigType>({ endpoint, fetchFn });
		// Initialize contract instance.
		const transport = http(ethRpc);
		const tmpClient = createPublicClient({ transport });
		this.chain = (async () => {
			const maybeChainId = await tmpClient.getChainId();
			return getSupportedChainFromChainId(maybeChainId);
		})();
		this.contract = this.chain.then((chain) => {
			const client = createPublicClient({
				chain,
				transport,
			});
			return getContract({
				client,
				address: witnessDeployments[chain.id],
				abi: witnessAbi,
			});
		});
	}

	/**
	 * Gets the current tree state.
	 *
	 * @returns The current tree state.
	 */
	public async getCurrentTreeState() {
		const res = await this.client["/getTreeState"].get();
		if (!res.ok)
			throw new Error("Error getting current tree state", {
				cause: await res.json(),
			});
		const {
			leafCount,
			merklizedRoot,
			merklizedLeafCount,
			unmerklizedLeafCount,
			checkpointedRoot,
			checkpointedLeafCount,
		} = await res.json();
		return {
			leafCount: BigInt(leafCount),
			merklizedRoot: strToHash(merklizedRoot),
			merklizedLeafCount: BigInt(merklizedLeafCount),
			unmerklizedLeafCount: BigInt(unmerklizedLeafCount),
			checkpointedRoot: strToHash(checkpointedRoot),
			checkpointedLeafCount: BigInt(checkpointedLeafCount),
		};
	}

	/**
	 * Waits for a checkpoint covering the given leaf hash.
	 * This method will wait up to 15 minutes for a checkpoint to be
	 * created covering the given leaf, polling at a 5s interval.
	 *
	 * @param {Hash} leafHash - The leaf to wait for.
	 * @returns The earliest checkpoint that covers the specified leaf.
	 */
	public async waitForCheckpointedLeafHash(leafHash: Hash) {
		const startTime = Date.now();
		const leafIndex = await this.getLeafIndexForHash(leafHash);
		while (true) {
			const { treeSize: treeSizeStr, ...restCheckpoint } =
				await this.getLatestOnchainCheckpoint();
			const treeSize = BigInt(treeSizeStr);
			if (treeSize > leafIndex) {
				return {
					treeSize,
					...restCheckpoint,
				};
			}
			// Timeout if we've been trying for 15 minutes.
			if (Date.now() - startTime > 15 * 60 * 1000) {
				throw new Error(
					`Timeout waiting for checkpoint covering leafIndex ${leafIndex}`,
				);
			}
			// Sleep for 5 second before trying again.
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}

	/**
	 * Posts a leafHash to the server.
	 *
	 * @param leafHash - The leafHash to post.
	 * @returns The index of the posted leafHash.
	 */
	public async postLeaf(leafHash: Hash) {
		const res = await this.client["/postLeafHash"].post({
			json: { leafHash },
			headers: { Authorization: `Bearer ${this.authToken}` },
		});
		if (!res.ok)
			throw new Error(`Error inserting leafHash ${leafHash}`, {
				cause: await res.json(),
			});
		const { leafIndex } = await res.json();
		return { leafHash, leafIndex: BigInt(leafIndex) };
	}

	/**
	 * Posts a leaf and waits until it can return with a
	 * checkpointed proof.
	 *
	 * @remarks
	 * This is a convenience method that combines `postLeaf` and
	 * `waitForCheckpointedLeaf`. Because it waits for a
	 * checkpointed leaf, it may take up to a few minutes to return.
	 *
	 * @param {Hash} leafHash - The leaf to post.
	 * @returns The proof for the specified leaf.
	 */
	public async postLeafAndGetProof(leafHash: Hash) {
		await this.postLeaf(leafHash);
		const { treeSize } = await this.waitForCheckpointedLeafHash(leafHash);
		return this.getProofForLeafHash(leafHash, treeSize);
	}

	/**
	 * Posts a leaf and waits until it can return with a
	 * checkpointed timestamp.
	 *
	 * @remarks
	 * This is a convenience method that combines `postLeaf`,
	 * `waitForCheckpointedLeaf`, and `getTimestampForLeafHash`.
	 * Because it waits for a checkpointed leaf, it may take up
	 * to a few minutes to return.
	 *
	 * @param {Hash} leafHash - The leaf to post.
	 * @returns The timestamp for the specified leaf.
	 */
	public async postLeafAndGetTimestamp(leafHash: Hash) {
		await this.postLeaf(leafHash);
		await this.waitForCheckpointedLeafHash(leafHash);
		return this.getTimestampForLeafHash(leafHash);
	}

	/**
	 * Gets the index of a leaf with the specified hash.
	 *
	 * @param leafHash - The hash of the leaf to search for.
	 * @returns The index of the leaf with the specified hash.
	 */
	public async getTimestampForLeafHash(leafHash: Hash) {
		const res = await this.client["/getTimestampByLeafHash"].get({
			query: { leafHash, chainId: (await this.chain).id },
		});
		if (!res.ok)
			throw new Error(`Error getting timestamp for leafhash ${leafHash}`, {
				cause: await res.json(),
			});
		const { timestamp } = await res.json();
		return new Date(Number(timestamp) * 1000);
	}

	/**
	 * Gets the index of a leaf with the specified hash.
	 *
	 * @param leafHash - The hash of the leaf to search for.
	 * @returns The index of the leaf with the specified hash.
	 */
	public async getLeafIndexForHash(leafHash: Hash) {
		const res = await this.client["/getLeafIndexByHash"].get({
			query: { leafHash },
		});
		if (!res.ok)
			throw new Error(`Error getting leafIndex for hash ${leafHash}`, {
				cause: await res.json(),
			});
		const { leafIndex } = await res.json();
		return BigInt(leafIndex);
	}

	/**
	 * Gets the earliest checkpoint that covers the specified leaf index.
	 *
	 * @param leafIndex - The index of the leaf to search for.
	 * @returns The earliest checkpoint that covers the specified leaf.
	 */
	public async getEarliestCheckpointCoveringLeafIndex(leafIndex: bigint) {
		const res = await this.client[
			"/getEarliestCheckpointCoveringLeafIndex"
		].get({
			query: {
				chainId: (await this.chain).id,
				leafIndex: leafIndex.toString(),
			},
		});
		if (!res.ok)
			throw new Error(
				`Error getting checkpoint covering leafIndex ${leafIndex}`,
				{ cause: await res.json() },
			);
		const {
			blockNumber,
			blockHash,
			timestamp,
			rootHash,
			treeSize,
			txHash,
			...rest
		} = await res.json();
		return {
			...rest,
			blockNumber: BigInt(blockNumber),
			blockHash: strToHash(blockHash),
			timestamp: new Date(Number(timestamp) * 1000),
			rootHash: strToHash(rootHash),
			treeSize: BigInt(treeSize),
			txHash: strToHash(txHash),
		};
	}

	/**
	 * Gets the latest onchain checkpoint.
	 *
	 * @returns The latest onchain checkpoint.
	 */
	public async getLatestOnchainCheckpoint() {
		const res = await this.client["/getLatestCheckpoint"].get({
			query: { chainId: (await this.chain).id },
		});
		if (!res.ok)
			throw new Error("Error getting latest onchain checkpoint", {
				cause: await res.json(),
			});
		const {
			blockNumber,
			blockHash,
			timestamp,
			rootHash,
			treeSize,
			txHash,
			...rest
		} = await res.json();
		return {
			...rest,
			blockNumber: BigInt(blockNumber),
			blockHash: strToHash(blockHash),
			timestamp: new Date(Number(timestamp) * 1000),
			rootHash: strToHash(rootHash),
			treeSize: BigInt(treeSize),
			txHash: strToHash(txHash),
		};
	}

	/**
	 * Gets the latest onchain checkpoints for all chains.
	 *
	 * @returns The latest onchain checkpoint for all chains.
	 */
	public async getLatestCheckpointForAllChains() {
		const res = await this.client["/getLatestCheckpointForAllChains"].get();
		if (!res.ok)
			throw new Error("Error getting latest onchain checkpoint for chains", {
				cause: await res.json(),
			});

		const data: Record<string, CheckpointResponse> = await res.json();
		const transformedData: Record<
			string,
			{ [key: string]: string | bigint | Date | number }
		> = {};

		for (const chainId in data) {
			const {
				blockNumber,
				blockHash,
				timestamp,
				rootHash,
				treeSize,
				txHash,
				...rest
			} = data[chainId];

			transformedData[chainId] = {
				...rest,
				blockNumber: BigInt(blockNumber),
				blockHash: strToHash(blockHash),
				timestamp: new Date(Number(timestamp) * 1000),
				rootHash: strToHash(rootHash),
				treeSize: BigInt(treeSize),
				txHash: strToHash(txHash),
			};
		}

		return transformedData;
	}

	/**
	 * Gets a checkpoint by its transaction hash.
	 *
	 * @param txHash - The transaction hash of the checkpoint to get.
	 * @returns The checkpoint with the specified transaction hash.
	 */
	public async getCheckpointByTxHash(txHash: Hash) {
		const res = await this.client["/getCheckpointByTransactionHash"].get({
			query: { txHash },
		});
		if (!res.ok)
			throw new Error(`Error getting checkpoint for txHash ${txHash}`, {
				cause: await res.json(),
			});
		const { blockNumber, blockHash, timestamp, rootHash, treeSize, ...rest } =
			await res.json();
		return {
			...rest,
			blockNumber: BigInt(blockNumber),
			blockHash: strToHash(blockHash),
			timestamp: new Date(Number(timestamp) * 1000),
			rootHash: strToHash(rootHash),
			treeSize: BigInt(treeSize),
		};
	}

	/**
	 * Gets the Merkle proof for a particular leafHash.
	 *
	 * @param leafHash - The hash of the leaf to get the proof for.
	 * @param targetTreeSize - Optional, the tree size to target for the proof.
	 * @returns The Merkle proof for the specified leaf.
	 */
	public async getProofForLeafHash(leafHash: Hash, targetTreeSize?: bigint) {
		const res = await this.client["/getProofForLeafHash"].get({
			query: { leafHash, targetTreeSize: targetTreeSize?.toString() },
		});
		if (!res.ok)
			throw new Error(`Error getting proof for leafHash ${leafHash}`, {
				cause: await res.json(),
			});
		const { leafIndex, leftHashes, rightHashes, targetRootHash } =
			await res.json();
		return {
			leafIndex: BigInt(leafIndex),
			leafHash,
			leftHashes: strArrToHash(leftHashes),
			rightHashes: strArrToHash(rightHashes),
			targetRootHash: strToHash(targetRootHash),
		};
	}

	/**
	 * Verifies a Merkle proof for a given leaf.
	 *
	 * @remarks
	 * This method calls out to the Witness server, to verify the proof provided
	 * corresponds to an actual checkpoint. It's recommended to cross-check the
	 * proof and checkpoint against the corresponding Witness contract on-chain.
	 *
	 * @param proof - The Merkle proof to verify.
	 * @returns A boolean indicating whether the proof is valid.
	 */
	public async verifyProofServer(proof: {
		leftHashes?: Hash[];
		rightHashes?: Hash[];
		leafHash: Hash;
		leafIndex: bigint;
		targetRootHash: Hash;
	}) {
		const { leafIndex, ...restOfProof } = proof;
		const res = await this.client["/postProof"].post({
			json: { leafIndex: leafIndex.toString(), ...restOfProof },
		});
		if (!res.ok)
			throw new Error("Error verifying proof", { cause: await res.json() });
		return res.json();
	}

	/**
	 * Verifies a Merkle proof for a given leaf against the chain.
	 *
	 * @remarks
	 * This method calls out to the provided RPC node to verify the proof provided
	 * corresponds to a legitimate checkpoint. While a default public RPC node is
	 * provided for convenience, it's recommended to bring your own to avoid any
	 * potential issues such as rate limits.
	 *
	 * @param proof - The Merkle proof to verify.
	 * @returns A boolean indicating whether the proof is valid.
	 */
	public async verifyProofChain(proof: {
		leftHashes?: Hash[];
		rightHashes?: Hash[];
		leafHash: Hash;
		leafIndex: bigint;
		targetRootHash: Hash;
	}) {
		const contract = await this.contract;
		const { leafIndex, leafHash, leftHashes, rightHashes, targetRootHash } =
			proof;
		const res = await contract.read.safeVerifyProof([
			{
				index: leafIndex,
				leaf: leafHash,
				leftRange: leftHashes ?? [],
				rightRange: rightHashes ?? [],
				targetRoot: targetRootHash,
			},
		]);
		return res;
	}

	/**
	 * Hashes a string using the keccak256 algorithm.
	 *
	 * @param {string} str - The string to hash.
	 * @returns {Hash} - The resulting hash.
	 */
	public hash(str: string): Hash {
		const packed = encodePacked(["string"], [str]);
		return keccak256(packed);
	}
}
