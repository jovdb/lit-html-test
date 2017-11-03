namespace components {
	export interface IOKCancelPopupOptions {
		title: any;
		body: string;
		trueButtonText?: string;
		falseButtonText?: string;
		defaultAnswer?: boolean | undefined;
	}

	export class OkCancelPopupComponent extends PopupComponent2<boolean | undefined> {

		private options: IOKCancelPopupOptions;

		constructor(options: IOKCancelPopupOptions) {
			super();
			this.options = {...options}; // clone to prevent change
			this.canCloseViaOverlay = true;
		}

		protected getContentTemplate() {

			const {
				title,
				body,
				trueButtonText = "OK",
				falseButtonText = "Cancel",
				defaultAnswer
			} = this.options;

			const onOkClick = (e: Event) => {
				this.close(true);
				e.stopPropagation();
			};

			const onCancelClick = (e: Event) => {
				this.close(false);
				e.stopPropagation();
			};

			return html`
				<div class="popup-content">
					<div class="popup-header">${title}</div>
					<div class="popup-body">${body}</div>
					<div class="popup-footer">
						<button on-click="${onCancelClick}" autofocus="${defaultAnswer === false}">${falseButtonText}</button>
						<button on-click="${onOkClick}" autofocus="${defaultAnswer === true}">${trueButtonText}</button>
					</div>
				</div>`;
		}

	}
}
