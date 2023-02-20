export type Unpack<A> = A extends Array<infer E> ? E : A extends Record<string, infer E> ? E : any;