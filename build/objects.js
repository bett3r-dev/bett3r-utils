"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propPath = void 0;
function propPath(objectPath, obj) {
    if (!obj)
        return (obj) => propPath(objectPath, obj);
    return objectPath.reduce((currentObject, part) => currentObject && currentObject[part], obj);
}
exports.propPath = propPath;
//# sourceMappingURL=objects.js.map