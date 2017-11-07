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
		private readonly onLoginAsync: (loginData: ILoginData) => Promise<{}>;
		private isBusy: boolean;
		private loginErrorMessage: string;


		constructor(onLoginAsync: (loginData: ILoginData) => Promise<{}>) {

			super();
			this.onLoginAsync = onLoginAsync;
			this.canCloseViaOverlay = true;
			this.userName = "";
			this.password = "";
			this.userNameErrorMessage = "";
			this.passwordErrorMessage = "";
			this.isBusy = false;
			this.loginErrorMessage = "";
		}

		protected getContentTemplate() {

			const getStatusType = () => {
				return this.isBusy
				? "validating"
				: this.loginErrorMessage
					? "error"
					: "";
			};

			const getStatusMessage = () => {
				return this.isBusy
					? "Validating your credentials..."
					: this.loginErrorMessage
						? this.loginErrorMessage
						: "";
			};

			return html`
				<div class="popup-content login">
					<div class="popup-header">${icon({name: "user"})} Login</div>
					<div class="popup-body login-body">
						<div class="nvp">
							<div class="nvp__name">Username: </div>
							<div class="nvp__value">
								<input type="text" name="username" on-input="${this.onUserNameChange}" autofocus readOnly="${this.isBusy}"/>
								<div class$="error-message${this.userNameErrorMessage ? "" : " hide"}">${this.userNameErrorMessage}</div>
							</div>
						</div>
						<div class="nvp">
							<div class="nvp__name">Password: </div>
							<div class="nvp__value">
								<input type="password" name="password" on-input="${this.onPasswordChange}" readOnly="${this.isBusy}"/>
								<div class$="error-message${this.passwordErrorMessage ? "" : " hide"}">${this.passwordErrorMessage}</div>
							</div>
						</div>
					</div>
					<div class="popup-footer">
						<span class$="message ${getStatusType()}">${getStatusMessage()}</span>
						<span style="white-space: nowrap">
							<button on-click="${this.onCancelClick}" disabled="${!this.isCancelEnabled()}">Cancel</button>
							<button on-click="${this.onSubmitClick}" disabled="${!this.isSubmitEnabled()}">Login</button>
						</span>
					</div>
				</div>`;
		}

		private isSubmitEnabled() {
			return !this.isBusy && !!(this.userName && !this.userNameErrorMessage && this.password && !this.passwordErrorMessage);
		}

		private isCancelEnabled() {
			return !this.isBusy;
		}

		private readonly onSubmitClick = async (e: Event) => {

			if (!this.isSubmitEnabled()) return false;

			const popupEl = this.getRootChildren()[0];
			const data: ILoginData = {
				userName: (popupEl.querySelector<HTMLInputElement>('[name="username"]'))!.value,
				password: (popupEl.querySelector<HTMLInputElement>('[name="password"]'))!.value
			};

			const canCloseViaOverlay = this.canCloseViaOverlay;
			try {

				this.isBusy = true;
				this.canCloseViaOverlay = false; // Prevent window can be closed
				this.loginErrorMessage = "";
				this.invalidate();

				await this.onLoginAsync(data);

				this.isBusy = false;
				this.canCloseViaOverlay = canCloseViaOverlay; // Prevent window can be closed
				this.close(data);
			} catch (error) {

				this.isBusy = false;
				this.canCloseViaOverlay = canCloseViaOverlay; // Prevent window can be closed

				// Show error message
				this.loginErrorMessage = error && error.message ? error.message : error;
				this.update();

				// Focus first selectable element
				const focusEl = this.getSelectableItems()[0];
				if (focusEl) focusEl.focus();
			}
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
			const userNameErrorMessage = this.validateUserName(this.userName);
			if (this.userNameErrorMessage !== userNameErrorMessage) {
				this.userNameErrorMessage = userNameErrorMessage;
				this.invalidate();
			}
		}

		private readonly onPasswordChange = (e: Event) => {
			const passwordEl = e.target as HTMLInputElement;
			this.password = passwordEl.value;
			const passwordErrorMessage = this.validatePassword(this.password);
			if (this.passwordErrorMessage === passwordErrorMessage) {
				this.passwordErrorMessage = passwordErrorMessage;
				this.invalidate();
			}
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
