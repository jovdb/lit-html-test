
namespace app {

	function performAsyncAction<TName extends string, TResult>(name: TName, startPromise: () => Promise<TResult>): void {

		// Broadcast Start
		const startedResponse: AsyncResponse<TName, TResult> = {
			type: "response",
			name,
			state: AsyncState.Started
		};
		broadcaster.publish(startedResponse);

		startPromise()
		.then(result => {
			// Broadcast Success
			const response: AsyncResponse<TName, TResult> = {
				type: "response",
				name,
				state: AsyncState.Success,
				result
			};
			broadcaster.publish(response);
		})
		.catch(error => {
			// Broadcast Error
			const response: AsyncResponse<TName, TResult> = {
				type: "response",
				name,
				state: AsyncState.Failed,
				error
			};
			broadcaster.publish(response);
		});

	}

	// Listen to messages
	broadcaster.subscribe((message: IMessage) => {

		if (!isRequest(message)) return;

		switch (message.name) {
			case "logOnUser":

				performAsyncAction(message.name, async () => {
					await api.loginUserAsync(message.userName, message.password);
					model.loggedOnUserName = message.userName;
				});
				break;

			case "logOffUser":
				// Clear Cookies
				model.loggedOnUserName = "";
				broadcaster.publish<LogOffUserResponse>({
					type: "response",
					name: message.name
				});
				break;

			default:
				fail(message);
				break;
		}

	});
}