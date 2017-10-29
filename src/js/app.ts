namespace app {
	const appEl = required(document.getElementById("app"), "#app element required")!;
	let loggedOnUserName = "World";

	const loginUserAsync = async (userName: string, password: string) => {
		const isLoggedOn = await api.loginUserAsync(userName, password);
		if (isLoggedOn) {
			loggedOnUserName = userName;
			render();
		}
	};

	export function render() {
		lit.render(html`
			${components.header(`Hello ${loggedOnUserName}`)}
			${components.content(
				html`${components.login("Peter", async ({userName, password}) => { await loginUserAsync(userName, password); })}`
			)}
		`, appEl);
	}

	export function start() {
		render();
	}
}

app.start();