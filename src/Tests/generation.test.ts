import { isValidLifeString } from '../functions/generationFunctions';

const conwayString: string = "B3/S23"
console.log(conwayString.split("/"));
console.log(isNaN(Number.parseInt("5")));


test("Valid life string", () => {
    expect(isValidLifeString("B3/S23")).toBe(true);
});
