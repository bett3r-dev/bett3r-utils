export const ensureFunction = (data: any) => typeof data === "function" ? data : () => data;
export const noop = () => {}
