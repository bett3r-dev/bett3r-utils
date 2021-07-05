import { dropRepeats } from '@bett3r-dev/flyd/module/droprepeats';
import filter from '@bett3r-dev/flyd/module/filter';
export declare function once<T>(stream$: flyd.Stream<T>): flyd.Stream<T>;
export declare function bufferCount<T>(bufferSize: number, source: flyd.Stream<T>): flyd.Stream<T>;
export declare function bufferCount<T>(bufferSize: number, bufferEvery: number, source: flyd.Stream<T>): flyd.Stream<T[]>;
export declare function skip<T>(count: number, stream: flyd.Stream<T>): flyd.Stream<T> | ((stream: flyd.Stream<T>) => flyd.Stream<T> | Function);
export declare function getReadOnly<T>(originalStream: flyd.Stream<T>): flyd.Stream<T>;
declare type S = typeof import('@bett3r-dev/flyd');
export interface Stream extends S {
    filter: typeof filter;
    dedupe: typeof dropRepeats;
    once: typeof once;
    skip: typeof skip;
    bufferCount: typeof bufferCount;
    getReadOnly: typeof getReadOnly;
}
declare const _default: Stream;
export default _default;
//# sourceMappingURL=stream.d.ts.map