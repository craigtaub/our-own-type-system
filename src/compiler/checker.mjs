const ANNOTATED_TYPES = {
  NumberTypeAnnotation: "number",
  GenericTypeAnnotation: true
};

function checker(ast) {
  const errors = [];

  // Logic for type checks
  const typeChecks = {
    expression: (declarationFullType, callerFullArg) => {
      switch (declarationFullType.typeAnnotation.type) {
        case "NumberTypeAnnotation":
          return callerFullArg.type === "NumericLiteral";
        case "GenericTypeAnnotation": // non-native
          // If called with Object, check properties
          if (callerFullArg.type === "ObjectExpression") {
            // Get Interface
            const interfaceNode = ast.program.body.find(
              node => node.type === "InterfaceDeclaration"
            );
            // Get properties
            const properties = interfaceNode.body.properties;

            // Check each property against caller
            properties.map((prop, index) => {
              const name = prop.key.name;
              const associatedName = callerFullArg.properties[index].key.name;
              if (name !== associatedName) {
                errors.push(
                  `Property "${associatedName}" does not exist on interface "${interfaceNode.id.name}". Did you mean Property "${name}"?`
                );
              }
            });
          }
          return true; // as already logged
      }
    },
    annotationCheck: arg => {
      return !!ANNOTATED_TYPES[arg];
    }
  };

  // Process program
  ast.program.body.map(stnmt => {
    switch (stnmt.type) {
      case "FunctionDeclaration":
        stnmt.params.map(arg => {
          // Does arg has a type annotation?
          if (arg.typeAnnotation) {
            const argType = arg.typeAnnotation.typeAnnotation.type;
            // Is type annotation valid
            const isValid = typeChecks.annotationCheck(argType);
            if (!isValid) {
              errors.push(
                `Type "${argType}" for argument "${arg.name}" does not exist`
              );
            }
          }
        });

        // Process function "block" code here
        stnmt.body.body.map(line => {
          // Ours has none
        });

        return;
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
            return param.typeAnnotation;
          }
        });

        // Check exp caller "arg type" with declaration "arg type"
        stnmt.expression.arguments.map((arg, index) => {
          const declarationType = argTypeMap[index].typeAnnotation.type;
          const callerType = arg.type;
          const callerValue = arg.value;

          // Declaration annotation more important here
          const isValid = typeChecks.expression(
            argTypeMap[index], // declaration details
            arg // caller details
          );

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

export { checker };
