import { parser, parserV2, parserV3 } from "./compiler/parser.mjs";
import { checker } from "./compiler/checker.mjs";

const sourceCode = `
  fn("craig-string"); // throw with string vs number
  function fn(a: number) {}
`;
const sourceAst = parser(sourceCode);
const errors = checker(sourceAst);
console.log("Errors v1: ", errors);

const sourceCodeV2 = `
  fn("craig-string"); // throw with string vs number
  function fn(a: made_up_type) {} // throw with bad type
`;

const sourceAstV2 = parserV2(sourceCodeV2);
const errorsV2 = checker(sourceAstV2);
console.log("Errors v2: ", errorsV2);

const sourceCodeV3 = `
  interface Person {
    name: string;
  }
  fn({nam: "craig"}); // throw with "nam" vs "name"
  function fn(a: Person) {}
`;
const sourceAstV3 = parserV3(sourceCodeV3);
const errorsV3 = checker(sourceAstV3);
console.log("Errors v3: ", errorsV3);
