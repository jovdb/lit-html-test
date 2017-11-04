/*
╭────────────────────────────────╮
│ Model                          │
├────────────────────────────────┤
│ loggedOnUserName               │
╰────────────────────────────────╯
*/

namespace app {

	// Actions
	export type Request<TName extends string, TPayload = {}> = IMessage & {
		readonly type: "request";
		readonly name: TName;
	} & TPayload;
	export type LogOnUserRequest = Request<"logOnUser", { userName: string; password: string }>;
	export type LogOffUserRequest = Request<"logOffUser">;
	export type AllowedRequests = LogOnUserRequest | LogOffUserRequest;

	// Messages
	export enum AsyncState {
		Started = "started",
		Success = "success",
		Failed = "failed"
	}

	export type Response<TName extends string, TPayLoad = {}> = IMessage & {
		readonly type: "response";
		readonly name: TName;
	} & TPayLoad;

	/** A message used when performing an async action
	 * It has 3 states: Busy, Failed, Success
	 */
	export type AsyncResponse<TName extends string, TResult = {}> = (
		Response<TName, {readonly state: AsyncState.Started}> |
		Response<TName, {readonly state: AsyncState.Failed; error: any}> |
		Response<TName, {readonly state: AsyncState.Success; result: TResult}>
	);

	export type LogOnUserResponse = AsyncResponse<"logOnUser">;
	export type LogOffUserResponse = Response<"logOffUser">;
	export type AllowedResponses = LogOnUserResponse | LogOffUserResponse;

	export function isRequest(message: IMessage): message is AllowedRequests {
		return message && (message as Request<string>).type === "request";
	}

	export function isResponse(message: IMessage): message is AllowedResponses {
		return message && (message as Response<string>).type === "response";
	}
}