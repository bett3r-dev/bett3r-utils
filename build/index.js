"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = void 0;
__exportStar(require("./objects"), exports);
__exportStar(require("./arrays"), exports);
__exportStar(require("./crocks"), exports);
__exportStar(require("./predicates"), exports);
__exportStar(require("./createMonoid"), exports);
var stream_1 = require("./stream");
Object.defineProperty(exports, "Stream", { enumerable: true, get: function () { return __importDefault(stream_1).default; } });
//# sourceMappingURL=index.js.map