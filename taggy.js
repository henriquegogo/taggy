const elements = new Set();

export const defineElement = (fn, name) => {
  class Element extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      this.props = {
        children: [],

        update: (newProps) => {
          this.props = { ...this.props, ...newProps };
          const el = fn.call(this, this.props);
          this.shadowRoot.replaceChildren(el);
        },

        listen: (eventType, handler) => {
          this.addEventListener(eventType, ({ detail }) => handler(detail));
        },

        dispatch: (eventType, detail) => {
          elements.forEach(el => el.dispatchEvent(
            new CustomEvent(eventType, { detail })
          ));
        },
      };
    }

    connectedCallback() {
      elements.add(this);

      this.shadowRoot.adoptedStyleSheets = [...document.styleSheets].map(s => {
        const css = new CSSStyleSheet();
        css.replaceSync([...s.cssRules].map(rule => rule.cssText).join('\n'));
        return css;
      });

      for (let prop of Object.getOwnPropertyNames(this)) {
        if (prop !== "props") {
          this.props[prop] = this[prop];
          delete this[prop];
        }
      }

      for (let attr of this.attributes) {
        this.props[attr.name] = attr.value;
      }

      for (let child of this.children) {
        this.props.children.push(child);
      }

      if (!this.props.children.length) {
        this.props.children = this.textContent;
      }

      const el = fn.call(this, this.props);
      this.shadowRoot.replaceChildren(el);
    }

    disconnectedCallback() {
      elements.delete(this);
    }
  }

  const fnName = fn.name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  customElements.define(name || fnName, Element);
};

export default (strs, ...vals) => {
  const wrapper = document.createElement("div");

  wrapper.innerHTML = strs.map((str, i) => {
    if (vals[i]?.constructor === Function) {
      vals.fn = vals[i];
    } else if (vals[i]?.constructor === Object) {
      return str += ` data-i="${i}"`;
    } else if (Array.isArray(vals[i]) || vals[i] instanceof Node) {
      return str += `<slot data-i="${i}"></slot>`;
    } else {
      return str += vals[i] ?? "";
    }
  }).join("");

  wrapper.querySelectorAll("[data-i]").forEach(el => {
    if (Array.isArray(vals[el.dataset.i])) {
      el.replaceWith(...vals[el.dataset.i]);
    } else if (vals[el.dataset.i] instanceof Node) {
      el.replaceWith(vals[el.dataset.i]);
    } else {
      Object.assign(el, vals[el.dataset.i]);
      delete el.dataset.i;
    }
  });

  return wrapper.children.length == 1 ? wrapper.children[0] : wrapper;
}
