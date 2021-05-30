"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseObject = exports.traverse = exports.readFile = exports.nullableToEither = exports.nullableToAsync = exports.ensureAsync = exports.I = exports.promiseToAsync = void 0;
const fs_1 = __importDefault(require("fs"));
const Async_1 = __importDefault(require("crocks/Async"));
const Either_1 = __importDefault(require("crocks/Either"));
const maybeToAsync_1 = __importDefault(require("crocks/Async/maybeToAsync"));
const maybeToEither_1 = __importDefault(require("crocks/Either/maybeToEither"));
const safe_1 = __importDefault(require("crocks/Maybe/safe"));
const predicates_1 = require("crocks/predicates");
const combinators_1 = require("crocks/combinators");
const rambda_1 = require("rambda");
const promiseToAsync = (promise) => Async_1.default((reject, resolve) => promise.then(resolve, reject));
exports.promiseToAsync = promiseToAsync;
exports.I = combinators_1.identity;
const ensureAsync = (possibleAsync) => safe_1.default((x) => !!x, possibleAsync)
    .either(() => Async_1.default.of(undefined), (possibleAsync) => {
    if (possibleAsync.type && possibleAsync.type() === 'Async')
        return possibleAsync;
    else if (!possibleAsync || !possibleAsync.then)
        return Async_1.default.of(possibleAsync);
    return exports.promiseToAsync(possibleAsync);
});
exports.ensureAsync = ensureAsync;
const nullableToAsync = (arg) => Async_1.default.of(safe_1.default(rambda_1.compose(rambda_1.not, predicates_1.isNil), arg))
    .chain(maybeToAsync_1.default(null));
exports.nullableToAsync = nullableToAsync;
const nullableToEither = (arg) => Either_1.default.of(safe_1.default(rambda_1.compose(rambda_1.not, predicates_1.isNil), arg))
    .chain(maybeToEither_1.default(null));
exports.nullableToEither = nullableToEither;
exports.readFile = Async_1.default.fromNode(fs_1.default.readFile);
function traverse(destFunctor, transformFunction, arrayToTraverse) {
    if (!transformFunction)
        return (transformFunction, arrayToTraverse) => traverse(destFunctor, transformFunction, arrayToTraverse);
    if (!arrayToTraverse)
        return (arrayToTraverse) => traverse(destFunctor, transformFunction, arrayToTraverse);
    return arrayToTraverse
        .reduce((functor, item) => functor
        .map((traversedArray) => (transformedItem) => traversedArray.concat([transformedItem]))
        .ap(transformFunction(item)), destFunctor([]));
}
exports.traverse = traverse;
;
function traverseObject(destFunctor, transformFunction, objOfFunctors) {
    if (!transformFunction)
        return (transformFunction, objOfFunctors) => traverseObject(destFunctor, transformFunction, objOfFunctors);
    if (!objOfFunctors)
        return (objOfFunctors) => traverseObject(destFunctor, transformFunction, objOfFunctors);
    return traverse(destFunctor, transformFunction, Object.values(objOfFunctors))
        .map((x) => (keys) => rambda_1.reduce((acc, curr, index) => rambda_1.assoc(keys[index], curr, acc), {}, x))
        .ap(destFunctor(Object.keys(objOfFunctors)));
}
exports.traverseObject = traverseObject;
//# sourceMappingURL=crocks.js.map