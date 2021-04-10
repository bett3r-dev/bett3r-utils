"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceRight = exports.reduce = exports.inverseAssign = exports.propPath = void 0;
function propPath(objectPath, obj) {
    if (!obj)
        return (obj) => propPath(objectPath, obj);
    return objectPath.reduce((currentObject, part) => currentObject && currentObject[part], obj);
}
exports.propPath = propPath;
function inverseAssign(patchObj, originalObj) {
    if (!originalObj)
        return (originalObj) => inverseAssign(patchObj, originalObj);
    return Object.assign(originalObj, patchObj);
}
exports.inverseAssign = inverseAssign;
function reduce(reducer, init, collection) {
    if (!collection)
        return (collection) => reduce(reducer, init, collection);
    if (Array.isArray(collection))
        return collection.reduce(reducer, init);
    return Object.keys(collection)
        .reduce((acc, key) => reducer(acc, collection[key], key), init);
}
exports.reduce = reduce;
;
function reduceRight(reducer, init, collection) {
    if (!collection)
        return (collection) => reduceRight(reducer, init, collection);
    if (Array.isArray(collection))
        return collection.reduceRight(reducer, init);
    return Object.keys(collection)
        .reduceRight((acc, key) => reducer(acc, collection[key], key), init);
}
exports.reduceRight = reduceRight;
;
//# sourceMappingURL=objects.js.map