namespace app {

	export function required<T>(value: null | undefined, message?: string): never;
	export function required<T>(value: T, message?: string): T;
	export function required<T>(value: T | null | undefined, message?: string): T {
		if (value === null || value === undefined) throw new Error(message || "Value is required");
		return value;
	}

	export function assertNever(x: never): never {
		throw new Error(`Unexpected object: ${x}`);
	}

	export function addEventListener<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, useCapture?: boolean): () => void {
		const fn: EventListenerOrEventListenerObject = listener.bind(undefined); // make unique
		el.addEventListener(type, fn, useCapture);
		return () => {
			el.removeEventListener(type, fn, useCapture);
		}; // return unsubscribe
	}
}