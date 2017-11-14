namespace app {
	const appEl = required(document.getElementById("app"), "#app element required")!;
	export const appComponent = new components.AppComponent();
	export const broadcaster = new Broadcaster();

	export function render() {
		lit.render(html`${comp(appComponent)}`, appEl);

		test1.add(document.getElementById("test1")!);
		test2.add(document.getElementById("test2")!);
		test3.add(document.getElementById("test3")!);
		test4.add(document.getElementById("test4")!);
		test5.add(document.getElementById("test5")!);
	}

	export function start() {
		render();
	}
}

app.start();