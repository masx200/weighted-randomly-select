declare function selectWithValidation<T>(
    choices: Array<{
        result: T;
        chance: number;
    }>
): T;
declare function selectWithoutValidation<T>(
    choices: Array<{
        result: T;
        chance: number;
    }>
): T;
declare function Selector<T>(
    choices: Array<{
        result: T;
        chance: number;
    }>
): {
    select: () => T;
};
export { Selector, selectWithoutValidation, selectWithValidation as select };
