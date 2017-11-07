
namespace app {

	/*
	let lastCounter = 0;
	// Id is to be able to match result with request
	const id = (++lastCounter).toString(36);
*/
	function performAsyncAction<TRequest extends Request, TResult>(request: TRequest, startPromise: () => Promise<TResult>): void {

		startPromise()
			.then(result => {
				// Broadcast Success
				broadcaster.publish<Response<TRequest, TResult>>({
					type: "response",
					name: request.name,
					request,
					state: ResponseState.Success,
					result
				});
			})
			.catch(error => {
				// Broadcast Error
				broadcaster.publish<Response<TRequest, TResult>>({
					type: "response",
					name: request.name,
					request,
					state: ResponseState.Failed,
					error
				});
			});
	}

	function performAction<TRequest extends Request, TResult>(request: TRequest, fn: () => TResult): void {
		try {
			const result = fn();
			// Broadcast Success
			broadcaster.publish<Response<TRequest, TResult>>({
				type: "response",
				name: request.name,
				request,
				state: ResponseState.Success,
				result
			});
		} catch (error) {
			// Broadcast Error
			broadcaster.publish<Response<TRequest, TResult>>({
				type: "response",
				name: request.name,
				request,
				state: ResponseState.Failed,
				error
			});
		}
	}

	// Listen to messages
	broadcaster.subscribe((message: IMessage) => {

		if (!messages.isRequest(message)) return;

		switch (message.name) {
			case "logOnUser":
				performAsyncAction(message, async () => {
					await api.loginUserAsync(message.userName, message.password);
					model.loggedOnUserName = message.userName;
				});
				break;

			case "logOffUser":
				performAction(message, () => {
					// Do something like clear Cookies
					model.loggedOnUserName = "";
				});
				break;

			default:
				fail(message);
				break;
		}

	});
}