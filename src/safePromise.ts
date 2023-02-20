export type UnaryFunction<RETURN=any, VALUE = any> = (arg: VALUE) => RETURN;


/**
 * Validates a promise and rejects if the predicate returns a false value.
 * @param pred Function to validate the promise with
 */
export function safePromise <R>(pred: UnaryFunction<boolean, R>): (arg: R) => Promise<R>
export function safePromise <R>(pred: UnaryFunction<boolean, R>, arg: R): Promise<R>
export function safePromise <R>(pred: UnaryFunction<boolean, R>, arg?: R){
  if (arguments.length === 1) return (arg: R) => safePromise(pred, arg);
  const result = pred(arg as R);
  return result ? Promise.resolve(arg) : Promise.reject(arg)
}