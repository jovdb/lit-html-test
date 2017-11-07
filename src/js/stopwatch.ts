// No lit-html
namespace app {

	/** Reusable part for stopwatch */
	export function getStopWatch(onSecondsChange: (seconds: string, prevSeconds: string) => void, onMilliSecondsChange: (milliSeconds: string) => void, onButtonTextChange: (text: string) => void) {
		let startTime = 0;
		let lastSeconds = 0;

		let intervalId = 0;
		function startStopWatch() {

			// Reset
			startTime = 0;
			lastSeconds = 0;

			onButtonTextChange("Stop");
			onSecondsChange("0", "");
			onMilliSecondsChange("0");

			intervalId = setInterval(() => {

				const now = Date.now();
				if (!startTime) startTime = now;
				const offSet = now - startTime;
				const seconds = Math.floor(offSet / 1000);
				let milliSeconds = offSet % 1000;
				const milliSecondsString = milliSeconds < 10
					? `00${milliSeconds}`
					: (milliSeconds < 100)
						? `0${milliSeconds}`
						: milliSeconds.toString();

				if (lastSeconds !== seconds) {
					onSecondsChange(seconds.toString(), lastSeconds.toString());
					lastSeconds = seconds;
				}
				onMilliSecondsChange(milliSecondsString);

			}, 19); // 19 high rate and odd so last millisisecond value can have all values
		}

		function stopStopWatch() {
			if (intervalId) {

				onButtonTextChange("Start");
				clearInterval(intervalId);
				intervalId = 0;
			}
		}

		return {
			start: startStopWatch,
			stop: stopStopWatch,
			isRunning: () => !!intervalId
		};
	}
}

