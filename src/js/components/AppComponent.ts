namespace components {

	export class AppComponent extends BaseComponent {

		private loggedOnUser = "";
		private lastErrorMessage = "";

		constructor() {
			super();
		}

		private logError(err: any) {
			this.lastErrorMessage = err && err.message ? err.message : err.toString();
		}

		private onUserClick = (e: Event) => {
			if (this.loggedOnUser) {

				// LogOff
				const popup = new OkCancelPopupComponent({
					title: html`${icon("user")} Log off?`,
					body: `Are you sure you want log off '${this.loggedOnUser}'?`,
					defaultAnswer: true
				});
				PopupComponent2.openAsync(popup)
				.then(shouldLogOff => {
					if (shouldLogOff) {
						this.loggedOnUser = "";
						this.invalidate();
					}
				}).catch(this.logError.bind(this));

			} else {

				// LogOn
				LoginPopup.openAsync(new LoginPopup())
				.then(loginData => {
					if (loginData) {
						api.loginUserAsync(loginData.userName, loginData.password)
						.then(isLoggedOn => {
							if (isLoggedOn) {
								this.loggedOnUser = loginData.userName;
								this.invalidate();
							}
						}).catch(this.logError.bind(this));
					}
				}).catch(this.logError.bind(this));
			}
			e.preventDefault(); // Don't navigate
			e.stopPropagation(); // Handled

		}

		protected getTemplate() {
			return html`
				${header(html`
					<span class="left">
						<h1>Hello ${this.loggedOnUser}</h1>
					</span>
					<span class="right">
						<a href="#login" style="opacity: ${this.loggedOnUser ? 1 : 0.5}" on-click="${this.onUserClick}">
							${icon("user")}
						</a>
					</span>
				`)}
				${content(html`
					Gummies candy canes brownie candy canes candy cake sugar plum lollipop. Jelly beans sesame snaps sesame snaps. Chupa chups gummi bears cotton candy cookie macaroon dragée. Bear claw lollipop cookie sweet roll. Jelly beans gummies marzipan jelly toffee carrot cake bonbon topping dragée. Liquorice sugar plum carrot cake danish jelly beans caramels pie jelly. Jelly-o sweet roll liquorice sweet roll jelly-o macaroon icing tart croissant. Cookie candy canes jujubes. Jujubes jelly beans donut oat cake. Gummies candy canes donut sweet roll. Liquorice gummi bears lemon drops toffee cheesecake biscuit jelly dessert bonbon. Wafer jujubes pie cake. Brownie chocolate cake tootsie roll.
					<div class="error">${this.lastErrorMessage}</div>
				`)}`;
		}
	}
}
