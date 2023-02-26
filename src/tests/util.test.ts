export {}
import { isEqualNumberArray, isSimilarNumberArray, range } from "common/util"

test("Is Equal Number Array - Exact", () => {
    const arr1 = [0, 2, 6, 3, 4]
    const arr2 = [0, 2, 6, 3, 4]
    expect(isEqualNumberArray(arr1, arr2)).toBe(true)
} )

test("Is Equal Number Array - Subarrays", () => {
    const arr1 = [0, 2, 6, 3, 4]
    const arr2 = [0, 2, 6, 3, 4, 7, 8]
    expect(isEqualNumberArray(arr1, arr2)).toBe(false)
})

test("Is Equal Number Array - Same Length, Same Entries, Different Order", () => {
    const arr1 = [0, 2, 6, 3, 4]
    const arr2 = [2, 0, 6, 4, 3]
    expect(isEqualNumberArray(arr1, arr2)).toBe(false)
})

test("Is Equal Number Array - Same Length, Same Entries, Different Frequencies", () => {
    const arr1 = [0, 2, 6, 3, 4, 3, 2, 3]
    const arr2 = [2, 2, 6, 3, 4, 3, 2, 2]
    expect(isEqualNumberArray(arr1, arr2)).toBe(false)
}) 

test("Is Similar Number Array - Exact", () => {
    const arr1 = [0, 2, 6, 3, 4]
    const arr2 = [0, 2, 6, 3, 4]
    expect(isSimilarNumberArray(arr1, arr2)).toBe(true)
})


test("Is Similar Number Array - Subarrays", () => {
    const arr1 = [0, 2, 6, 3, 4]
    const arr2 = [0, 2, 6, 3, 4, 7, 8]
    expect(isSimilarNumberArray(arr1, arr2)).toBe(false)
})

test("Is Similar Number Array - Same Length, Same Entries, Different Order", () => {
    const arr1 = [0, 2, 6, 3, 4]
    const arr2 = [2, 0, 6, 4, 3]
    expect(isSimilarNumberArray(arr1, arr2)).toBe(true)
})

test("Is Similar Number Array - Same Length, Same Entries, Different Frequencies", () => {
    const arr1 = [0, 2, 6, 3, 4, 3, 2, 3]
    const arr2 = [0, 2, 6, 2, 4, 3, 2, 2]
    expect(isSimilarNumberArray(arr1, arr2)).toBe(false)
})

test("range", () => {
    const numrange = range(0, 5);
    const expected = [0, 1, 2, 3, 4]
    expect(isEqualNumberArray(expected, numrange)).toBe(true)
})