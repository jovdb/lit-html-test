namespace app {

	export function required<T>(value: null | undefined, message?: string): never;
	export function required<T>(value: T, message?: string): T;
	export function required<T>(value: T | null | undefined, message?: string): T {
		if (value === null || value === undefined) throw new Error(message || "Value is required");
		return value;
	}

	/**
	 * Force a compile time error when fail canbe reached (usefull for exhaustive switch/if)
	 * @param x type that should not be reached* @param x
	 * @param dontThrow optional Usefull when you want to handle all cases of a subset of a type but don't want to throw at runtime
	 */
	export function fail(x: never, dontThrow: true): void;
	export function fail(x: never): never;
	export function fail(x: never, dontThrow = false): void | never {
		if (!(dontThrow)) throw new Error(`Unexpected object: ${x}`);
	}

	export function addEventListener<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, useCapture?: boolean): () => void {
		const fn: EventListenerOrEventListenerObject = listener.bind(undefined); // make unique
		el.addEventListener(type, fn, useCapture);
		return () => {
			el.removeEventListener(type, fn, useCapture);
		}; // return unsubscribe
	}
}