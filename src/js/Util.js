/**
 * Query selector helper
 * @param {string} query
 * @param {Object} element
 */
function $(query, element) {
    element = element || document;
    return element.querySelector(query);
}

/**
 * Create element helper
 * @param {string} name
 * @param {boolean} isText
 * @returns {DOMElement}
 */
function em(value, isText) {
    return isText
        ? document.createTextNode(value)
        : document.createElement(value);
}

/**
 * Event handler helper
 * @param {Object} element
 * @param {string} event
 * @callback handler
 */
function on(element, event, handler) {
    element.addEventListener(event, handler, false);
}
