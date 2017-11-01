namespace components {

	export interface ILoginData {
		userName: string;
		password: string;
	}

	export class LoginPopup extends PopupComponent2<ILoginData | undefined> {

		private userName: string;
		private userNameErrorMessage: string;
		private password: string;
		private passwordErrorMessage: string;

		constructor() {

			super();

			const isSubmitEnabled = () => !!(this.userName && !this.userNameErrorMessage && this.password && !this.passwordErrorMessage);

			this.canCloseViaOverlay = true;
			this.header = () => html`${icon("user")} Login`;
			this.body = () => html`
				<form class="login" autocomplete="off">
					<div class="nvp">
						<div class="nvp__name">Username: </div>
						<div class="nvp__value">
							<input type="text" name="username" on-input="${this.onUserNameChange}"/>
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
				</form>`;
			this.footer = () => html`
				<button on-click="${this.onCancelClick}">Cancel</button>
				<button on-click="${this.onSubmitClick}" type="submit" disabled="${!isSubmitEnabled()}">Login</button>
			`;
			this.userName = "";
			this.password = "";
			this.userNameErrorMessage = "";
			this.passwordErrorMessage = "";
		}

		private readonly onSubmitClick = (e: Event) => {
			const popupEl = this.getChildren()[0];
			const data: ILoginData = {
				userName: (popupEl.querySelector<HTMLInputElement>('[name="username"]'))!.value,
				password: (popupEl.querySelector<HTMLInputElement>('[name="password"]'))!.value
			};
			this.close(data);
			e.preventDefault(); // Don't perform default GET request
			e.stopPropagation();
		}

		private readonly onCancelClick = (e: Event) => {
			this.close(undefined);
			e.stopPropagation();
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
	}

}
