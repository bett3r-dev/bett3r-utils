"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadOnly = exports.skip = exports.bufferCount = exports.once = void 0;
const flyd = __importStar(require("@bett3r-dev/flyd"));
//@ts-ignore
const droprepeats_1 = require("@bett3r-dev/flyd/module/droprepeats");
//@ts-ignore
const filter_1 = __importDefault(require("@bett3r-dev/flyd/module/filter"));
function once(stream$) {
    return flyd.combine(function (s$, self) {
        self(s$());
        self.end(true);
    }, [stream$]);
}
exports.once = once;
;
function bufferCount(bufferSize, bufferEvery, source) {
    if (flyd.isStream(bufferEvery)) {
        source = bufferEvery;
        bufferEvery = bufferSize;
    }
    let buffer = [];
    return flyd.combine(function (source, self) {
        buffer.push(source());
        if (buffer.length === bufferSize) {
            self(buffer);
            buffer = bufferEvery ? buffer.slice(bufferEvery) : buffer = [];
        }
        //@ts-ignore
    }, [source]);
}
exports.bufferCount = bufferCount;
;
function skip(count, stream) {
    return flyd.combine(function (s, self) {
        if (count <= 0) {
            self(s());
        }
        else {
            count--;
        }
    }, [stream]);
}
exports.skip = skip;
;
function getReadOnly(originalStream) {
    return flyd.combine(x => x(), [originalStream]);
}
exports.getReadOnly = getReadOnly;
exports.default = {
    ...flyd,
    filter: filter_1.default,
    dedupe: droprepeats_1.dropRepeats,
    once,
    skip,
    bufferCount,
    getReadOnly,
};
//# sourceMappingURL=stream.js.map