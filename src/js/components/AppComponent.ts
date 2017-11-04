namespace components {

	export class AppComponent extends BaseComponent {

		private lastErrorMessage = "";

		constructor() {
			super();
		}

		private header: Header;
		protected getHeader() {
			if (!this.header) {
				const headerController = new HeaderController(app.model);
				this.header = headerController.component;
				this.header.title = "Hello";
			}
			return this.header;
		}

		private content: Content;
		protected getContent() {
			if (!this.content) {
				this.content = new Content();
				this.content.content = html`
				Gummies candy canes brownie candy canes candy cake sugar plum lollipop. Jelly beans sesame snaps sesame snaps. Chupa chups gummi bears cotton candy cookie macaroon dragée. Bear claw lollipop cookie sweet roll. Jelly beans gummies marzipan jelly toffee carrot cake bonbon topping dragée. Liquorice sugar plum carrot cake danish jelly beans caramels pie jelly. Jelly-o sweet roll liquorice sweet roll jelly-o macaroon icing tart croissant. Cookie candy canes jujubes. Jujubes jelly beans donut oat cake. Gummies candy canes donut sweet roll. Liquorice gummi bears lemon drops toffee cheesecake biscuit jelly dessert bonbon. Wafer jujubes pie cake. Brownie chocolate cake tootsie roll.
				<div class="error">${this.lastErrorMessage}</div>`;
			}
			return this.content;
		}

		protected getTemplate() {
			return html`
				${comp(this.getHeader())}
				${comp(this.getContent())}`;
		}
	}
}
