export declare function propPath(objectPath: string[]): ((obj: object) => any);
export declare function propPath(objectPath: string[], obj: object): any;
export declare function inverseAssign(patchObj: object): ((originalObj: object) => object);
export declare function inverseAssign(patchObj: object, originalObj: object): object;
declare type Unpack<A> = A extends Array<infer E> ? E : any;
export declare function reduce<VTYPE, RTYPE = any>(reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE): RTYPE | ((init: RTYPE, collection?: VTYPE) => RTYPE | ((collection: VTYPE) => RTYPE));
export declare function reduce<VTYPE, RTYPE = any>(reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE): RTYPE | ((collection: VTYPE) => RTYPE);
export declare function reduce<VTYPE, RTYPE = any>(reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE): RTYPE;
export declare function reduceRight<VTYPE, RTYPE = any>(reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE): RTYPE | ((init: RTYPE, collection?: VTYPE) => RTYPE | ((collection: VTYPE) => RTYPE));
export declare function reduceRight<VTYPE, RTYPE = any>(reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE): RTYPE | ((collection: VTYPE) => RTYPE);
export declare function reduceRight<VTYPE, RTYPE = any>(reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE): RTYPE;
export {};
//# sourceMappingURL=objects.d.ts.map