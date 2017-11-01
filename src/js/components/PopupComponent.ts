namespace components {
	export interface IPopupOptions {
		/** Use content if you want to control the entire screen */
		content?: any;
		header?: any;
		body?: any;
		footer?: any;
		canCloseViaOverlay?: boolean;
	}

	/**
	 * Create a Popup screen
	 * Missing:
	 * - Focus
	 *   - Initial focus to popup (away fro button/link that opened it)
	 * - Keyboard handling
	 *   - Esc to close
	 *   - Prevent Tab going outside form
	 */
	export class PopupComponent2<TResult = undefined> extends BaseComponent {

		private resolve: ((value: TResult | undefined) => void) | undefined;

		protected content: () => any;
		protected header: () => any;
		protected body: () => any;
		protected footer: () => any;
		protected canCloseViaOverlay: boolean;

		constructor () {
			super();
			this.canCloseViaOverlay = false;
		}

		private onPopupClicked = (e: Event) => {
			if (this.canCloseViaOverlay && e.target === e.currentTarget) { // clicked on top-level
				if (this.resolve) this.close(undefined);
			}
		}

		/** Start open animation and wait until popup is closed */
		public async openAsync(): Promise<TResult | undefined> {
			if (this.resolve) return Promise.reject(new Error("Popup already opened"));
			return new Promise<TResult | undefined>(resolve => {
				this.resolve = resolve;
				this.update();
				const formEl = this.getChildren()[0].querySelector("form");
				if (formEl) formEl.focus();
			});
		}

		/** Start close animation */
		public close(value: TResult | undefined) {
			if (!this.resolve) throw new Error("Popup not opened");
			const resolve = this.resolve; // capture
			this.resolve = undefined;
			this.invalidate(); // First hide popup
			resolve(value); // Then resolve promise
		}

		protected getTemplate() {
			return html`
				<div class$="popup${this.resolve ? " open" : ""}" on-click="${this.onPopupClicked}">
					<form class="popup-content" tab-index="-1">${this.content ? this.content() : ""}
						${!this.content && this.header ? html`<div class="popup-header">${this.header()}</div>` : ""}
						${!this.content && this.body ? html`<div class="popup-body">${this.body()}</div>` : ""}
						${!this.content && this.footer ? html`<div class="popup-footer">${this.footer()}</div>` : ""}
					</form>
				</div>`;
		}

		/** Add this popup to the DOM */
		public static async openAsync<TResult = undefined>(popup: PopupComponent2<TResult>, targetEl?: HTMLElement) {

			let shouldRemoveComponent = false;
			const addedTarget = !targetEl;

			// Create target element if needed
			if (!targetEl) targetEl = document.body.appendChild(document.createElement("span"));

			// Add to DOM
			lit.render(html`${shouldRemoveComponent ? "" : comp(popup)}`, targetEl);

			// Trigger reflow so animation can start
			// tslint:disable-next-line
			(popup as any).nodePart.startNode.nextSibling.offsetHeight;

			// Start animation
			const popupPromise = popup.openAsync();

			const onClose = () => {
				// Wait until animation completed
				setTimeout(() => {
					shouldRemoveComponent = true;
					popup.update(); // let lit remove it
					if (addedTarget) targetEl!.parentNode!.removeChild(targetEl!); // Remove from DOM
				}, 400);
			};

			return popupPromise.then(val => {
				onClose();
				return val;
			}, err => {
				onClose();
				throw err;
			});
		}
	}

	/**
	 * Create a Popup screen
	 * Missing:
	 * - Focus
	 *   - Initial focus to popup (away fro button/link that opened it)
	 * - Keyboard handling
	 *   - Esc to close
	 *   - Prevent Tab going outside form
	 */
	export class PopupComponent<TResult = undefined> extends BaseComponent {

		private options: IPopupOptions;
		private resolve: ((value: TResult | undefined) => void) | undefined;

		constructor (options: IPopupOptions) {
			super();
			this.options = options;
		}

		private onPopupClicked = (e: Event) => {
			if (this.options.canCloseViaOverlay && e.target === e.currentTarget) { // clicked on top-level
				if (this.resolve) this.close(undefined);
			}
		}

		/** Start open animation and wait until popup is closed */
		public async openAsync(): Promise<TResult | undefined> {
			if (this.resolve) return Promise.reject(new Error("Popup already opened"));
			return new Promise<TResult | undefined>(resolve => {
				this.resolve = resolve;
				this.invalidate();
			});
		}

		/** Start close animation */
		public close(value: TResult | undefined) {
			if (!this.resolve) throw new Error("Popup not opened");
			const resolve = this.resolve; // capture
			this.resolve = undefined;
			this.invalidate(); // First hide popup
			resolve(value); // Then resolve promise
		}

		protected getTemplate() {
			return html`
				<div class$="popup${this.resolve ? " open" : ""}" on-click="${this.onPopupClicked}">
					<div class="popup-content">${this.options.content}
						${!this.options.content && this.options.header ? html`<div class="popup-header">${this.options.header}</div>` : ""}
						${!this.options.content && this.options.body ? html`<div class="popup-body">${this.options.body}</div>` : ""}
						${!this.options.content && this.options.footer ? html`<div class="popup-footer">${this.options.footer}</div>` : ""}
					</div>
				</div>`;
		}

		/** Add this popup to the DOM */
		public static async openAsync<TResult = undefined>(popup: PopupComponent<TResult>, targetEl?: HTMLElement) {

			let shouldRemoveComponent = false;
			const addedTarget = !targetEl;

			// Create target element if needed
			if (!targetEl) targetEl = document.body.appendChild(document.createElement("span"));

			// Add to DOM
			lit.render(html`${shouldRemoveComponent ? "" : comp(popup)}`, targetEl);

			// Trigger reflow so animation can start
			// tslint:disable-next-line
			(popup as any).nodePart.startNode.nextSibling.offsetHeight;

			// Start animation
			const popupPromise = popup.openAsync();

			const onClose = () => {
				// Wait until animation completed
				setTimeout(() => {
					shouldRemoveComponent = true;
					popup.update(); // let lit remove it
					if (addedTarget) targetEl!.parentNode!.removeChild(targetEl!); // Remove from DOM
				}, 400);
			};

			return popupPromise.then(val => {
				onClose();
				return val;
			}, err => {
				onClose();
				throw err;
			});
		}
	}
}
