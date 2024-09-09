export default function(strs, ...vals) {
  const wrapper = document.createElement("div");

  // Set slots to be replaced by instance references.
  wrapper.innerHTML = strs.map((str, i) => str + (
    vals[i]?.constructor === Object ? `data-i="${i}"`
    : Array.isArray(vals[i]) || vals[i] instanceof Node
    ? `<slot data-i="${i}"></slot>` : vals[i] ?? "")).join("");

  // Replace slots with references to objects and elements.
  wrapper.querySelectorAll("[data-i]").forEach(el =>
    Array.isArray(vals[el.dataset.i]) ? el.replaceWith(...vals[el.dataset.i])
    : vals[el.dataset.i] instanceof Node ? el.replaceWith(vals[el.dataset.i])
    : Object.assign(el, vals[el.dataset.i], delete el.dataset.i));

  const el = wrapper.children[0] || wrapper;

  // Create essential functions to handle events and state.
  el.self = el;
  el.update = (newEl) => el.replaceWith(newEl);
  el.listen = (ev, fn) => (el.dataset.event = "", el)
    .addEventListener(ev, ({detail}) => fn(detail));
  el.dispatch = (ev, detail) => document.querySelectorAll("[data-event]")
    .forEach(el => el.dispatchEvent(new CustomEvent(ev, {detail})));

  return el;
}
