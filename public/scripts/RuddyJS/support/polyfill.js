if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

/**
 * lowercase a string
 *
 * @param string
 * @returns {string}
 */
var lowercase = function(string) { return isString(string) ? string.toLowerCase() : string; };

/**
 * uppercase a string
 *
 * @param string
 * @returns {string}
 */
var uppercase = function(string) { return isString(string) ? string.toUpperCase() : string; };

/**
 * lowercase a string manually
 *
 * @param s
 * @returns {XML|string|*|void}
 */
var manualLowercase = function(s) {
    return isString(s)
        ? s.replace(/[A-Z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) | 32);})
        : s;
};

/**
 * isString check if a value is typeof string
 *
 * @param value
 * @returns {boolean}
 */
function isString(value) { return typeof value === 'string'; }

/**
 * uppercase a string manually
 *
 * @param s
 * @returns {XML|string|*|void}
 */
var manualUppercase = function(s) {
    return isString(s)
        ? s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);})
        : s;
};

/**
 * lowercase polyfill
 */
if ('i' !== 'I'.toLowerCase()) {
    lowercase = manualLowercase;
    uppercase = manualUppercase;
}

String.prototype.ucfirst = function()
{
    return this.charAt(0).toUpperCase() + this.substr(1);
};


/**
 * isArray polyfill
 */
if(!Array.isArray){
    Array.isArray = (function() {

        var toString = Object.prototype.toString;

        return function(arg) {
            return toString.call(arg) === '[object Array]';
        };

    }());
}

/**
 *
 */
Array.isArray || (Array.isArray = function(a){
    return'' + a !== a && {}.toString.call(a) == '[object Array]'
});

/**
 * isArray checks if an object is an array type
 *
 * @param obj
 * @returns {boolean}
 */
var isArray = function(obj) {
    if(obj.constructor) {
        return (obj.constructor === Array) || (obj.constructor === NodeList);
    } else {
        var length = "length" in Object(obj) && obj.length;

        if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
            return true;
        }

        return isString(obj) || isArray(obj) || length === 0 ||
        typeof length === 'number' && length > 0 && (length - 1) in obj;
    }
};

/**
 * bind polyfill
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/**
 * isNumber check if a value is typeof number
 *
 * @param value
 * @returns {boolean}
 */
function isNumber(value) {return typeof value === 'number';}

/**
 * isElement checks if an object is a dom element
 *
 * @param o
 * @returns {string|SVGAnimatedString|wa.className|*|I.id|T.id}
 */
var isElement  = function(o){
    return o.nodeName || o.tagName || o.className || o.id;
};

/**
 * last polyfill
 */
if (!Array.prototype.last) {
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
}

/**
 * QuerySelectorAll polyfill
 */
if (!document.querySelectorAll) {
    document.querySelectorAll = function (selectors) {
        var style = document.createElement('style'), elements = [], element;
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];

        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);
        style.parentNode.removeChild(style);

        while (document._qsa.length) {
            element = document._qsa.shift();
            element.style.removeAttribute('x-qsa');
            elements.push(element);
        }
        document._qsa = null;
        return elements;
    };
}

/**
 * QuerySelector polyfill
 */
if (!document.querySelector) {
    document.querySelector = function (selectors) {
        var elements = document.querySelectorAll(selectors);
        return (elements.length) ? elements[0] : null;
    };
}

/**
 * QuerySelectorAll
 *
 * @param selectors
 * @param parent
 * @returns {HTMLElement|*}
 */
var querySelectorAll = function(selectors, parent){
    var parent = (typeof parent != 'undefined') ? parent : document,
        elements = parent.querySelectorAll(selectors);

    return (elements.length > 1) ? elements : elements[0] || null;
};

/**
 * traverseChildren
 *
 * @param elem
 * @returns {Array}
 */
function traverseChildren(elem){
    var children = [];
    var q = [];
    q.push(elem);
    while (q.length > 0) {
        var elem = q.pop();
        children.push(elem);
        pushAll(elem.children);
    }
    function pushAll(elemArray){
        for(var i=0; i < elemArray.length; i++) {
            q.push(elemArray[i]);
        }
    }
    return children;
}

/**
 * Add Event Listener polyfill
 *
 * @param listener
 * @param func
 * @param obj
 * @param cupture
 * @returns {*}
 */
function addEvent(listener, func, obj, cupture){
    obj = (obj) ? obj : document;
    if(window.addEventListener){
        return obj.addEventListener(listener, func, cupture);
    } else if(window.attachEvent){
        return obj.attachEvent("on" + listener, func);
    }
}

