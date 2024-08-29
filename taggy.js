export default function(strs, ...vals) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = strs.map((str, i) => str + (
    vals[i]?.constructor === Object ? `data-t="${i}"` 
    : Array.isArray(vals[i]) || vals[i] instanceof Node
    ? `<slot data-t="${i}"></slot>` : vals[i] ?? "")).join("");
  wrapper.querySelectorAll("[data-t]").forEach(el =>
    Array.isArray(vals[el.dataset.t]) ? el.replaceWith(...vals[el.dataset.t]) 
    : vals[el.dataset.t] instanceof Node ? el.replaceWith(vals[el.dataset.t]) 
    : Object.assign(el, vals[el.dataset.t], delete el.dataset.t));
  return wrapper.children[0];
}
