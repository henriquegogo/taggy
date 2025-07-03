export const ElementBuilder = new Proxy({}, {
  get: (_, tagName) => (...args) => {
    const element = document.createElement(tagName);
    args.forEach(arg => arg.constructor !== Object ?
      element.append(arg) : Object.assign(element, arg))
    return element;
  }
});

export const EventHandler = (element, fn) => Object.assign(element || {}, {
  update: (...newProps) => element.replaceWith(fn(...newProps)),
  listen: (eventType, handler) => (element.dataset.event = "", element)
    .addEventListener(eventType, ({ detail }) => handler(detail)),
  dispatch: (eventType, detail) => document.querySelectorAll("[data-event]")
    .forEach(el => el.dispatchEvent(new CustomEvent(eventType, { detail })))
});

export default (strs, ...vals) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = strs.map((str, i) => str + (
    vals[i]?.constructor === Function ? (vals.fn = vals[i], "")
    : vals[i]?.constructor === Object ? `data-i="${i}"`
    : Array.isArray(vals[i]) || vals[i] instanceof Node
    ? `<slot data-i="${i}"></slot>` : vals[i] ?? "")).join("");
  wrapper.querySelectorAll("[data-i]").forEach(el =>
    Array.isArray(vals[el.dataset.i]) ? el.replaceWith(...vals[el.dataset.i])
    : vals[el.dataset.i] instanceof Node ? el.replaceWith(vals[el.dataset.i])
    : Object.assign(el, vals[el.dataset.i], delete el.dataset.i));
  return wrapper.children.length == 1 ? wrapper.children[0] : wrapper;
}
