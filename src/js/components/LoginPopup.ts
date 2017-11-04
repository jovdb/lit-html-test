namespace components {

	export interface ILoginData {
		userName: string;
		password: string;
	}

	export class LoginPopup extends PopupComponent<ILoginData | undefined> {

		private userName: string;
		private userNameErrorMessage: string;
		private password: string;
		private passwordErrorMessage: string;

		constructor() {

			super();
			this.canCloseViaOverlay = true;
			this.userName = "";
			this.password = "";
			this.userNameErrorMessage = "";
			this.passwordErrorMessage = "";
		}

		protected getContentTemplate() {

			return html`
				<div class="popup-content login">
					<div class="popup-header">${icon({name: "user"})} Login</div>
					<div class="popup-body login-body">
						<div class="nvp">
							<div class="nvp__name">Username: </div>
							<div class="nvp__value">
								<input type="text" name="username" on-input="${this.onUserNameChange}" autofocus/>
								<div class$="error-message${this.userNameErrorMessage ? "" : " hide"}">${this.userNameErrorMessage}</div>
							</div>
						</div>
						<div class="nvp">
							<div class="nvp__name">Password: </div>
							<div class="nvp__value">
								<input type="password" name="password" on-input="${this.onPasswordChange}"/>
								<div class$="error-message${this.passwordErrorMessage ? "" : " hide"}">${this.passwordErrorMessage}</div>
							</div>
						</div>
					</div>
					<div class="popup-footer">
						<button on-click="${this.onCancelClick}">Cancel</button>
						<button on-click="${this.onSubmitClick}" disabled="${!this.isSubmitEnabled()}">Login</button>
					</div>
				</div>`;
		}

		private isSubmitEnabled() {
			return !!(this.userName && !this.userNameErrorMessage && this.password && !this.passwordErrorMessage);
		}

		private readonly onSubmitClick = (e: Event) => {

			if (!this.isSubmitEnabled()) return false;

			const popupEl = this.getRootChildren()[0];
			const data: ILoginData = {
				userName: (popupEl.querySelector<HTMLInputElement>('[name="username"]'))!.value,
				password: (popupEl.querySelector<HTMLInputElement>('[name="password"]'))!.value
			};
			this.close(data);
			e.preventDefault();
			e.stopPropagation();
			return false; // Don't perform default GET request
		}

		private readonly onCancelClick = (e: Event) => {
			this.close(undefined);
			e.stopPropagation();
			e.preventDefault(); // Don't perform default GET request
		}

		private readonly validateUserName = (userName: string) => {
			if (!userName) return "Username is required.";
			if (userName.length > 10) return "Username can be maxium 10 characters long.";
			const regex = /^[a-zA-Z0-9_-]+$/g;
			if (!regex.test(userName)) return "Unsupported characters used. Only characters, numbers, '-' and '_' are allowed.";
			return "";
		}

		private readonly validatePassword = (password: string) => {
			if (!password) return "Password is required.";
			if (password.length < 4) return "Password must be at least 4 characters long.";
			return "";
		}

		private readonly onUserNameChange = (e: Event) => {
			const userNameEl = e.target as HTMLInputElement;
			this.userName = userNameEl.value;
			this.userNameErrorMessage = this.validateUserName(this.userName);
			this.invalidate();
		}

		private readonly onPasswordChange = (e: Event) => {
			const passwordEl = e.target as HTMLInputElement;
			this.password = passwordEl.value;
			this.passwordErrorMessage = this.validatePassword(this.password);
			this.invalidate();
		}

		protected onKeyDown(e: KeyboardEvent) {

			const keyCode = e.which || e.keyCode;
			if (keyCode === 13) {
				if (this.isSubmitEnabled()) {
					this.onSubmitClick(e);
				} else {

					// And validation messages
					this.userNameErrorMessage = this.validateUserName(this.userName);
					this.passwordErrorMessage = this.validatePassword(this.password);
					this.invalidate();
				}
				e.preventDefault(); // Don't press form button
			}

			super.onKeyDown(e);
		}
	}

}
