namespace app {

	export function required<T>(value: null | undefined, message?: string): never;
	export function required<T>(value: T, message?: string): T;
	export function required<T>(value: T | null | undefined, message?: string): T {
		if (value === null || value === undefined) throw new Error(message || "Value is required");
		return value;
	}
}