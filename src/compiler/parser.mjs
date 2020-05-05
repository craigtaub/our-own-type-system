function parserV3(code) {
  // interface Person {
  //   name: string;
  // }
  const interfaceAst = {
    type: "InterfaceDeclaration",
    id: {
      type: "Identifier",
      name: "Person",
    },
    body: {
      type: "ObjectTypeAnnotation",
      properties: [
        {
          type: "ObjectTypeProperty",
          key: {
            type: "Identifier",
            name: "name",
          },
          kind: "init",
          method: false,
          value: {
            type: "StringTypeAnnotation",
          },
        },
      ],
    },
  };

  // fn({nam: "craig"});
  const expressionAst = {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: "fn",
      },
      arguments: [
        {
          type: "ObjectExpression",
          properties: [
            {
              type: "ObjectProperty",
              method: false,
              key: {
                type: "Identifier",
                name: "nam",
              },
              value: {
                type: "StringLiteral",
                value: "craig",
              },
            },
          ],
        },
      ],
    },
  };

  // function fn(a: Person) {}
  const declarationAst = {
    type: "FunctionDeclaration",
    id: {
      type: "Identifier",
      name: "fn",
    },
    params: [
      {
        type: "Identifier",
        name: "a",
        typeAnnotation: {
          type: "TypeAnnotation",
          typeAnnotation: {
            type: "GenericTypeAnnotation",
            id: {
              type: "Identifier",
              name: "Person",
            },
          },
        },
      },
    ],
    body: {
      type: "BlockStatement",
      body: [], // Empty function
    },
  };

  const programAst = {
    type: "File",
    program: {
      type: "Program",
      body: [interfaceAst, expressionAst, declarationAst],
    },
  };
  // normal AST except with typeAnnotations on
  return programAst;
}

function parserV2(code) {
  // fn("craig-string");
  const expressionAst = {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: "fn",
      },
      arguments: [
        {
          type: "StringLiteral", // Parser "Inference" for type.
          value: "craig-string",
        },
      ],
    },
  };

  // function fn(a: made_up_type) {}
  const declarationAst = {
    type: "FunctionDeclaration",
    id: {
      type: "Identifier",
      name: "fn",
    },
    params: [
      {
        type: "Identifier",
        name: "a",
        typeAnnotation: {
          // our only type annotation
          type: "TypeAnnotation",
          typeAnnotation: {
            type: "made_up_type", // BREAKS
          },
        },
      },
    ],
    body: {
      type: "BlockStatement",
      body: [], // "body" === block/line of code. Ours is empty
    },
  };

  const programAst = {
    type: "File",
    program: {
      type: "Program",
      body: [expressionAst, declarationAst],
    },
  };
  // normal AST except with typeAnnotations on
  return programAst;
}

function parser(code) {
  // fn("craig-string");
  const expressionAst = {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: "fn",
      },
      arguments: [
        {
          type: "StringLiteral", // Parser "Inference" for type.
          value: "craig-string",
        },
      ],
    },
  };

  // function fn(a: number) {}
  const declarationAst = {
    type: "FunctionDeclaration",
    id: {
      type: "Identifier",
      name: "fn",
    },
    params: [
      {
        type: "Identifier",
        name: "a",
        typeAnnotation: {
          // our only type annotation
          type: "TypeAnnotation",
          typeAnnotation: {
            type: "NumberTypeAnnotation",
          },
        },
      },
    ],
    body: {
      type: "BlockStatement",
      body: [], // "body" === block/line of code. Ours is empty
    },
  };

  const programAst = {
    type: "File",
    program: {
      type: "Program",
      body: [expressionAst, declarationAst],
    },
  };
  // normal AST except with typeAnnotations on
  return programAst;
}

export { parser, parserV2, parserV3 };
