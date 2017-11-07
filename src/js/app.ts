namespace app {
	const appEl = required(document.getElementById("app"), "#app element required")!;
	export const appComponent = new components.AppComponent();
	export const broadcaster = new Broadcaster();

	export function render() {
		lit.render(html`${comp(appComponent)}`, appEl);

		test1.add(document.getElementById("test1")!);
	}

	export function start() {
		render();
	}
}

app.start();