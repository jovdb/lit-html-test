namespace components {

	export abstract class BaseComponent {
		protected nodePart: lit.NodePart;

		public abstract render(): lit.TemplateResult;

		/** Update component */
		public update() {
			this.nodePart.setValue(this.render());
		}

		/** Set NodePart containing the component (used by comp) */
		public setNodePart(nodePart: lit.NodePart) {
			this.nodePart = nodePart;
		}
	}

}


function comp(comp: components.BaseComponent) {
	return lit.directive((part: lit.Part) => {
		comp.setNodePart((part as lit.NodePart));
		return comp.render();
	});
}