# lit-html-test
I did some test to use lit-html:
 - without ES6 modules
 - as components without Web Components

I tried to find a way to work with lit-html without using Web Components. I use function or 'Component' classes.


## Working with lit-html:
- Some constructs cannot be done with
lit-html:
```
html`<button ${isDisabled ? "disabled" : ""}>Cancel</button>`;
```
- Sometimes 
- 

- arguments/properties in lit-html string are not type checked as with JSX.
- expressions are always re-evaluated so heavy check are better evaluated outside lit-html tempalte, to prevent recalculation at each UI update.

## Functions:
This is just a function with arguments that return a TemplateResult.

```
html`${button({
  content: 'Cancel',
  className: 'btn-default'
})}`
```
```
function button(options) {
  const {className = "btn", content} = options;
  return html`<button class="${className}">${content}</button>`;
}
```

Pro:
- Flexible
- You can have required and options arguments
- Strong typed arguments (when using TypeScript)

Contra:
- Function is always executed, even if result will be te same
- Syntax is not as clean as web-components

## Component class:
This is class that extends from BaseComponent and is added in a lit-html with the `comp()` directive.

```
const button = new Button({
  content: 'Cancel',
  className: 'btn-default'
});

html`${comp(button)}`;
```

```
class Button extends BaseComponent {

    protected _content: any;
    public get content(): any { return this._content; }
    public set content(value: any) {this._content = value || ""; this.invalidate(); }

    protected _className: string;
    public get className(): string { return this._className; }
    public set className(value: string) {this._className = value || ""; this.invalidate(); }

    constructor(options) {
        super();
        this._content = options.content || "";
        this._className = options.className || "";
    }

    protected getTemplate() {
        return html`<button class="${this.className}">${this.content}</button>`;
    }
}
```

The `BaseComponent` has following methods:
- getTemplate(): returns the lit-html template
- update(): triggers a UI update
- invalidate(): batch up a UI update for the next cycle
- getRootChildren(): get the root element(s) of the component

and some hooks:
- beforeDetach(el: HTMLElement): component root element added to DOM
- afterAttach(el: HTMLElement): component root element removed from DOM


Pro:
- You can have required and options arguments
- Strong typed arguments (when using TypeScript)
- Extensible

Contra:
- Syntax is not as clean as web-components
- Components must be created and store outside the getTemplate() method to prevent recreation/rerendering. This gives a cluttered view 
