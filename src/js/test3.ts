/*
lit-html
=========
A lot of time we known we only want to update 1 part.
It is useless to fetch all data for the template, and compare it with the previous result
Not only data, but also child templates are rebuild and compared again
This code will capture some parts of the template that we can later update individually.

╭─────────────────╮          ╭─────────────────╮
│ 1. render       ├───────3─>│ DOM             │
╰────────┬────────╯          ╰─────────────────╯
         2                           ↑
         ↓                           │
╭─────────────────╮                  │
│ TemplateParts   │───────6──────────╯
╰─────────────────╯
         ↑
         5
╭────────┴────────╮
│ 4. onChange     │
╰─────────────────╯

1. render executed
2. remember parts
3. updates the dDOM

4: on changes
5: update part(s)
6: when part updates, only that part of the DOM is updated

With this solution I don't have to call render each time
- For parts we want to update individually, we can call an 'add()' function to create an updateable reference to a lit part
- We can update a specific part
- We can watch changes of an element
- We can get the DOM element of this part
*/

namespace test3 {


	export function add(el: HTMLElement) {

		const onButtonClick = () => {
			if (stopWatch.isRunning()) {
				stopWatch.stop();
			} else {
				stopWatch.start();
			}
		};

		/** Object that holds the placeholders */
		const parts = new app.TemplateParts<{
			seconds: string;
			prevSeconds: string;
			milliSeconds: string;
			buttonText: string;
		}>();

		/** When seconds update, trigger animation */
		parts.watch("seconds", "update", (value) => {
			// Trigger animation
			if (value !== "0") {
				const secondsEl = parts.getElement("seconds");
				if (secondsEl) {
					secondsEl.classList.remove("scroll-down");
					//@ts-ignore
					const w = secondsEl.offsetWidth; // Trigger reflow to start animation
					secondsEl.classList.add("scroll-down");
				}
			}
		});

		const render = () => {
			const template = html`<div class="stopwatch">
				<span class="seconds" data-value$="${parts.add("seconds", "0")}" data-prev-value$="${parts.add("prevSeconds", "")}">&nbsp;</span><span class="milliseconds">.${parts.add("milliSeconds", "000")}</span>
				<button on-click="${onButtonClick}">${parts.add("buttonText", "Start")}</button>
			</div>`;

			lit.render(template, el);
		};

		// First render
		render();

		const onSecondsChange = (seconds: string, prevSeconds: string) => {
			parts.setValue("seconds", seconds);
			parts.setValue("prevSeconds", prevSeconds);
		};

		const onMilliSecondsChange = (milliSeconds: string) => {
			parts.setValue("milliSeconds", milliSeconds);
		};

		const onButtonTextChange = (buttonText: string) => {
			parts.setValue("buttonText", buttonText);
		};

		// Stopwatch logic with callbacks that need to update UI
		const stopWatch = app.getStopWatch(onSecondsChange, onMilliSecondsChange, onButtonTextChange);

	}
}

