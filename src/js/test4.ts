/*
lit-html
=========

╭─────────────────╮ executes ╭─────────────────╮
│ Component       ├─────────>│ render          │
│                 │<─────────┤                 │
╰─────────────────╯   reads  ╰─────────────────╯
         ↑ change prop
╭────────┴────────╮
│ onChange        │
╰─────────────────╯

- Extend from BaseComponent
- add props to your Component
- To update view:
  - let the exposed props automatically invalidate the view
  - or expose the invalidate method
  - or expose update methods and pass the new values to update

On Changes:
- Change Component props
- call invalidate if needed

*/


namespace test4 {

	export function add(el: HTMLElement) {

		class StopWatchComponent extends components.BaseComponent {

			private prevSeconds: string;
			private seconds: string;
			private milliSeconds: string;
			private buttonText: string;
			private stopwatch: app.IStopwatch;

			constructor() {
				super();
				this.prevSeconds = "";
				this.seconds = "0";
				this.milliSeconds = "000";
				this.buttonText = "Start";

				const onSecondsChange = (seconds, prevSeconds) => {
					this.seconds = seconds;
					this.prevSeconds = prevSeconds;
					this.update(); // synchronous

					const secondsEl = this.getRootChildren()[0].querySelector(".seconds")!;
					if (prevSeconds !== "") { // at init this can be the same
						secondsEl.classList.remove("scroll-down");
						//@ts-ignore
						const w = secondsEl.offsetWidth; // Trigger reflow to start animation
						secondsEl.classList.add("scroll-down");
					}

				};

				const onMilliSecondsChange = (millisSeconds) => {
					this.milliSeconds = millisSeconds;
					this.invalidate();
				};

				const onButtonTextChange = (buttonText) => {
					this.buttonText = buttonText;
					this.invalidate();
				};

				// Stopwatch logic with callbacks that need to update UI
				this.stopwatch = app.getStopWatch(onSecondsChange, onMilliSecondsChange, onButtonTextChange);

				// Overwrite method with a bound methods so lit doesn't need to unregister and register each time a new function.
				this.onButtonClick = this.onButtonClick.bind(this);
			}


			private onButtonClick() {
				if (this.stopwatch.isRunning()) {
					this.stopwatch.stop();
				} else {
					this.stopwatch.start();
				}
			}

			protected getTemplate(): lit.TemplateResult {
				return html`<div class="stopwatch">
					<span class="seconds" data-value$="${this.seconds}" data-prev-value$="${this.prevSeconds}">&nbsp;</span><span class="milliseconds">.${this.milliSeconds}</span>
					<button on-click="${this.onButtonClick}">${this.buttonText}</button>
				</div>`;
			}
		}

		lit.render(html`${comp(new StopWatchComponent())}`, el);
	}
}

