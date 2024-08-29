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
</button>`;

// <button onclick=() => alert('Hello World!')>Click here</button>
```

This "onclick" will not work, and even if you set as string, the function only can call global functions.

With this framework, your JavaScript binding are actually real JavaScript bindings.

```javascript
import t from './taggy.js';

const buttonElement = t`
<button ${{ onclick: () => alert('Hello World!') }}>
  Click here
</button>`;

// <button>Click here</button>
```

The result an HTMLElement instance with "onclick" event binded. You can append to `document.body` or any other container.

Examples
--------

### Array lists

```javascript
import t from './taggy.js';

document.body.append(t`
  <ul>
    ${["First", "Second", "Third"].map(item => 
      t`<li>${item}</li>`
    )}
  </ul>
`);
```

*   First
*   Second
*   Third

### Functional components

```javascript
import t from './taggy.js';

function Button(label, onclick) {
  return t`
    <button ${{ onclick }}>
      ${label}
    </button>
  `;
}

document.body.append(t`
  <div>
    <b>Click on this button and dispatch a message</b>
    ${Button("Click here", () => alert('Hello World!'))}
  </div>
`);
```

License
-------

MIT
