"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("./index");
describe('utils', function () {
    describe('isError', function () {
        it('returns true if the param passed is instance of errro', () => {
            class X extends Error {
            }
            const Y = new Error();
            chai_1.assert.isTrue(index_1.isError(new Error()));
            chai_1.assert.isTrue(index_1.isError(new X()));
            chai_1.assert.isTrue(index_1.isError(Y));
        });
        it('returns false if the param passed is instance of errro', () => {
            chai_1.assert.isFalse(index_1.isError());
            chai_1.assert.isFalse(index_1.isError(1));
            chai_1.assert.isFalse(index_1.isError(''));
            chai_1.assert.isFalse(index_1.isError(true));
            chai_1.assert.isFalse(index_1.isError(null));
            chai_1.assert.isFalse(index_1.isError({}));
            chai_1.assert.isFalse(index_1.isError([]));
        });
    });
    describe('ensureArray', function () {
        it('returns an array with the value passed as param if is not array', () => {
            chai_1.assert.deepEqual([], index_1.ensureArray());
            chai_1.assert.deepEqual([3], index_1.ensureArray(3));
            chai_1.assert.deepEqual([10n], index_1.ensureArray(10n));
            chai_1.assert.deepEqual([], index_1.ensureArray(undefined));
            chai_1.assert.deepEqual([], index_1.ensureArray(null));
            chai_1.assert.deepEqual([false], index_1.ensureArray(false));
            chai_1.assert.deepEqual([{}], index_1.ensureArray({}));
            chai_1.assert.deepEqual(['1'], index_1.ensureArray('1'));
            chai_1.assert.deepEqual(['asdf'], index_1.ensureArray('asdf'));
        });
        it('returns the same value if array passed', () => {
            chai_1.assert.deepEqual([3], index_1.ensureArray([3]));
            chai_1.assert.deepEqual([10n], index_1.ensureArray([10n]));
            chai_1.assert.deepEqual([undefined], index_1.ensureArray([undefined]));
            chai_1.assert.deepEqual([null], index_1.ensureArray([null]));
            chai_1.assert.deepEqual([{}], index_1.ensureArray([{}]));
            chai_1.assert.deepEqual(['1'], index_1.ensureArray(['1']));
            chai_1.assert.deepEqual(['asdf'], index_1.ensureArray(['asdf']));
        });
    });
    describe('push', function () {
        it('pushes the value into an array and return the array', () => chai_1.assert.deepEqual(index_1.push(3, [1, 2]), [1, 2, 3]));
        it('Curried pushes the value into an array and return the array', () => {
            const fn = index_1.push(3);
            chai_1.assert.deepEqual(fn([1, 2]), [1, 2, 3]);
        });
    });
    describe('foldMap', function () {
        it('folds and map an array of arrays', () => {
            const arr = [[1, 2, 3], [2], [2, 3]];
            chai_1.assert.deepEqual(index_1.foldMap(x => x, arr), [1, 2, 3, 2, 2, 3]);
        });
    });
    describe('unshift', function () {
        it('unshifts the value into an array and return the array', () => chai_1.assert.deepEqual(index_1.unshift(1, [2, 3]), [1, 2, 3]));
        it('Curried unshifts the value into an array and return the array', () => {
            const fn = index_1.unshift(1);
            chai_1.assert.deepEqual(fn([2, 3]), [1, 2, 3]);
        });
    });
    describe('findAndPerform', function () {
        it('finds an item in an array appliying a predicate, and returns the result of such apply over found item', () => {
            const arr = [2, 4];
            const result = index_1.findAndPerform(x => x % 2, arr);
            chai_1.assert.isUndefined(result);
        });
        it('finds an item in an array appliying a predicate, and returns the result of such apply over found item', () => {
            const arr = [2, 4, 3];
            const result = index_1.findAndPerform(x => x % 2, arr);
            chai_1.assert.equal(result, 1);
        });
    });
});
//# sourceMappingURL=utils.test.js.map