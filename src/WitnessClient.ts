import { Hash, encodePacked, keccak256 } from "viem";
import { getContractFromChainConfig } from "./contracts/index.js";
import { defaultChainConfig, defaultServerConfig } from "./defaults.js";
import { createRequestClient } from "./requestClient.js";
import type {
	EndpointType,
	GetCheckpointByTransactionHashRequest,
	GetCheckpointByTransactionHashResponse,
	GetEarliestCheckpointCoveringLeafIndexRequest,
	GetEarliestCheckpointCoveringLeafIndexResponse,
	GetLatestCheckpointForAllChainsResponse,
	GetLatestCheckpointRequest,
	GetLatestCheckpointResponse,
	GetLeafIndexByHashRequest,
	GetLeafIndexByHashResponse,
	GetProofForLeafHashRequest,
	GetProofForLeafHashResponse,
	GetTimestampForLeafHashRequest,
	GetTimestampForLeafHashResponse,
	GetTreeStateResponse,
	PostLeafRequest,
	PostLeafResponse,
	PostProofRequest,
	PostProofResponse,
} from "./types/api.js";
import type {
	ChainConfig,
	Config,
	WitnessContractType,
} from "./types/config.js";
import { strArrToHash, strToHash } from "./utils.js";

/**
 * Represents a client for interacting with the Witness server and contract.
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
	private readonly client: ReturnType<typeof createRequestClient>;
	/** @internal */
	private readonly chainId: number;
	/** @internal */
	private contract: WitnessContractType = defaultChainConfig.contract;

	/**
	 * Constructs an instance of `WitnessClient`.
	 *
	 * An optional authToken can be provided as either the sole argument or as part of a config object:
	 * ```ts
	 * const authToken = "my-auth-token";
	 * new WitnessClient(authToken);
	 * ```
	 *
	 * Full client config customization options are as follows:
	 *
	 * ```ts
	 *  // ChainConfig lets you configure how proofs are verified against a blockchain.
	 *  type ChainConfig = { ethRpc: string };
	 *  // ServerConfig lets you configure how the client interacts with the Witness server.
	 *  type ServerConfig = { authToken: string; chainId: number; endpoint: string; fetchFn: typeof fetch };
	 *  // All values are optional and can be comfortably omitted.
	 *  type Config = { chain?: ChainConfig; server?: ServerConfig };
	 *  // WitnessClient can be instantiated with an optional config object.
	 *  // Example usage (populate with your config values).
	 *  const chain = { ethRpc: "my-rpc-url.com/" };
	 *  const server = { authToken: "my-auth-token", chainId: 1 }
	 *  const myConfig: Config = { chain: chainConfig, server: serverConfig };
	 *  new WitnessClient(myConfig);
	 * ```
	 *
	 * @param {string | Config | undefined} [config={}] - Optional config entailing either just an auth token or a richer server & chain configurations for the client.
	 * @param {ServerConfig | undefined} [config.server] - Optional server configuration.
	 * @param {string | undefined} [config.server.authToken] - Optional authentication token.
	 * @param {number | undefined} [config.server.chainId] - Optional chain ID.
	 * @param {string | undefined} [config.server.endpoint] - Optional API URL.
	 * @param {ChainConfig | undefined} [config.chain] - Optional chain configuration.
	 * @param {string | undefined} [config.chain.ethRpc] - Optional Ethereum RPC endpoint.
	 */
	constructor(config: string | Config = "") {
		const normalizedConfig: Config =
			typeof config === "string" ? { server: { authToken: config } } : config;
		const { chain, server } = normalizedConfig;
		// Setup chain config if present.
		if (chain) {
			getContractFromChainConfig(chain).then((contract) => {
				this.contract = contract;
			});
		}

		// Set up server config.
		const { authToken, chainId, endpoint } = {
			...defaultServerConfig,
			...server,
		};
		this.chainId = chainId;
		this.client = createRequestClient(endpoint as EndpointType, authToken);
	}

	/**
	 * Gets the current tree state.
	 *
	 * @returns The current tree state.
	 */
	public async getCurrentTreeState() {
		const {
			leafCount,
			merklizedRoot,
			merklizedLeafCount,
			unmerklizedLeafCount,
			checkpointedRoot,
			checkpointedLeafCount,
		} = await this.client<GetTreeStateResponse>({
			method: "get",
			url: "/getTreeState",
			params: {},
		});
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
	 * @param {number} chainId - Optional, the chain ID to query for.
	 * @returns The earliest checkpoint that covers the specified leaf.
	 */
	public async waitForCheckpointedLeafHash(
		leafHash: Hash,
		chainId: number = this.chainId,
	) {
		const startTime = Date.now();
		const leafIndex = await this.getLeafIndexForHash(leafHash);
		while (true) {
			const { treeSize: treeSizeStr, ...restCheckpoint } =
				await this.getLatestOnchainCheckpoint(chainId);
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
	 * @param {Hash} leafHash - The leafHash to post.
	 * @returns The index of the posted leafHash.
	 */
	public async postLeaf(leafHash: Hash) {
		const { leafIndex } = await this.client<PostLeafResponse, PostLeafRequest>({
			method: "post",
			url: "/postLeafHash",
			data: { leafHash },
		});
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
	 * @param {number} chainId - Optional, the chain ID to get a proof for.
	 * @returns The proof for the specified leaf.
	 */
	public async postLeafAndGetProof(
		leafHash: Hash,
		chainId: number = this.chainId,
	) {
		await this.postLeaf(leafHash);
		const { treeSize } = await this.waitForCheckpointedLeafHash(
			leafHash,
			chainId,
		);
		return this.getProofForLeafHash(leafHash, { targetTreeSize: treeSize });
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
	 * @param {number} chainId - Optional, the chain ID to get a timestamp for.
	 * @returns The timestamp for the specified leaf.
	 */
	public async postLeafAndGetTimestamp(
		leafHash: Hash,
		chainId: number = this.chainId,
	) {
		await this.postLeaf(leafHash);
		await this.waitForCheckpointedLeafHash(leafHash, chainId);
		return this.getTimestampForLeafHash(leafHash, chainId);
	}

	/**
	 * Gets the index of a leaf with the specified hash.
	 *
	 * @param {Hash} leafHash - The hash of the leaf to search for.
	 * @param {number} chainId - Optional, the chain ID to get a timestamp for.
	 * @returns The index of the leaf with the specified hash.
	 */
	public async getTimestampForLeafHash(
		leafHash: Hash,
		chainId: number = this.chainId,
	) {
		const { timestamp } = await this.client<
			GetTimestampForLeafHashResponse,
			GetTimestampForLeafHashRequest
		>({
			method: "get",
			url: "/getTimestampByLeafHash",
			params: { leafHash, chainId },
		});
		return new Date(Number(timestamp) * 1000);
	}

	/**
	 * Gets the index of a leaf with the specified hash.
	 *
	 * @param {Hash} leafHash - The hash of the leaf to search for.
	 * @returns The index of the leaf with the specified hash.
	 */
	public async getLeafIndexForHash(leafHash: Hash) {
		const res = await this.client<
			GetLeafIndexByHashResponse,
			GetLeafIndexByHashRequest
		>({
			method: "get",
			url: "/getLeafIndexByHash",
			params: { leafHash },
		});
		return BigInt(res.leafIndex);
	}

	/**
	 * Gets the earliest checkpoint that covers the specified leaf index.
	 *
	 * @param {bigint} leafIndex - The index of the leaf to search for.
	 * @param {number} chainId - Optional, the chain ID to search on.
	 * @returns The earliest checkpoint that covers the specified leaf.
	 */
	public async getEarliestCheckpointCoveringLeafIndex(
		leafIndex: bigint,
		chainId: number = this.chainId,
	) {
		const {
			blockNumber,
			blockHash,
			timestamp,
			rootHash,
			treeSize,
			txHash,
			...rest
		} = await this.client<
			GetEarliestCheckpointCoveringLeafIndexResponse,
			GetEarliestCheckpointCoveringLeafIndexRequest
		>({
			method: "get",
			url: "/getEarliestCheckpointCoveringLeafIndex",
			params: { chainId, leafIndex: leafIndex.toString() },
		});
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
	 * @param chainId - Optional, the chain ID to get the latest checkpoint for.
	 * @returns The latest onchain checkpoint.
	 */
	public async getLatestOnchainCheckpoint(chainId = this.chainId) {
		const {
			blockNumber,
			blockHash,
			timestamp,
			rootHash,
			treeSize,
			txHash,
			...rest
		} = await this.client<
			GetLatestCheckpointResponse,
			GetLatestCheckpointRequest
		>({
			method: "get",
			url: "/getLatestCheckpoint",
			params: { chainId },
		});
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
		const res = await this.client<GetLatestCheckpointForAllChainsResponse>({
			method: "get",
			url: "/getLatestCheckpointForAllChains",
			params: {},
		});
		const transformedData: Record<
			string,
			{ [key: string]: string | bigint | Date | number }
		> = {};

		for (const chainId in res) {
			const {
				blockNumber,
				blockHash,
				timestamp,
				rootHash,
				treeSize,
				txHash,
				...rest
			} = res[chainId];

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
	 * @param {Hash} txHash - The transaction hash of the checkpoint to get.
	 * @returns The checkpoint with the specified transaction hash.
	 */
	public async getCheckpointByTxHash(txHash: Hash) {
		const { blockNumber, blockHash, timestamp, rootHash, treeSize, ...rest } =
			await this.client<
				GetCheckpointByTransactionHashResponse,
				GetCheckpointByTransactionHashRequest
			>({
				method: "get",
				url: "/getCheckpointByTransactionHash",
				params: { txHash },
			});
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
	 * @param {Hash} leafHash - The hash of the leaf to get the proof for.
	 * @param {Object} [options={}] - The options object.
	 * @param {number} [options.chainId=this.chainId] - Optional. The chain ID to target for the proof.
	 *     If not provided and `targetTreeSize` is not set, the latest checkpoint for this chainId will be targeted.
	 * @param {bigint} [options.targetTreeSize] - Optional. The tree size to target for the proof.
	 *     This takes precedence over `chainId`.
	 * @returns The Merkle proof for the specified leaf.
	 */
	public async getProofForLeafHash(
		leafHash: Hash,
		{
			targetTreeSize,
			chainId = this.chainId,
		}: { chainId?: number; targetTreeSize?: bigint } = {},
	) {
		const { leafIndex, leftHashes, rightHashes, targetRootHash } =
			await this.client<
				GetProofForLeafHashResponse,
				GetProofForLeafHashRequest
			>({
				method: "get",
				url: "/getProofForLeafHash",
				params: {
					leafHash,
					chainId,
					targetTreeSize: targetTreeSize?.toString(),
				},
			});
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
		const res = await this.client<PostProofResponse, PostProofRequest>({
			method: "post",
			url: "/postProof",
			data: { leafIndex: leafIndex.toString(), ...restOfProof },
		});
		return res.success;
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
	 * @param config - Optional, the chain configuration to use for verification.
	 * @returns A boolean indicating whether the proof is valid.
	 */
	public async verifyProofChain(
		proof: {
			leftHashes?: Hash[];
			rightHashes?: Hash[];
			leafHash: Hash;
			leafIndex: bigint;
			targetRootHash: Hash;
		},
		config?: ChainConfig,
	) {
		const contract = config
			? await getContractFromChainConfig(config)
			: this.contract;
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
