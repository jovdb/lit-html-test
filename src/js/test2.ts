/*
lit-html
=========
When the model is updated, we call lit.render again.
This will get all data, compare it with the previous data and only update the changed part in the DOM

╭─────────────────╮          ╭─────────────────╮          ╭─────────────────╮
│ Model           ├───────2─>│ 1. render       ├───────3─>│ DOM             │
╰─────────────────╯          ╰─────────────────╯          ╰─────────────────╯
         ↑                           ↑
         5                           │
╭────────┴────────╮                  │
│ 4. onChange     ├───────6──────────╯
╰─────────────────╯

1. render executed
2. reads data from a view model
3. updates the dDOM

4: on changes
5: update view model
6: rerender

Remarks:
- To update we call render that gets all parts of the template and updates the changed onces to the DOM.
- All functions in template are reexecuted and results are compared with previous values
- Normally we use some kind of viewmodel that holds the data for the view
- Not easy to get access to a specific element added by lit. (example to trigger reflow for animation)
*/


namespace test2 {

	export function add(el: HTMLElement) {

		const data = {
			prevSeconds: "",
			seconds: "0",
			milliSeconds: "000",
			buttonText: "Start"
		};

		const onButtonClick = () => {
			if (stopWatch.isRunning()) {
				stopWatch.stop();
			} else {
				stopWatch.start();
			}
		};

		const render = () => {

			const template = html`<div class="stopwatch">
				<span class="seconds" data-value$="${data.seconds}" data-prev-value$="${data.prevSeconds}">&nbsp;</span><span class="milliseconds">.${data.milliSeconds}</span>
				<button on-click="${onButtonClick}">${data.buttonText}</button>
			</div>`;

			lit.render(template, el);
		};

		// First render
		render();
		const secondsEl = el.querySelector(".seconds")!;

		const onSecondsChange = (seconds: string, prevSeconds: string) => {

			data.seconds = seconds;
			data.prevSeconds = prevSeconds;
			render();

			// Trigger animation
			if (prevSeconds !== "") { // at init this can be the same
				secondsEl.classList.remove("scroll-down");
				//@ts-ignore
				const w = secondsEl.offsetWidth; // Trigger reflow to start animation
				secondsEl.classList.add("scroll-down");
			}
		};

		const onMilliSecondsChange = (milliSeconds: string) => {
			data.milliSeconds = `${milliSeconds}`;
			render();
		};

		const onButtonTextChange = (buttonText: string) => {
			data.buttonText = buttonText;
			render();
		};

		// Stopwatch logic with callbacks that need to update UI
		const stopWatch = app.getStopWatch(onSecondsChange, onMilliSecondsChange, onButtonTextChange);

	}
}

