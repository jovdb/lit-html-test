namespace components {

	export interface ILoginData {
		userName: string;
		password: string;
	}

	export class LoginComponent extends BaseComponent {

		public userName = "";
		protected onLogin: (data: ILoginData) => void;

		constructor(onLogin: (data: ILoginData) => void) {
			super();
			this.onLogin = onLogin;
		}

		private onLoginClick = (e: Event) => {
			const formEl = e.target as HTMLFormElement;
			const data: ILoginData = {
				userName: (formEl.querySelector<HTMLInputElement>('[name="username"]'))!.value,
				password: (formEl.querySelector<HTMLInputElement>('[name="password"]'))!.value
			};
			this.onLogin(data);
			e.preventDefault(); // Don't perform default GET request
		}

		public render() {
			return html`
			<form class="login" on-submit=${this.onLoginClick}>
				<div class="nvp">
					<div class="nvp__name">Username: </div>
					<div class="nvp__value"><input type="text" name="username" value="${this.userName}"/></div>
				</div>
				<div class="nvp">
					<div class="nvp__name">Password: </div>
					<div class="nvp__value"><input type="password" name="password" value=""/></div>
				</div>
				<button type="submit">Login</button>
			</form>`;
		}
	}

}