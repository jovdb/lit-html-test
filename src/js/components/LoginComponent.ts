namespace components {

	export interface ILoginData {
		userName: string;
		password: string;
	}

	export class LoginComponent extends BaseComponent {

		private userNameErrorMessage: string;
		private userName: string;
		private passwordErrorMessage: string;
		private password: string;
		private readonly onLogin: (data: ILoginData) => void;

		constructor(onLogin: (data: ILoginData) => void) {
			super();
			this.userNameErrorMessage = "";
			this.passwordErrorMessage = "";
			this.onLogin = onLogin;
		}

		private readonly onSubmitClick = (e: Event) => {
			const formEl = e.target as HTMLFormElement;
			const data: ILoginData = {
				userName: (formEl.querySelector<HTMLInputElement>('[name="username"]'))!.value,
				password: (formEl.querySelector<HTMLInputElement>('[name="password"]'))!.value
			};
			this.onLogin(data);
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

		protected getTemplate() {

			const enableSubmit = !!(this.userName && !this.userNameErrorMessage && this.password && !this.passwordErrorMessage);

			return html`
			<form class="login" on-submit=${this.onSubmitClick} autocomplete="off">
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
				<button type="submit" disabled="${!enableSubmit}">Login</button>
			</form>`;
		}
	}

}
