/*
No lit-html
============
Very simple
- Add to innerHTML with ES6 template strings
- Query added elements and capture references

On Changes;
- update the element's content or attribute with javascript

*/
namespace test1 {

	export function add(el: HTMLElement) {

		// Add DOM Elements
		el.innerHTML = `<div class="stopwatch">
			<span class="seconds" data-value="0">&nbsp;</span><span class="milliseconds">.000</span>
			<button>Start</button>
		</div>`;

		// Query DOM elements
		const secondsEl = el.querySelector(".seconds") as HTMLElement;
		const milliSecondsEl = el.querySelector(".milliseconds") as HTMLElement;
		const startStopEl = el.querySelector("button") as HTMLButtonElement;

		const onSecondsChange = (seconds: string, prevSeconds: string) => {

			// Update attributes
			secondsEl.setAttribute("data-prev-value", prevSeconds.toString());
			secondsEl.setAttribute("data-value", seconds.toString());

			// Trigger animation
			if (prevSeconds !== "") { // at init this can be the same
				secondsEl.classList.remove("scroll-down");
				//@ts-ignore
				const w = secondsEl.offsetWidth; // Trigger reflow to start animation
				secondsEl.classList.add("scroll-down");
			}
		};

		const onMilliSecondsChange = (milliSeconds: string) => {
			milliSecondsEl.textContent = `.${milliSeconds}`;
		};

		const onButtonTextChange = (buttonText: string) => {
			startStopEl.textContent = buttonText;
		};

		// Stopwatch logic with callbacks that need to update UI
		const stopWatch = app.getStopWatch(onSecondsChange, onMilliSecondsChange, onButtonTextChange);

		startStopEl.addEventListener("click", function() {

			if (stopWatch.isRunning()) {
				stopWatch.stop();
			} else {
				stopWatch.start();
			}
		});

	}

}

