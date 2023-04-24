
const prop = (obj: any, path: string) =>
  path.split(".").reduce((acc, key) => acc && acc[key], obj);

export const pushSorted = <T>(
  array: T[],
  value: T,
  propertyPath?: string | ((item: T) => any),
  low = 0,
  high = array.length
): T[] => {
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (
      propertyPath
        ? typeof propertyPath === "string"
          ? prop(array[mid], propertyPath) < prop(value, propertyPath)
          : propertyPath(array[mid]) < propertyPath(value)
        : array[mid] < value
    )
      low = mid + 1;
    else high = mid;
  }
  array.splice(low, 0, value);
  return array;
};
