# lit-html-test
I tried to find a way to work with lit-html without lots of dependencies.
I didn't want to use:
 - ES6 modules (no bundling)
 - Web Components (Polymer)
 - I only need a polyfill for the `template` tag (for older browsers)

I copied lit-html.ts and lit-extended.ts and adjusted the code so I could use them without module bundler (just a TypeScript compile).
(This code was based upon release 0.7.0 of lit-html).

For my first set of tests, I build a stopwatch:
- fast update rate (used 19 ms)
- sets attributes and set node text
- needs to triggers an animation each second (done with a reflow)

## Test1: Pure DOM and javascript, no lit-html
- Used ES6 template literal to add HTML to the DOM.
- Query the added DOM elements
On Changes:
- Update the element's content or attribute with javascript


When the model is updated, we call lit.render again.
This will get all data, compare it with the previous data and only update the changed part in the DOM

## Test2: lit-html with rerender
For my second test I used lit-html as I think it should be used:
```
╭─────────────────╮          ╭─────────────────╮          ╭─────────────────╮
│ Model           ├───────2─>│ 1. render       ├───────3─>│ DOM             │
╰─────────────────╯          ╰─────────────────╯          ╰─────────────────╯
         ↑                           ↑
         5                           │
╭────────┴────────╮                  │
│ 4. onChange     ├───────6──────────╯
╰─────────────────╯

1. render executed
2. reads data from a view model
3. updates the dDOM

4. onChanges event occurs
5. update view model
6. rerender
```

Pro:
- lit-html has a small footprint, is simple and has no dependencies
- View logic is centralized (multiple events don't change the DOM but update the view model)
- Easier to reason about it and debug.

Contra:
- Now we suddenly need to remember variables (in some kind of viewmodel).
  - Previously data from an event could be updated in the DOM and would stay there.
  - Now all data must be passed at each rerender, so we need to store all the data for the lit template.
- `render()` gets/executes all parts of the template and compares it with the presious data.
  - All functions/directives/nested templates in a template are reexecuted.
  - Heavy expressions in the template are better evaluated once outside lit-html template, to prevent recalculation at each rerender.
- Not easy to get access to a specific element added by lit. (example to trigger reflow for animation)


## Test3: lit-html without rerender
Mostly we known we only want to update 1 part of the template.
It is useless to fetch all data for the template and child templates, and compare it with the previous result

With this test I wanted to try if I could updated only one part of the template.
This code can capture parts of the template that we can later update individually.

```
╭─────────────────╮          ╭─────────────────╮
│ 1. render       ├───────3─>│ DOM             │
╰────────┬────────╯          ╰─────────────────╯
         2                           ↑
         ↓                           │
╭─────────────────╮                  │
│ TemplateParts   │───────6──────────╯
╰─────────────────╯
         ↑
         5
╭────────┴────────╮
│ 4. onChange     │
╰─────────────────╯

1. render executed
2. remember parts
3. updates the DOM

4: onChanges event occurs
5: update a specific part(s)
6: only that part of the DOM is updated
```

Pro:
- No full rerender needed, 
- Added a possibility to watch changes of an element (and do e.g. animation centralized)

Contra:
- UI changes are again done from multiple places.


## Test4: lit-html used as a component function
```
╭─────────────────╮          ╭─────────────────╮          ╭─────────────────╮
│ viewModel       │<────3────┤ render          │───────4─>│ DOM             │
╰─────────────────╯          ╰─────────────────╯          ╰─────────────────╯
         ↑                            ↑
         6                            2
╭────────┴────────╮          ╭────────┴────────╮
│ 5. onChange     ├────7────>│ 1. Function     │
╰─────────────────╯          │                 │
                             ╰─────────────────╯

1. calling function
2: render
3. reads the viewModel
4. updates the DOM

5: onChanges event occurs
6: update viewModel
7: rerender
```
Pro:
- Simple

Contra:
- Not well extensable
- Should accept a viewModel and expose update/invalide.

## Test5: lit-html used as a component class
```
╭─────────────────╮ executes ╭─────────────────╮          ╭─────────────────╮
│ Component       ├─────────>│ render          │─────────>│ DOM             │
│ -props          │<─────────┤                 │          ╰─────────────────╯
╰─────────────────╯   reads  ╰─────────────────╯
         ↑ change prop
╭────────┴────────╮
│ onChange        │
╰─────────────────╯
```

- create a component by extending from BaseComponent
- add props to your Component (view data)
- Some ways to update DOM:
  - exposed props will automatically invalidate the view
  - expose the invalidate method (must be called after prop changes)
  - expose update methods that update readonly props and invalidate

Pro:
- You can have required and options arguments
- Strong typed arguments (when using TypeScript)
- Extensible

Contra:
- We need to hold a reference to the component in the parent to edit the props
- Function is always executed, even if result will be te same
- Syntax is not as clean as web-components
