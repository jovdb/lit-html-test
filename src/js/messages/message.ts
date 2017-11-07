namespace app {

	// Request
	export type Request<TName extends string = string, TPayload = {}> = IMessage & {
		readonly type: "request";
		readonly name: TName;
	} & Readonly<TPayload>;

	// Async Request
	export enum ResponseState {
		Success = "success",
		Failed = "failed"
	}

	export type SuccessResponse<TRequest extends Request = Request, TResult = {}> = IMessage & {
		readonly type: "response";
		readonly name: TRequest["name"];
		readonly request: TRequest;
		readonly state: ResponseState.Success;
		readonly result: Readonly<TResult>;
	};

	export type FailResponse<TRequest extends Request = Request> = IMessage & {
		readonly type: "response";
		readonly name: TRequest["name"];
		readonly request: TRequest;
		readonly state: ResponseState.Failed;
		readonly error: any;
	};

	/** This response can be used for sync and asnc response */
	export type Response<TRequest extends Request = Request, TResult = {}> = IMessage & (SuccessResponse<TRequest, TResult> | FailResponse<TRequest>);

	export type AllowedRequests = LogOnUserRequest | LogOffUserRequest;
	export type AllowedResponses = LogOnUserResponse | LogOffUserResponse;

}

namespace messages {
	export function isRequest(message: IMessage): message is app.AllowedRequests {
		return message && (message as app.Request).type === "request";
	}

	export function isResponse(message: IMessage): message is app.AllowedResponses {
		return message && (message as app.Response).type === "response" && !!(message as app.Response).request;
	}

	export function isResponseOf<TRequest extends app.Request>(message: IMessage, request: TRequest): message is app.Response<app.Request> {
		return isResponse(message) && isRequest(request) && message.name === request.name;
	}

	export async function waitForResponseAsync<TRequest extends app.Request, TResponse extends app.Response<TRequest>>(request: TRequest): Promise<TResponse> {
		return new Promise<TResponse>((resolve) => {
			const unsubscribe = app.broadcaster.subscribe(message => {
				if (messages.isResponseOf<TRequest>(message, request)) {
					unsubscribe();
					resolve(message as TResponse);
				}
			});
		});
	}

	/**
	 * Promise that will resove with the response result or fail with the response  error
	 */
	export async function responseAsAsync<TRequest extends app.Request, TResult extends {}>(request: TRequest): Promise<TResult> {
		return new Promise<TResult>((resolve, reject) => {
			const unsubscribe = app.broadcaster.subscribe(message => {
				if (messages.isResponseOf<TRequest>(message, request)) {
					unsubscribe();
					if (message.state === app.ResponseState.Failed) reject((message as app.FailResponse<TRequest>).error);
					resolve((message as app.SuccessResponse<TRequest, TResult>).result);
				}
			});
		});
	}

}