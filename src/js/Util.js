function $(query, element) {
    element = element || document;
    return element.querySelector(query);
}

function em(value, isText) {
    return isText
        ? document.createTextNode(value)
        : document.createElement(value);
}

function on(element, event, handler) {
    event.split(",").forEach((name) => {
        element.addEventListener(name.trim(), handler, false);
    });
}

Math.seed = 6;
Math.rnd = function(max, min) {
    max = max || 1;
    min = min || 0;
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    return min + (Math.seed / 233280) * (max - min);
};