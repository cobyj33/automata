import { NAMED_LIFE_RULES_TO_RULE_STRINGS } from "data";
import { isValidLifeString } from "libca/generationFunctions";

test("Life Rules Data Test - All Life Strings Valid", () => {
    const ruleStrings = Object.values(NAMED_LIFE_RULES_TO_RULE_STRINGS)
    expect(ruleStrings.map(ruleString => isValidLifeString(ruleString)).every(val => val === true)).toBe(true)
})