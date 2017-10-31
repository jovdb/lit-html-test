namespace app {
	const appEl = required(document.getElementById("app"), "#app element required")!;

	const header = new components.HeaderComponent();
	const login = new components.LoginComponent(async ({userName, password}) => { await loginUserAsync(userName, password); });

	const loginUserAsync = async (userName: string, password: string) => {
		const isLoggedOn = await api.loginUserAsync(userName, password);
		if (isLoggedOn) {
			header.headerText = `Hello ${userName}`;
			render();
		}
	};

	export function render() {
		lit.render(html`
			${comp(header)},
			${components.content(
				html`${comp(login)}`
			)}
		`, appEl);
	}

	export function start() {
		render();
	}
}

app.start();