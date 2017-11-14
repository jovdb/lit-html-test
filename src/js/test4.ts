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

		interface IComponent {
			getTemplate(): lit.TemplateResult;
		}

		interface IComponentFunctions {
			update(): void;
			invalidate(): void;
			getRootElements(): Element[];
		}

		function asComponent(componentFunction: (options: IComponentFunctions) => IComponent): (part: any) => lit.TemplateResult {

			let isRerenderRequested = false;

			return lit.directive((part: any) => {

				const update = () => part.setValue(component.getTemplate());

				const invalidate = () => {
					if (!isRerenderRequested) {
						isRerenderRequested = true;
						// Schedule the following as micro task, which runs before requestAnimationFrame.
						// All additional invalidate() calls before will be ignored.
						// https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
						// tslint:disable-next-line
						Promise.resolve().then(() => { // Don't use await for tslint rule: no-floating-promises (when function is async all callers must handle it)
							isRerenderRequested = false;
							update();
						});
					}
				};

				const getRootElements = () => {
					const children: HTMLElement[] = [];
					let nextSibling: any = part.startNode && (part.startNode as any).nextSibling;
					while (nextSibling) {
						children.push(nextSibling);
						nextSibling = nextSibling.nextSibling;
					}
					return children;
				};

				let component = componentFunction({update, invalidate, getRootElements});
				return component.getTemplate();
			});
		}

		/** This function  */
		function stopWatch(options: IComponentFunctions): IComponent {

			let prevSeconds = "";
			let seconds = "0";
			let milliSeconds = "000";
			let buttonText = "Start";

			const onSecondsChange = (newSeconds, newPrevSeconds) => {
				seconds = newSeconds;
				prevSeconds = newPrevSeconds;
				options.update();

				const secondsEl = options.getRootElements()[0].querySelector(".seconds")!;

				if (secondsEl) {
					secondsEl.classList.remove("scroll-down");
					//@ts-ignore
					const w = secondsEl.offsetWidth; // Trigger reflow to start animation
					secondsEl.classList.add("scroll-down");
				}

			};

			const onMilliSecondsChange = (newMillisSeconds) => {
				milliSeconds = newMillisSeconds;
				options.invalidate();
			};


			const onButtonTextChange = (newButtonText) => {
				buttonText = newButtonText;
				options.invalidate();
			};

			// Stopwatch logic with callbacks that need to update UI
			const stopwatch = app.getStopWatch(onSecondsChange, onMilliSecondsChange, onButtonTextChange);

			const onButtonClick = () => {
				if (stopwatch.isRunning()) {
					stopwatch.stop();
				} else {
					stopwatch.start();
				}
			};

			const getTemplate = () => {
				return html`<div class="stopwatch">
					<span class="seconds" data-value$="${seconds}" data-prev-value$="${prevSeconds}">&nbsp;</span><span class="milliseconds">.${milliSeconds}</span>
					<button on-click="${onButtonClick}">${buttonText}</button>
				</div>`;
			};

			return {
				getTemplate
			};
		}


		return lit.render(html`${asComponent(stopWatch)}`, el);
	}
}

