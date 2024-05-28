import type { Infer, RequestParams, Response } from "@kubb/oas";
import type { schema } from "../openapi";

/** @internal */
export type OpenapiConfigType = Infer<typeof schema>;

/** @internal */
export type EndpointType = OpenapiConfigType["servers"][number]["url"];

/** @internal */
export type GetTreeStateResponse = Response<
	OpenapiConfigType,
	"/getTreeState",
	"get"
>;

/** @internal */
export type GetTimestampForLeafHashRequest = RequestParams<
	OpenapiConfigType,
	"/getTimestampByLeafHash",
	"get"
>["query"];

/** @internal */
export type GetTimestampForLeafHashResponse = Response<
	OpenapiConfigType,
	"/getTimestampByLeafHash",
	"get"
>;

/** @internal */
export type GetLeafIndexByHashRequest = RequestParams<
	OpenapiConfigType,
	"/getLeafIndexByHash",
	"get"
>["query"];

/** @internal */
export type GetLeafIndexByHashResponse = Response<
	OpenapiConfigType,
	"/getLeafIndexByHash",
	"get"
>;

/** @internal */
export type GetEarliestCheckpointCoveringLeafIndexRequest = RequestParams<
	OpenapiConfigType,
	"/getEarliestCheckpointCoveringLeafIndex",
	"get"
>["query"];

/** @internal */
export type GetEarliestCheckpointCoveringLeafIndexResponse = Response<
	OpenapiConfigType,
	"/getEarliestCheckpointCoveringLeafIndex",
	"get"
>;

/** @internal */
export type GetLatestCheckpointRequest = RequestParams<
	OpenapiConfigType,
	"/getLatestCheckpoint",
	"get"
>["query"];

/** @internal */
export type GetLatestCheckpointResponse = Response<
	OpenapiConfigType,
	"/getLatestCheckpoint",
	"get"
>;

/** @internal */
export type GetLatestCheckpointForAllChainsResponse = Response<
	OpenapiConfigType,
	"/getLatestCheckpointForAllChains",
	"get"
>;

/** @internal */
export type GetCheckpointByTransactionHashRequest = RequestParams<
	OpenapiConfigType,
	"/getCheckpointByTransactionHash",
	"get"
>["query"];

/** @internal */
export type GetCheckpointByTransactionHashResponse = Response<
	OpenapiConfigType,
	"/getCheckpointByTransactionHash",
	"get"
>;

/** @internal */
export type GetProofForLeafHashRequest = RequestParams<
	OpenapiConfigType,
	"/getProofForLeafHash",
	"get"
>["query"];

/** @internal */
export type GetProofForLeafHashResponse = Response<
	OpenapiConfigType,
	"/getProofForLeafHash",
	"get"
>;

/** @internal */
export type PostLeafRequest = RequestParams<
	OpenapiConfigType,
	"/postLeafHash",
	"post"
>["json"];

/** @internal */
export type PostLeafResponse = Response<
	OpenapiConfigType,
	"/postLeafHash",
	"post"
>;

/** @internal */
export type PostProofRequest = RequestParams<
	OpenapiConfigType,
	"/postProof",
	"post"
>["json"];

/** @internal */
export type PostProofResponse = Response<
	OpenapiConfigType,
	"/postProof",
	"post"
>;
