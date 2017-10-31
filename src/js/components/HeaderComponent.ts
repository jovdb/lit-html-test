namespace components {

	export class HeaderComponent extends BaseComponent {

		protected _headerText = "Hello World";
		public get headerText() { return this._headerText; }
		public set headerText(value: string) {this._headerText = value; this.invalidate(); }

		public getTemplate() {
			return html`<div class="header"><h1>${this.headerText}</h1></div>`;
		}
	}

}