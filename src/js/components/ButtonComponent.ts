namespace components {

	export interface IButtonOptions {
		content: any;
		className?: string;
	}

	export function button(options) {
		const {className = "btn", content} = options;
		return html`<button class="${className}">${content}</button>`;
	}

	export class Button extends BaseComponent {

		protected _content: any;
		public get content(): any { return this._content; }
		public set content(value: any) {this._content = value || ""; this.invalidate(); }

		protected _className: string;
		public get className(): string { return this._className; }
		public set className(value: string) {this._className = value || ""; this.invalidate(); }

		constructor(options: IButtonOptions) {
			super();
			this._content = options.content || "";
			this._className = options.className || "";
		}

		protected getTemplate() {
			return html`<button class="${this.className}">${this.content}</button>`;
		}
	}
}
