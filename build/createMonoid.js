"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMonoid = void 0;
const predicates_1 = require("crocks/predicates");
const flNames_1 = __importDefault(require("crocks/core/flNames"));
const equals_1 = __importDefault(require("crocks/core/equals"));
const inspect_1 = __importDefault(require("crocks/core/inspect"));
const implements_1 = __importDefault(require("crocks/core/implements"));
const isSameType_1 = __importDefault(require("crocks/core/isSameType"));
function createMonoid(name, empty, concatFn, equalFn = equals_1.default) {
    const _empty = () => _monoid(empty);
    const _type = () => name;
    function _monoid(initial) {
        const value = predicates_1.isNil(initial) ? _empty().valueOf() : initial;
        const valueOf = () => value;
        const empty = _empty;
        const inspect = () => `${name}${inspect_1.default(valueOf())}`;
        const equals = (otherMonoid) => isSameType_1.default(_monoid, otherMonoid) && equalFn(value, otherMonoid.valueOf());
        const concat = (method) => {
            return (otherMonoid) => {
                // istanbul ignore next
                if (!isSameType_1.default(_monoid, otherMonoid)) {
                    throw new TypeError(`${name}.${method}: ${name} required`);
                }
                return _monoid(concatFn(value, otherMonoid.valueOf()));
            };
        };
        return {
            inspect, toString: inspect,
            equals, valueOf, type: _type, empty,
            ['@@type']: _type,
            concat: concat('concat'),
            [flNames_1.default.equals]: equals,
            [flNames_1.default.concat]: concat(flNames_1.default.concat),
            [flNames_1.default.empty]: empty,
            constructor: _monoid,
            name
        };
    }
    _monoid['@@implements'] = implements_1.default(['equals', 'concat', 'empty']);
    _monoid.empty = _empty;
    _monoid.type = _type;
    //@ts-ignore
    _monoid[flNames_1.default.empty] = _empty;
    _monoid['@@type'] = _type;
    return _monoid;
}
exports.createMonoid = createMonoid;
//# sourceMappingURL=createMonoid.js.map