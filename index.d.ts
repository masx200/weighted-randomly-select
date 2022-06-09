declare function select<T>(options: Array<{ result: T; chance: number }>): T;
declare const selectWithoutValidation: typeof select;
export { select, selectWithoutValidation };
