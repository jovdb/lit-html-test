namespace components {
	export interface IOKCancelPopupOptions {
		title: string;
		body: string;
		okButtonText?: string;
		cancelButtonText?: string;
		// defaultButton
	}

	export class OkCancelPopupComponent extends PopupComponent<boolean | undefined> {

		constructor(options: IOKCancelPopupOptions) {

			const {
				okButtonText = "OK",
				cancelButtonText = "Cancel"
			} = options;

			const onOkClick = (e: Event) => {
				this.close(true);
				e.stopPropagation();
			};

			const onCancelClick = (e: Event) => {
				this.close(false);
				e.stopPropagation();
			};

			super({
				header: options.title,
				body: options.body,
				footer: html`
					<button on-click="${onOkClick}" style="margin-right: 0.5em">${okButtonText}</button>
					<button on-click="${onCancelClick}">${cancelButtonText}</button>`
			});
		}
	}
}
