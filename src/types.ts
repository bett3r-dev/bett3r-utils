export type Override<T1, T2> = {
  [K in Exclude<keyof T1, keyof T2>]: T1[K]
} & {
  [K in keyof T2]: T2[K]
};