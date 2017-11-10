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
	export function exhaustiveFail(x: never, dontThrow: true): void;
	export function exhaustiveFail(x: never): never;
	export function exhaustiveFail(x: never, dontThrow = false): void | never {
		if (!(dontThrow)) throw new Error(`Unexpected object: ${x}`);
	}

	export function addEventListener<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, useCapture?: boolean): () => void {
		const fn: EventListenerOrEventListenerObject = listener.bind(undefined); // make unique
		el.addEventListener(type, fn, useCapture);
		return () => { // return unsubscribe
			el.removeEventListener(type, fn, useCapture);
		};
	}

	type Func<T> = ([...args]: any, args2?: any) => T;

	//@ts-ignore
	export function returnType<T>(func: Func<T>) {
		return undefined as any as T;
	}


/*
		interface ILitRenderOptions {
			name?: string;
			added?(node: Node): void;
			removed?(node: Node): void;
			updated?(node: Node, count: number): void;
		}

		const litNotify = (template: lit.TemplateResult, options: ILitRenderOptions) => {
			return lit.directive((nodePart: any) => {

				console.log("notify", options.name);

				if (options.added) {
					// Get nodes added (patch _insert method)
					const insert = nodePart._insert;
					nodePart._insert = function patchedInsert(node: any) {
						insert.call(nodePart, node);
						const node2 = node.firstChild;
						if (node2 && options.added) options.added(node2);
					};
				}

				if (options.removed) {
					// Get nodes removed (patch clear methods)
					const clear = nodePart.clear;
					nodePart.clear = function patchedClear(startNode: Node = nodePart.startNode) {
						let node = startNode.nextSibling;
						while (node && node !== nodePart.endNode) {
							if (options.removed) options.removed(node);
							node = node.nextSibling;
						}
						clear.call(nodePart, startNode);
					};
				}

				if (options.updated) {
					if (!nodePart.setValue.isPatched) {

						const setValue = nodePart.setValue;
						nodePart.setValue = function patchedSetValue(values: any) {

							// First update value
							setValue.call(nodePart, values);

							// then notify
							let node = (this as any).startNode.nextSibling;
							while (node && node !== nodePart.endNode) {
								if (options.updated) options.updated(node);
								node = node.nextSibling;
							}

						};
						nodePart.setValue.isPatched = true;
					}
				}

				return template;
			});
		};*/
}