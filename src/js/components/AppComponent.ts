namespace components {

	export class AppComponent extends BaseComponent {

		private readonly header: components.HeaderComponent;
		private readonly login: components.LoginComponent;

		constructor() {
			super();
			this.header = new components.HeaderComponent();
			this.login = new components.LoginComponent(async ({userName, password}) => { await this.loginUserAsync(userName, password); });
		}

		private async loginUserAsync(userName: string, password: string) {
			const isLoggedOn = await api.loginUserAsync(userName, password);
			if (isLoggedOn) {
				this.header.headerText = `Hello ${userName}`;
			}
		}

		protected getTemplate() {
			return html`
				${comp(this.header)}
				${components.content(
					html`${comp(this.login)}`
				)}`;
		}
	}
}
