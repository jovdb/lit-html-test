namespace components {

	export class AppComponent extends BaseComponent {

		private loggedOnUser = "";

		constructor() {
			super();
		}

		private onUserClick = () => {
			if (this.loggedOnUser) {

				// LogOff
				const popup = new OkCancelPopupComponent({
					title: html`${icon("user")} Log off?`,
					body: `Are you sure you want log off '${this.loggedOnUser}'?`,
				});
				PopupComponent.openAsync(popup).then(shouldLogOff => {
					if (shouldLogOff) this.loggedOnUser = "";
				});

			} else {

				// LogOn
				LoginPopup.openAsync(new LoginPopup()).then(loginData => {
					if (loginData) {
						api.loginUserAsync(loginData.userName, loginData.password).then(isLoggedOn => {
							if (isLoggedOn) {
								this.loggedOnUser = loginData.userName;
								this.invalidate();
							}
						});
					}
				});
			}
		}

		protected getTemplate() {
			return html`
				${header(html`
					<span class="left">
						<h1>Hello ${this.loggedOnUser}</h1>
					</span>
					<span class="right">
						<span style="opacity: ${this.loggedOnUser ? 1 : 0.5}" on-click="${this.onUserClick}">
							${icon("user")}
						</span>
					</span>
				`)}
				${content(html`
				Gummies candy canes brownie candy canes candy cake sugar plum lollipop. Jelly beans sesame snaps sesame snaps. Chupa chups gummi bears cotton candy cookie macaroon dragée. Bear claw lollipop cookie sweet roll. Jelly beans gummies marzipan jelly toffee carrot cake bonbon topping dragée. Liquorice sugar plum carrot cake danish jelly beans caramels pie jelly. Jelly-o sweet roll liquorice sweet roll jelly-o macaroon icing tart croissant. Cookie candy canes jujubes. Jujubes jelly beans donut oat cake. Gummies candy canes donut sweet roll. Liquorice gummi bears lemon drops toffee cheesecake biscuit jelly dessert bonbon. Wafer jujubes pie cake. Brownie chocolate cake tootsie roll.
				`)}`;
		}
	}
}
