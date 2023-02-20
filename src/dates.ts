type DateUnits = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';
import { add, subtract, pipe } from 'ramda'
/**
 * Performs date difference d1 - d2 in the specified unit.
 * @param d1 Date
 * @param d2 Date
 * @param unit string
 * @returns number
 */
export const dateDiff = (d1: any, d2: any, unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' = 'milliseconds') => {
  const milliseconds = (d: number) => d
  const seconds = ( date: number ) => date / 1000;
  const minutes = pipe( seconds, (date: number) => date / 60);
  const hours = pipe( minutes, (date: number) => date / 60);
  const days = pipe( hours, (date: number) => date / 24);
  const ops = {milliseconds, seconds, minutes, hours, days };
  return ops[unit](new Date(d1).valueOf() - new Date(d2).valueOf());
}

/**
 * Returns -1 is d1 < d2, and 1 otherwise. Ideal for sorting by dates
 * @param d1 Date
 * @param d2 Date
 * @returns number
 */
export const compareDates = (d1: any, d2: any) => {
  const diff = dateDiff(d1, d2);
  return diff < 0 ? -1 : 1
}

/**
 * Add units to a date
 * @param date Date
 * @param amount number
 * @param unit the unit to add
 * @returns
 */
const _operateDate = (op: 'add' | 'subtract', date: any, amount: number, unit: DateUnits) => {
  const ops = {add, subtract};
  const operationMap = {
    milliseconds: (date: Date, amount: number) => date.setUTCMilliseconds(ops[op](date.getUTCMilliseconds(), amount)),
    seconds: (date: Date, amount: number) => date.setUTCSeconds(ops[op](date.getUTCSeconds(), amount)),
    minutes: (date: Date, amount: number) => date.setUTCMinutes(ops[op](date.getUTCMinutes(), amount)),
    hours: (date: Date, amount: number) => date.setUTCHours(ops[op](date.getUTCHours(), amount)),
    days: (date: Date, amount: number) => date.setUTCDate(ops[op](date.getUTCDate(), amount)),
    months: (date: Date, amount: number) => date.setUTCMonth(ops[op](date.getUTCMonth(), amount)),
    years: (date: Date, amount: number) => date.setUTCFullYear(ops[op](date.getUTCFullYear(), amount)),
  }
  return operationMap[unit](new Date(date), amount);
}

/**
 * Returns a new date with the specified amount of units added
 * @param date The target date
 * @param amount The amount to add
 * @param unit The unit of the determined amount to add
 * @returns 
 */
export const dateAdd = (date: any, amount:number, unit: DateUnits ) => {
  return _operateDate('add', date, amount, unit)
}

/**
 * Returns a new date with the specified amount of units subtracted
 * @param date The target date
 * @param amount The amount to subtract
 * @param unit The unit of the determined amount to subtract
 * @returns 
 */
export const dateSubtract = (date: any, amount:number, unit: DateUnits ) => {
  return _operateDate('add', date, amount, unit)
}