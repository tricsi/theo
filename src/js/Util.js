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
    event.split(",").forEach((name) => {
        element.addEventListener(name.trim(), handler, false);
    });
}

function fullscreen() {
    const doc = document, 
        html = doc.documentElement,
        requestFullScreen =
            html.requestFullscreen ||
            html.mozRequestFullScreen || 
            html.webkitRequestFullScreen || 
            html.msRequestFullscreen,
        cancelFullScreen =
            doc.exitFullscreen ||
            doc.mozCancelFullScreen ||
            doc.webkitExitFullscreen ||
            doc.msExitFullscreen;
    if(
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
    ) {
        requestFullScreen.call(html);
    } else {
        cancelFullScreen.call(doc);
    }
}

Math.seed = 6;
Math.rnd = function(max, min) {
    max = max || 1;
    min = min || 0;
 
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
 
    return min + rnd * (max - min);
};