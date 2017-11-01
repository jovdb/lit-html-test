namespace components {
	export interface IPopupOptions {
		content: any;
		canCloseViaOverlay?: boolean;
	}

	export class PopupComponent<TResult = undefined> extends BaseComponent {

		private options: IPopupOptions;
		private resolve: ((value: TResult | undefined) => void) | undefined;

		constructor (options: IPopupOptions) {
			super();
			this.options = options;
		}

		private onPopupClicked = (e: Event) => {
			if (e.target === e.currentTarget) { // clicked on top-level
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
					${this.options.content ? html`<div class="popup-content">${this.options.content}</div>` : ""}
				</div>`;
		}

		/** Add this popup to the DOM */
		public static async openAsync(popup: PopupComponent, targetEl?: HTMLElement) {

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
