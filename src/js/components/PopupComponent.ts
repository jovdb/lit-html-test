namespace components {

	/**
	 * Create a Popup screen
	 */
	export abstract class PopupComponent2<TResult = undefined> extends BaseComponent {

		private resolve: ((value: TResult | undefined) => void) | undefined;

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

				// Move focus to form
				const el = this.focusOnStartUp();
				if (el) el.focus();
			});
		}

		protected getSelectableItems (): HTMLElement[] {
			const el = this.getChildren()[0];
			if (el) {
				const focusableEls = el.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a, textarea:not([disabled]), select:not([disabled]), [tabindex]");
				return Array.from(focusableEls);
			}
			return [];
		}

		protected focusOnStartUp (): HTMLElement | undefined {
			const el = this.getChildren()[0];
			if (el) {
				const autoFocusEl = el.querySelector<HTMLElement>("[autofocus]");
				if (autoFocusEl) return autoFocusEl;

				const focusEl = this.getSelectableItems()[0];
				if (focusEl) return focusEl;
			}
			return undefined;
		}


		/** Start close animation */
		public close(value: TResult | undefined) {
			if (!this.resolve) throw new Error("Popup not opened");
			const resolve = this.resolve; // capture
			this.resolve = undefined;
			this.invalidate(); // First hide popup
			resolve(value); // Then resolve promise
		}

		/** Root element must have class popup-content */
		protected abstract getContentTemplate();

		protected getTemplate() {
			return html`
				<div class$="popup${this.resolve ? " open" : ""}" on-click="${this.onPopupClicked}" canCloseViaOverlay>
					${this.getContentTemplate()}
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
				}, 500);
			};

			return popupPromise.then(val => {
				onClose();
				return val;
			}, err => {
				onClose();
				throw err;
			});
		}

		/** Used method to make it overridable */
		protected onKeyDown(e: KeyboardEvent) {
			const keyCode = e.which || e.keyCode;

			// Esc
			if (this.canCloseViaOverlay && keyCode === 27) this.close(undefined);

			// Tab (Prevent tab goes outside poup)
			if (keyCode === 9) {
				const focusableEls = this.getSelectableItems();
				const targetEl = e.target as HTMLElement;
				let focusEl: HTMLElement | undefined;
				if (!e.shiftKey) {
					if (focusableEls[focusableEls.length - 1] === targetEl || focusableEls.indexOf(targetEl) < 0) {
						focusEl = focusableEls[0];
					}
				} else {
					if (focusableEls[0] === targetEl || focusableEls.indexOf(targetEl) < 0) {
						focusEl = focusableEls[focusableEls.length - 1];
					}
				}
				if (focusEl) {
					focusEl.focus();
					e.preventDefault(); // Don't do default Tab
				}
			}

			e.stopPropagation(); // Key presses shouldn't leave popup
		}

		private onKeyDownBinded: any;

		protected afterAttach(el: HTMLElement) {
			this.onKeyDownBinded = (e: KeyboardEvent) => { this.onKeyDown(e); }; // bind this
			el.addEventListener("keydown", this.onKeyDownBinded);
		}

		protected beforeDetach(el: HTMLElement) {
			el.removeEventListener("keydown", this.onKeyDownBinded);
		}
	}
}
