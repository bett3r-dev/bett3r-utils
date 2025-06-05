export type Override<T1, T2> = {
  [K in Exclude<keyof T1, keyof T2>]: T1[K]
} & {
  [K in keyof T2]: T2[K]
};

export type Primitive = string | number | boolean | null | undefined | symbol | bigint;

export type JsonValue = Primitive | JsonObject | JsonArray;

export interface JsonObject { [k: string]: JsonValue }

export interface JsonArray extends Array<JsonValue> {}
