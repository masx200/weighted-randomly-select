// deno-lint-ignore-file no-explicit-any
// Performs validation on input before performing the random selection
function selectWithValidation(choices) {
    // Validate argument is an array
    if (!choices || !choices.length) {
        throw new Error(
            "Randomly Select: invalid argument, please provide a non-empty array"
        );
    }
    // Validate that:
    // - each array entry has a 'chance' and 'result' property
    // - each 'chance' field is a number
    // - at least one result has a positive non-zero chance
    let atLeastOneChoiceHasNonZeroChance = false;
    for (let i = 0; i < choices.length; i++) {
        if (
            !exists(choices[i]) ||
            !exists(choices[i].chance) ||
            !exists(choices[i].result)
        ) {
            throw new Error(
                "Randomly Select: invalid argument, each array entry " +
                    "must be an object with 'chance' and 'result' properties"
            );
        } else if (
            typeof choices[i].chance !== "number" ||
            choices[i].chance < 0
        ) {
            throw new Error(
                "Randomly Select: invalid argument, 'chance' must be a positive number: " +
                    JSON.stringify(choices[i].chance)
            );
        } else if (choices[i].chance > 0) {
            atLeastOneChoiceHasNonZeroChance = true;
        }
    }
    if (!atLeastOneChoiceHasNonZeroChance) {
        throw new Error(
            "Randomly Select: invalid arguments, all results have zero weight"
        );
    }
    // Do the actual random selection and return the result
    return selectWithoutValidation(choices);
}
// Performs the random selection without validating any input
function selectWithoutValidation(choices) {
    const selector = Selector(choices);
    return selector.select();
}
function exists(value) {
    return value != null && value != undefined;
}
function Selector(choices) {
    const choicesWithNonZeroChances = [];
    let totalWeight = 0.0;
    for (let i = 0; i < choices.length; i++) {
        if (choices[i].chance > 0.0) {
            choicesWithNonZeroChances.push(choices[i]);
            totalWeight += choices[i].chance;
        }
    }
    const chancePrefixSum = Array();
    let chanceCovered = 0.0;
    for (let i = 0; i < choicesWithNonZeroChances.length; i++) {
        chanceCovered += choicesWithNonZeroChances[i].chance;
        chancePrefixSum[i] = chanceCovered;
    }
    const biggest = choicesWithNonZeroChances.reduce((p, c) =>
        p.chance > c.chance ? p : c
    ).result;
    return {
        select: () => {
            const value = Math.random() * totalWeight;
            let left = 0;
            let right = choicesWithNonZeroChances.length - 1;
            while (left < right) {
                const mid = Math.floor((left + right) / 2);
                const chanceCovered = chancePrefixSum[mid];
                if (chanceCovered < value) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            const chanceCovered = chancePrefixSum[left];
            if (
                value < chanceCovered &&
                value >= (chancePrefixSum[left - 1] ?? 0)
            ) {
                return choicesWithNonZeroChances[left].result;
            }
            return biggest;
        },
    };
}

export { Selector, selectWithoutValidation, selectWithValidation as select };
