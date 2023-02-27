import { timeStamp } from "console";
import { FreqMap2D } from "common/FreqMap2D"

function has2DTuples(tuple2DArray: Array<[number, number]>, ...tests: Array<[number, number]>): boolean {
    return tests.every(testTuple => tuple2DArray.some(tuple => tuple[0] === testTuple[0] && tuple[1] === testTuple[1]))
}

test("Repeated Element", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(2, 4);
    freqMap.add(2, 4);
    freqMap.add(2, 4);
    expect(freqMap.get_freq(2, 4) === 3).toBe(true) 
})

test("Get With Frequency", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(3, 4);
    freqMap.add(3, 4);
    freqMap.add(4, 5);
    freqMap.add(4, 5);
    const withTwoFrequency = freqMap.get_with_freq(2);
    expect(has2DTuples(withTwoFrequency, [3, 4], [4, 5]) && withTwoFrequency.length === 2).toBe(true)
})

test("Get With Frequency, Outsider Vector Component", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(2, 4);

    freqMap.add(3, 4);
    freqMap.add(3, 4);

    freqMap.add(4, 5);
    freqMap.add(4, 5);

    freqMap.add(3, 5);
    freqMap.add(3, 5);
    freqMap.add(3, 5);

    const withTwoFrequency = freqMap.get_with_freq(2);
    expect(has2DTuples(withTwoFrequency, [3, 4], [4, 5]) && withTwoFrequency.length === 2).toBe(true)
})

test("Get With Frequency, Zero", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(2, 4);

    freqMap.add(3, 4);
    freqMap.add(3, 4);

    freqMap.add(4, 5);
    freqMap.add(4, 5);

    freqMap.add(3, 5);
    freqMap.add(3, 5);
    freqMap.add(3, 5);
    
    const withTwoFrequency = freqMap.get_with_freq(0);
    expect(withTwoFrequency.length === 0).toBe(true)
})

test("Get With Frequency, Decimal Number", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(2, 4);

    freqMap.add(3, 4);
    freqMap.add(3, 4);

    freqMap.add(4, 5);
    freqMap.add(4, 5);

    freqMap.add(3, 5);
    freqMap.add(3, 5);
    freqMap.add(3, 5);
    
    expect(() => freqMap.get_with_freq(0.25)).toThrow()
})

test("Get With Frequency, Negative Integer", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(2, 4);

    freqMap.add(3, 4);
    freqMap.add(3, 4);

    freqMap.add(4, 5);
    freqMap.add(4, 5);

    freqMap.add(3, 5);
    freqMap.add(3, 5);
    freqMap.add(3, 5);
    
    expect(() => freqMap.get_with_freq(-2)).toThrow()
})

test("Get With Frequency, Negative Decimal", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(2, 4);

    freqMap.add(3, 4);
    freqMap.add(3, 4);

    freqMap.add(4, 5);
    freqMap.add(4, 5);

    freqMap.add(3, 5);
    freqMap.add(3, 5);
    freqMap.add(3, 5);
    
    expect(() => freqMap.get_with_freq(-2.23)).toThrow()
})

test("Addition and Removal", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(2, 4);
    freqMap.add(2, 4);
    freqMap.remove(2, 4);
    expect(freqMap.get_freq(2, 4) === 1).toBe(true) 
})

test("Removal of absent value", () => {
    const freqMap = new FreqMap2D();
    expect(() => freqMap.remove(2, 4)).toThrow(Error)
})

test("Component ordering", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(2, 4);
    freqMap.add(2, 4);
    freqMap.add(4, 2);
    expect(freqMap.get_freq(4, 2) === 1 && freqMap.get_freq(2, 4) === 2).toBe(true) 
})

test("get_freq Unpresent value", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(4, 2);
    freqMap.add(3, 3);
    freqMap.add(2, 3);
    expect(freqMap.get_freq(3, 2) === 0).toBe(true)
})

test("has Unpresent value", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(4, 2);
    freqMap.add(3, 3);
    freqMap.add(2, 3);
    expect(freqMap.has(3, 2)).toBe(false)
})

test("has present value", () => {
    const freqMap = new FreqMap2D();
    freqMap.add(4, 2);
    freqMap.add(3, 3);
    freqMap.add(2, 3);
    expect(freqMap.has(3, 3)).toBe(true)
})

test("get with freqs set", () => {
    const freqMap = new FreqMap2D()
    freqMap.add(2, 3);
    freqMap.add(2, 3);

    freqMap.add(3, 4);
    freqMap.add(3, 4);
    freqMap.add(3, 4);

    freqMap.add(4, 5)

    freqMap.add(5, 6);
    freqMap.add(5, 6);
    freqMap.add(5, 6);
    freqMap.add(5, 6);

    freqMap.add(7, 8);
    freqMap.add(7, 8);


    const set = freqMap.get_with_freqs_set(2, 3)
    console.log(set.getTuples())
    expect(set.hasAllExact([
        [2, 3],
        [3, 4],
        [7, 8]
    ])).toBe(true)

})