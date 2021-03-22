"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = exports.readFile = exports.falsyToEither = exports.falsyToAsync = exports.nullableToEither = exports.nullableToAsync = exports.ensureAsync = exports.promiseToAsync = void 0;
const fs_1 = __importDefault(require("fs"));
const Async_1 = __importDefault(require("crocks/Async"));
const Either_1 = __importDefault(require("crocks/Either"));
const maybeToAsync_1 = __importDefault(require("crocks/Async/maybeToAsync"));
const maybeToEither_1 = __importDefault(require("crocks/Either/maybeToEither"));
const safe_1 = __importDefault(require("crocks/Maybe/safe"));
const crocks_1 = require("crocks");
const rambda_1 = require("rambda");
const promiseToAsync = (promise) => Async_1.default((reject, resolve) => promise.then(resolve, reject));
exports.promiseToAsync = promiseToAsync;
const ensureAsync = (possibleAsync) => possibleAsync?.type && possibleAsync.type() === 'Async' ? possibleAsync :
    ((!possibleAsync || !possibleAsync.then) ? Async_1.default.of(possibleAsync) : exports.promiseToAsync(possibleAsync));
exports.ensureAsync = ensureAsync;
const nullableToAsync = (arg) => Async_1.default.of(safe_1.default(rambda_1.compose(rambda_1.not, crocks_1.isNil), arg))
    .chain(maybeToAsync_1.default(null));
exports.nullableToAsync = nullableToAsync;
const nullableToEither = (arg) => Either_1.default.of(safe_1.default(rambda_1.compose(rambda_1.not, crocks_1.isNil), arg))
    .chain(maybeToEither_1.default(null));
exports.nullableToEither = nullableToEither;
const falsyToAsync = (arg) => Async_1.default.of(safe_1.default(crocks_1.isTruthy, arg))
    .chain(maybeToAsync_1.default(false));
exports.falsyToAsync = falsyToAsync;
const falsyToEither = (arg) => Either_1.default.of(safe_1.default(crocks_1.isTruthy, arg))
    .chain(maybeToEither_1.default(false));
exports.falsyToEither = falsyToEither;
exports.readFile = Async_1.default.fromNode(fs_1.default.readFile);
function traverse(functor, fn, array) {
    return array.reduce((acc, item) => acc.map(x => y => x.concat([y])).ap(fn(item)), functor([]));
}
exports.traverse = traverse;
;
//# sourceMappingURL=crocks.js.map