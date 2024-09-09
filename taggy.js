export default function(strs, ...vals) {
  const wrapper = document.createElement("div");

  // Set attribute identifiers and slots to be replaced by instance references.
  wrapper.innerHTML = strs.map((str, i) => str + (
    vals[i]?.constructor === Object ? `data-t="${i}"` 
    : Array.isArray(vals[i]) || vals[i] instanceof Node
    ? `<slot data-t="${i}"></slot>` : vals[i] ?? "")).join("");

  // Replace attributes and slots with references to objects and elements.
  wrapper.querySelectorAll("[data-t]").forEach(el =>
    Array.isArray(vals[el.dataset.t]) ? el.replaceWith(...vals[el.dataset.t]) 
    : vals[el.dataset.t] instanceof Node ? el.replaceWith(vals[el.dataset.t]) 
    : Object.assign(el, vals[el.dataset.t], delete el.dataset.t));

  const el = wrapper.children[0] || wrapper;

  // Create essential functions to handle events and state.
  el.dataset.event = "";
  el.self = el;
  el.update = (newEl) => el.replaceWith(newEl);
  el.listen = (ev, fn) => el.addEventListener(ev, ({detail}) => fn(detail));
  el.dispatch = (ev, detail) => document.querySelectorAll('[data-event]')
    .forEach(el => el.dispatchEvent(new CustomEvent(ev, {detail})));

  return el;
}
