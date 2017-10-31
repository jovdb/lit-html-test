namespace components {

	export abstract class BaseComponent {

		private isRerenderRequested = false;
		private nodePart: lit.NodePart;

		protected abstract getTemplate(): lit.TemplateResult;

		/**
		 * Update component will redraw the component synchroniously.
		 * Prefer invalidate() to request an UI update.
		 */
		protected update() { // Protected by default
			this.nodePart.setValue(this.getTemplate());
		}

		/**
		 * Request an UI update asynchronious.
		 * Multiple requests are batched as one UI update.
		 */
		protected async invalidate() { // Protected by default
			if (!this.isRerenderRequested) {
				this.isRerenderRequested = true;
				// Schedule the following as micro task, which runs before requestAnimationFrame.
				// All additional invalidate() calls before will be ignored.
				// https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
				this.isRerenderRequested = await false;
				this.update();
			}
		}

		/**
		 * Set NodePart containing the component (used by comp).
		 * This is needed to do an UI update
		 */
		protected setNodePart(nodePart: lit.NodePart) {
			this.nodePart = nodePart;
		}

		// TODO:
		// - beforeTemplate?
		// - afterTemplate?

	}

}

/**
 * Lit directive to add a 'Component'.
 */
function comp(comp: components.BaseComponent) {
	return lit.directive((part: lit.Part) => {
		(comp as any).setNodePart((part as lit.NodePart));
		return (comp as any).getTemplate();
	});
}