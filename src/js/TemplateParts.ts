namespace app {
	export type PartNotifyTypes = "update";
	export type PartsCallback<TValues> = <TName extends keyof TValues>(this: TemplateParts<TValues>, value: TValues[TName], parts: TemplateParts<TValues>, name: TName, type: PartNotifyTypes) => void;

	export class TemplateParts<TValues> {

		private readonly nodes: {[name: string] : lit.Part};
		private readonly updateCallback: {[name: string] : PartsCallback<TValues>[]};

		constructor() {
			this.nodes = {};
			this.updateCallback = {};
		}

		/** Call this in a lit.Template to capture that part with a name */
		public add<TName extends keyof TValues>(name: TName, defaultValue: TValues[TName]) {
			return lit.directive((nodePart: any) => {
				this.nodes[name] = nodePart; // Make array when used in list?
				this.notify(name, "update", defaultValue);
				return defaultValue;
			});
		}

		/** Update a part in the DOM */
		public setValue<TName extends keyof TValues>(name: TName, value: TValues[TName]) {
			const part = this.nodes[name];
			if (part) {
				if (part.size === undefined) {
					(part as any).setValue(value);
				} else {
					(part as any).setValue([value], 0);
				}
				this.notify(name, "update", value);
			}
		}

		/** Update multiple parts in the DOM */
		public setValues(values: Partial<TValues>) {
			Object.keys(values).forEach((key: any) => {
				this.setValue(key, values[key] as any);
			});
		}

		/** Get the DOM element associated with a part */
		public getElement<TName extends keyof TValues>(name: TName): Element | undefined {
			const nodePart = this.nodes[name];

			if (nodePart instanceof lit.AttributePart) return nodePart.element;
			else if (nodePart instanceof lit.PropertyPart) return nodePart.element;
			else if (nodePart instanceof lit.EventPart) return nodePart.element;
			else if (nodePart instanceof lit.NodePart) {/* TODO: Test */}
			return undefined;
		}

		/** Get notified when a lit part is updated */
		public watch<TName extends keyof TValues>(name: TName, type: PartNotifyTypes, fn: PartsCallback<TValues>): () => void {

			let callbacks: PartsCallback<TValues>[] | undefined;
			switch (type) {
				case "update":
					if (!this.updateCallback[name]) this.updateCallback[name] = [];
					callbacks = this.updateCallback[name];
					break;
				default:
					app.exhaustiveFail(type);
					return () => undefined;
			}

			const wrapped: typeof fn = fn.bind(this);
			callbacks.push(wrapped);

			return () => {
				if (callbacks) {
					const index = callbacks.indexOf(wrapped);
					if (index >= 0) callbacks.splice(index, 1);
				}
			};
		}

		private notify<TName extends keyof TValues>(name: TName, type: PartNotifyTypes, value: TValues[TName]): void {

			let callbacks: PartsCallback<TValues>[] | undefined;
			switch (type) {
				case "update":
					if (!this.updateCallback[name]) this.updateCallback[name] = [];
					callbacks = this.updateCallback[name];
					break;
				default:
					app.exhaustiveFail(type);
					return;
			}

			if (callbacks && callbacks.length > 0) {
				callbacks.forEach(fn => {
					fn.call(this, value, this, name, type);
				});
			}
		}
	}
}