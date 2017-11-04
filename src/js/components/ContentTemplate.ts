namespace components {
	export class Content extends BaseComponent {
		protected _content: any = undefined;
		public get content(): any { return this._content; }
		public set content(value: any) {if (this._content !== value) { this._content = value; this.invalidate(); }}

		public getTemplate() {
			return html`<div class="content">${this._content}</div>`;
		}
	}
}