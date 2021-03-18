"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = exports.findAndPerform = exports.unshift = exports.push = exports.foldMap = exports.ensureArray = exports.isError = void 0;
const rambda_1 = require("rambda");
const isError = (error) => error instanceof Error;
exports.isError = isError;
const ensureArray = (theArray) => Array.isArray(theArray) ? theArray : (theArray != null ? [theArray] : []);
exports.ensureArray = ensureArray;
function foldMap(fn, collection) {
    if (!collection)
        return (collection) => foldMap(fn, collection);
    return rambda_1.reduce((acc, functor) => acc.concat(functor.map ? functor.map(fn) : fn(functor)), [], collection);
}
exports.foldMap = foldMap;
function push(value, list) {
    if (!list)
        return (l) => push(value, l);
    list.push(value);
    return list;
}
exports.push = push;
function unshift(value, list) {
    if (!list)
        return (l) => unshift(value, l);
    list.unshift(value);
    return list;
}
exports.unshift = unshift;
function findAndPerform(predicate, iterable) {
    if (!iterable)
        return (iterable) => findAndPerform(predicate, iterable);
    for (const item of iterable) {
        const result = predicate(item);
        if (!result)
            continue;
        return result;
    }
}
exports.findAndPerform = findAndPerform;
;
function traverse(functor, fn, array) {
    return array.reduce((acc, item) => acc.map(x => y => x.concat([y])).ap(fn(item)), functor([]));
}
exports.traverse = traverse;
;
exports.default = {
    isError: exports.isError,
    ensureArray: exports.ensureArray,
    foldMap,
    push,
    unshift,
    findAndPerform,
    traverse
};
//# sourceMappingURL=index.js.map