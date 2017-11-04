/*
╭─────────────────╮         ╭──────────────────╮         ╭─────────────────────╮
│ HeaderComponent │         │ HeaderController │         │ Model               │
├─────────────────┤         ├──────────────────┤  read   ├─────────────────────┤   update
│ userName        │<──2,10──┤                  ├───1,9──>│ loggedOnUser        │<───6─────────────────────────────────╮
│ onLogOnUser     ├────3───>│                  │         │                     │                                      │
╰─────────────────╯         │                  │         ╰─────────────────────╯                                      │
                            │                  │         ╭─────────────────────╮       ╭──────────────╮       ╭───────┴────────╮
                            │                  ├────4───>│ Request             │       │ Broadcaster  │       │ RequestHandler │
                            │                  │         ├─────────────────────┤       ├──────────────┤       ├────────────────┤
                            │                  │         ┤ name: "logOnUser"   ├───4──>│ publish()    │<──7───┤ listen for     │
                            │                  │         │ userName: "Jovdb"   │       │              │       │ requests,      │
                            │                  │         │ pasword: "p@ssw0rd" │       │              │       │ handle and     │
                            │                  │         ╰─────────────────────╯       │              │       │ publish a the  │
                            │                  │         ╭─────────────────────╮       │              │       │ response       │
                            │                  │<───8────┤ Respone             │<──8───┤ subscribe()  ├───5──>│                │
                            │                  │         ├─────────────────────┤       │              │       │                │
                            │                  │         │ name: "logOnUser"   │       ╰──────────────╯       ╰────────────────╯
                            │                  │         │ state: "success"    │
                            ╰──────────────────╯         ╰─────────────────────╯
Parts:
- Component: UI component that just renders data based on input and execute callbacks
- Model: contains the application state
- Controller: responsible of:
  - passing the data to the component
  - handling the callbacks of a component
  - can hold local state for the component

Flow:
1: Get username from model
2: Set username to component
3: When user presses 'Logon', onLogOnUser callback is executed
4: Broadcast a logOnUser request
5: RequestHandler listens to 'logOnUser' request
6: RequestHandler handles the request and updates the model (should be the only one that updates the model)
7: RequestHandler broadcast the response
8: Controller listens to logOnUser response (response can PUSH data that is not in the model)
9: Get loggedOnUser from Model (PULL data from model)
10: Update username of component

*/

namespace components {

	export class Header extends BaseComponent {

		protected _title: any = undefined;
		public get title(): any { return this._title; }
		public set title(value: any) {if (this._title !== value) { this._title = value; this.invalidate(); }}

		protected _loggedOnUserName: string;
		public get loggedOnUserName(): string { return this._loggedOnUserName; }
		public set loggedOnUserName(value: string) { if (this._loggedOnUserName !== value) { this._loggedOnUserName = value; this.invalidate(); }}

		private logError: (err: any) => void;
		private onLogOn: (loginData: ILoginData) => void;
		private onLogOff: () => void;

		constructor(logError: (err: any) => void, onLogOn: (loginData: ILoginData) => void, onLogOff: () => void) {
			super();
			this._loggedOnUserName = "";
			this.logError = logError;
			this.onLogOn = onLogOn;
			this.onLogOff = onLogOff;
		}

		private onUserClick = (e: Event) => {
			if (this.loggedOnUserName) {

				// LogOff
				const popup = new OkCancelPopupComponent({
					title: html`${icon({name: "user"})} Log off?`,
					body: `Are you sure you want log off '${this.loggedOnUserName}'?`,
					defaultAnswer: true
				});
				PopupComponent.openAsync(popup)
				.then(shouldLogOff => {
					if (shouldLogOff) this.onLogOff();
				}).catch(this.logError.bind(this));

			} else {

				// LogOn
				LoginPopup.openAsync(new LoginPopup())
				.then(loginData => {
					if (loginData) this.onLogOn(loginData);
				}).catch(this.logError.bind(this));
			}
			e.preventDefault(); // Don't navigate
			e.stopPropagation(); // Handled
		}

		public getTemplate() {
			return html`<div class="header">
				<span class="left">
					<h1>${this._title}</h1>
				</span>
				<span class="right">
					<a href="#login" style="opacity: ${this.loggedOnUserName ? 1 : 0.5}" on-click="${this.onUserClick}" title="${this.loggedOnUserName ? `Click to log of ${this.loggedOnUserName}...` : "Click to log on..."}">
						${icon({name: "user"})}
					</a>
				</span>
			</div>`;
		}
	}

	export class HeaderController {

		public readonly component: Header;
		private readonly model: app.IModel;
		private readonly broadcaster: IBroadcaster;
		private unsubscribe: (() => void) | undefined;

		constructor(model: app.IModel, broadcaster: IBroadcaster = app.broadcaster) {
			this.component = new Header(() => undefined, this.logOnUser.bind(this), this.logOffUser.bind(this));
			this.model = model;
			this.broadcaster = broadcaster;
			this.unsubscribe = app.broadcaster.subscribe(message => {
				if (!app.isResponse(message)) return;
				switch (message.name) {
					case "logOnUser":
					case "logOffUser":
						this.update();
						break;
					default:
						app.fail(message);
						break;
				}
			});
		}

		private update() {
			this.component.loggedOnUserName = this.model.loggedOnUserName;
			this.component.title = this.model.loggedOnUserName ? `Welcome ${this.model.loggedOnUserName}` : "Hello";
		}

		public dispose() {
			if (this.unsubscribe) {
				this.unsubscribe();
				this.unsubscribe = undefined;
			}
		}

		private logOnUser(loginData: ILoginData) {
			this.broadcaster.publish<app.LogOnUserRequest>({
				type: "request",
				name: "logOnUser",
				userName: loginData.userName,
				password: loginData.password
			});
		}

		private logOffUser() {
			this.broadcaster.publish<app.LogOffUserRequest>({
				type: "request",
				name: "logOffUser"
			});
		}
	}

}
