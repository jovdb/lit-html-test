namespace components {

	export class AppComponent extends BaseComponent {

		private readonly header: HeaderComponent;
		private readonly login: LoginComponent;

		constructor() {
			super();
			this.header = new HeaderComponent();
			this.login = new LoginComponent(async ({userName, password}) => { await this.loginUserAsync(userName, password); });
		}

		private async loginUserAsync(userName: string, password: string) {
			const isLoggedOn = await api.loginUserAsync(userName, password);
			if (isLoggedOn) {
				this.header.headerText = `Hello ${userName}`;
			}
		}

		private openPopupAsync = async () => {
			const popup = new PopupComponent({
				content: "Hellow world?"
			});
			return PopupComponent.openAsync(popup);
		}

		protected getTemplate() {
			return html`
				${comp(this.header)}
				${content(html`
					${comp(this.login)}<br/>
					<button on-click="${this.openPopupAsync}">Popup Test</button>
				`)}`;
		}
	}
}
