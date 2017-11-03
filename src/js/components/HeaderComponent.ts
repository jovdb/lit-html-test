namespace components {

	export class HeaderComponent extends BaseComponent {

		protected _content: any = undefined;
		public get content(): any { return this._content; }
		public set content(value: any) {this._content = value; this.invalidate(); }

		public getTemplate() {
			return header(this._content);
		}
	}

	export function header(content: any) {
		return html`<div class="header">${content}</div>`;
	}

}