export declare function propPath(objectPath: string[]): ((obj: object) => any);
export declare function propPath(objectPath: string[], obj: object): any;
declare type Unpack<A> = A extends Array<infer E> ? E : any;
export declare function reduce<VTYPE, RTYPE = any>(reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: string | number) => RTYPE, init: RTYPE, collection: VTYPE): any;
export declare function reduceRight<VTYPE, RTYPE = any>(reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: string | number) => RTYPE, init: RTYPE, collection: VTYPE): any;
export {};
//# sourceMappingURL=objects.d.ts.map