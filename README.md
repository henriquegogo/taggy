taggy.js
========

### Tagged Template Literals Engine

What is it?
-----------

Use Template Literals with JavaScript event binding.

Usage
-----

Usually if you create an usual Template Literal and add some JavaScript reference, that code will be written as a string.

```javascript
const buttonString = `
  <button onclick=${() => alert('Hello World!')}>
    Click here
  </button>
`;

// <button onclick=() => alert('Hello World!')>Click here</button>
```

This "onclick" will not work, and even if you set as string, the function only can call global functions.

With this framework, your JavaScript binding are actually real JavaScript bindings.

```javascript
import html from './taggy.js';

const buttonElement = html`
  <button ${{ onclick: () => alert('Hello World!') }}>
    Click here
  </button>
`;

// <button>Click here</button>
```

The result an HTMLElement instance with "onclick" event binded. You can append to `document.body` or any other container.

As alternative, you can use functions builders instead of template literals.

```javascript
import { ElementBuilder } from './taggy.js';
const { button } = ElementBuilder;

const buttonElement = button({
  onclick: () => alert('Hello World!')
}, "Click here");

// <button>Click here</button>
```


Examples
--------

### Array lists

```javascript
import html, { ElementBuilder } from './taggy.js';
const { li } = ElementBuilder;

document.body.append(html`
  <ul>
    ${["First", "Second", "Third"].map(item => li(item))}
  </ul>
`);
```

*   First
*   Second
*   Third

### Functional components

```javascript
import html from './taggy.js';

const Button = (label, onclick) => html`
  <button ${{ onclick }}>
    ${label}
  </button>
`;

document.body.append(html`
  <div>
    <b>Click on this button and dispatch a message</b>
    ${Button("Click here", () => alert('Hello World!'))}
  </div>
`);
```

### Event listener

```javascript
import html, { EventHandler } from './taggy.js';

function Component() {
  let dispatch;

  const handleEvents = (el) => {
    const { listen } = EventHandler(el, Component);
    listen("alert", () => alert("Ouch!"));
    return el;
  };

  return { dispatch } = handleEvents(html`
    <button ${{ onclick: () => dispatch("alert") }}>
      Don't click!
    </button>
  `);
}

document.body.append(Component());
```

### Update itself

```javascript
import html, { EventHandler } from './taggy.js';

function Component(counter = 0) {
  let update;

  return { update } = EventHandler(html`
    <button ${{ onclick: () => update(counter + 1) }}>
      Count with me - ${counter}
    </button>
  `, Component);
}

document.body.append(Component());
```

License
-------

MIT
