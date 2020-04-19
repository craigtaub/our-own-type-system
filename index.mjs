const sourceCode = `
  fn("craig-string"); // throw with string vs number
  function fn(a: number) {}
`;

function parser(code) {
  // fn("craig-string");
  const expressionAst = {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: "fn"
      },
      arguments: [
        {
          type: "StringLiteral", // Parser "Inference" for type.
          value: "craig-string"
        }
      ]
    }
  };

  // function fn(a: number) {}
  const declarationAst = {
    type: "FunctionDeclaration",
    id: {
      type: "Identifier",
      name: "fn"
    },
    params: [
      {
        type: "Identifier",
        name: "a",
        typeAnnotation: {
          // our only type annotation
          type: "TypeAnnotation",
          typeAnnotation: {
            type: "NumberTypeAnnotation"
          }
        }
      }
    ],
    body: {
      type: "BlockStatement",
      body: [] // our function is empty
    }
  };

  const programAst = {
    type: "File",
    program: {
      type: "Program",
      body: [expressionAst, declarationAst] // "body" === block/line of code
    }
  };
  // normal AST except with typeAnnotations on
  return programAst;
}

const ANNOTATED_TYPES = {
  NumberTypeAnnotation: "number"
};
function typeCheck(arg1, arg2) {
  switch (arg1) {
    case "NumberTypeAnnotation":
      return arg2 === "NumericLiteral";
  }
}

function checker(ast) {
  const errors = [];
  ast.program.body.map(stnmt => {
    switch (stnmt.type) {
      case "ExpressionStatement":
        const functionCalled = stnmt.expression.callee.name;
        const declationForName = ast.program.body.find(
          node =>
            node.type === "FunctionDeclaration" &&
            node.id.name === functionCalled
        );

        // Get declaration
        if (!declationForName) {
          errors.push(`Function "${functionCalled}" does not exist`);
          return;
        }

        // Array of arg-to-type. e.g. 0 = NumberTypeAnnotation
        const argTypeMap = declationForName.params.map(param => {
          if (param.typeAnnotation) {
            return param.typeAnnotation.typeAnnotation.type;
          }
        });

        // Check exp caller "arg type" with declaration "arg type"
        stnmt.expression.arguments.map((arg, index) => {
          const declarationType = argTypeMap[index];
          const callerType = arg.type;
          const callerValue = arg.value;

          // Declaration annotation more important here
          const isValid = typeCheck(declarationType, callerType);
          if (!isValid) {
            const annotatedType = ANNOTATED_TYPES[declarationType];
            // Show values to user, more explanatory than types
            errors.push(
              `Type "${callerValue}" is incompatible with "${annotatedType}"`
            );
          }
        });

        return;
    }
  });
  return errors;
}

const sourceAst = parser(sourceCode);
const errors = checker(sourceAst);
console.log("Errors: ", errors);
