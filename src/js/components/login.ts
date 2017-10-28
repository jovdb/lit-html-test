namespace components {
	export interface ILoginData {
		userName: string;
		password: string;
	}

	export const login = (userName: string, onLogin: (data: ILoginData) => void) => {

		const onLoginClick = (e: Event) => {
			const formEl = e.target as HTMLFormElement;
			const data: ILoginData = {
				userName: (formEl.querySelector<HTMLInputElement>('[name="username"]'))!.value,
				password: (formEl.querySelector<HTMLInputElement>('[name="password"]'))!.value
			};
			onLogin(data);
			e.preventDefault(); // Don't perform default GET request
		};

		return html`
		<form class="login" on-submit=${onLoginClick}>
			<div class="nvp">
				<div class="nvp__name">Username: </div>
				<div class="nvp__value"><input type="text" name="username" value="${userName}"/></div>
			</div>
			<div class="nvp">
				<div class="nvp__name">Password: </div>
				<div class="nvp__value"><input type="password" name="password" value=""/></div>
			</div>
			<button type="submit">Login</button>
		</form>`;
	};
}