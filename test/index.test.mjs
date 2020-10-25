import { deepEqual } from "assert";
import { parser, parserV2, parserV3 } from "../src/compiler/parser.mjs";
import { checker } from "../src/compiler/checker.mjs";

describe("type system compiler", () => {
  it("scenario 1 - should thrown an error with string vs number", async () => {
    const sourceCode = `
      fn("craig-string"); // throw with string vs number
      function fn(a: number) {}
    `;
    const sourceAst = parser(sourceCode);
    const errors = checker(sourceAst);

    deepEqual(['Type "craig-string" is incompatible with "number"'], errors);
  });

  it("scenario 2 - should thrown an error with string vs undefined and non-existing type", async () => {
    const sourceCodeV2 = `
      fn("craig-string"); // throw with string vs ?
      function fn(a: made_up_type) {} // throw with bad type
    `;

    const sourceAstV2 = parserV2(sourceCodeV2);
    const errors = checker(sourceAstV2);

    deepEqual(
      [
        'Type "craig-string" is incompatible with "undefined"',
        'Type "made_up_type" for argument "a" does not exist',
      ],
      errors
    );
  });

  it("scenario 3 - should thrown an error with using wrong prop on an interface", async () => {
    const sourceCodeV3 = `
      interface Person {
        name: string;
      }
      fn({nam: "craig"}); // throw with "nam" vs "name"
      function fn(a: Person) {}
    `;
    const sourceAstV3 = parserV3(sourceCodeV3);
    const errors = checker(sourceAstV3);

    deepEqual(
      [
        'Property "nam" does not exist on interface "Person". Did you mean Property "name"?',
      ],
      errors
    );
  });
});
