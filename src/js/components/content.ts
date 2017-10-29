namespace components {
	export const content = (contentEls: string | lit.TemplateResult) => html`
		<div class="content">${contentEls}</div>
	`;
}