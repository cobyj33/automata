
/**
 * A module to hold static data of the Automata Program
 * Generally, use the provided functions or create new functions act on the data
 */
import { isValidLifeString } from "functions/generationFunctions"

const _NAMED_LIFE_RULES_LIST = ["Conway's Game Of Life", "Walled Cities", "Vote 4/5", "Vote", "Star Trek", "Stains", "SnowLife", "Seeds", "Rings 'n' Slugs", "Pseudo Life", "Plow World", "Pedestrian Life without Death", "Pedestrian Life", "Pedestrian Flock", "Oscillators Rule", "Morley", "Maze", "Majority", "LowLife", "LowFlockDeath", "LowDeath", "LongLife", "Logarithmic replicator rule", "Live Free or Die", "Lifeguard 2", "Lifeguard 1", "Life without Death", "Life SkyHigh", "IronLife", "IronFlock", "Iceballs", "HoneyLife", "HoneyFlock", "Holstein", "HighLife", "HighFlock", "Geology", "Gems Minor", "Gems", "Flock", "Electrified Maze", "EightLife", "EightFlock", "DryLife without Death", "DryLife", "DryFlock", "DrighLife", "DotLife", "Diamoeba", "Day and Night", "Dance", "Corrosion of Conformity", "Coral", "Bugs", "Blinkers", "Bacteria", "Assimilation", "Amoeba", "3-4 Life", "2x2 2", "2x2"] as const;
export type NamedLifeRule = typeof _NAMED_LIFE_RULES_LIST[number]

export const NAMED_LIFE_RULES_LIST: Readonly<NamedLifeRule[]> = Object.freeze(_NAMED_LIFE_RULES_LIST)

export const NAMED_LIFE_RULES_TO_RULE_STRINGS: Readonly<{ [key in NamedLifeRule]: string }> = Object.freeze({
    "Conway's Game Of Life": "B3/S23",
    "Walled Cities": "B45678/S2345",
    "Vote 4/5": "B4678/S35678",
    "Vote": "B5678/S45678",
    "Star Trek": "B3/S0248",
    "Stains": "B3678/S235678",
    "SnowLife": "B3/S1237",
    "Seeds": "B2/S",
    "Rings 'n' Slugs": "B56/S14568",
    "Pseudo Life": "B357/S238",
    "Plow World": "B378/S012345678",
    "Pedestrian Life without Death": "B38/S012345678",
    "Pedestrian Life": "B38/S23",
    "Pedestrian Flock": "B38/S12",
    "Oscillators Rule": "B45/S1235",
    "Morley": "B368/S245",
    "Maze": "B3/S12345",
    "Majority": "B45678/S5678",
    "LowLife": "B3/S13",
    "LowFlockDeath": "B368/S128",
    "LowDeath": "B368/S238",
    "LongLife": "B345/S5",
    "Logarithmic replicator rule": "B36/S245",
    "Live Free or Die": "B2/S0",
    "Lifeguard 2": "B3/S4567",
    "Lifeguard 1": "B48/S234",
    "Life without Death": "B3/S012345678",
    "Life SkyHigh": "B368/S236",
    "IronLife": "B36/S238",
    "IronFlock": "B36/S128",
    "Iceballs": "B25678/S5678",
    "HoneyLife": "B38/S238",
    "HoneyFlock": "B38/S128",
    "Holstein": "B35678/S4678",
    "HighLife": "B36/S23",
    "HighFlock": "B36/S12",
    "Geology": "B3578/S24678",
    "Gems Minor": "B34578/S456",
    "Gems": "B3457/S4568",
    "Flock": "B3/S12",
    "Electrified Maze": "B45/S12345",
    "EightLife": "B3/S238",
    "EightFlock": "B3/S128",
    "DryLife without Death": "B37/S012345678",
    "DryLife": "B37/S23",
    "DryFlock": "B37/S12",
    "DrighLife": "B367/S23",
    "DotLife": "B3/S023",
    "Diamoeba": "B35678/S5678",
    "Day and Night": "B3678/S34678",
    "Dance": "B34/S35",
    "Corrosion of Conformity": "B3/S124",
    "Coral": "B3/S45678",
    "Bugs": "B3567/S15678",
    "Blinkers": "B345/S2",
    "Bacteria": "B34/S456",
    "Assimilation": "B345/S4567",
    "Amoeba": "B357/S1358",
    "3-4 Life": "B34/S34",
    "2x2 2": "B3678/S1258",
    "2x2": "B36/S125",
})

export const RULE_STRINGS_TO_NAMED_LIFE_RULES: Readonly<{ [key: string]: string }> = Object.freeze( Object.fromEntries( Object.entries(NAMED_LIFE_RULES_TO_RULE_STRINGS).map(entry => ([entry[1], entry[0]]) ) ) )
// export const NAMED_LIFE_RULES_LIST: Readonly<string[]> = Object.freeze(Object.keys(NAMED_LIFE_RULES_TO_RULE_STRINGS))
export const NAMED_RULE_STRINGS_LIST: Readonly<string[]> = Object.freeze(Object.values(NAMED_LIFE_RULES_TO_RULE_STRINGS))

export function isNamedLifeRule(ruleString: string): boolean {
    return ruleString in RULE_STRINGS_TO_NAMED_LIFE_RULES
}

export function getLifeRuleName(ruleString: string): string {
    return RULE_STRINGS_TO_NAMED_LIFE_RULES[ruleString]
}

export function getNamedLifeRuleString(namedRule: NamedLifeRule): string {
    return NAMED_LIFE_RULES_TO_RULE_STRINGS[namedRule]
}

export function isNamedLifeRuleString(namedRule: string): boolean {
    return namedRule in NAMED_LIFE_RULES_LIST
}