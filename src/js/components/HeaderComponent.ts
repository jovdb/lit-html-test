namespace components {

	export class HeaderComponent extends BaseComponent {
		public headerText = "Hello World";

		public render() {
			return html`<div class="header"><h1>${this.headerText}</h1></div>`;
		}
	}

}