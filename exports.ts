import * as ts from "typescript";

let output = new Map();

// Build a program using the set of root file names in fileNames
let program = ts.createProgram(process.argv.slice(2), {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.ES2015,
});

// Get the checker, we will use it to find more about classes
let checker = program.getTypeChecker();

// Visit every sourceFile in the program
for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    // Walk the tree to search for classes
    ts.forEachChild(sourceFile, visit);
  }
}

/** visit nodes finding exported classes */
function visit(node: ts.Node) {
  // Only consider exported nodes
  if (!isNodeExported(node)) {
    return;
  }

  if (ts.isClassDeclaration(node) && node.name) {
    let fileName = node.getSourceFile().fileName;
    let symbolName = checker.getSymbolAtLocation(node.name).getName();

    fileName = fileName.substr(fileName.lastIndexOf("/"));
    fileName = fileName.substr(0, fileName.length - 3);

    output.set(symbolName, fileName);

  } else if (ts.isModuleDeclaration(node)) {
    // This is a namespace, visit its children
    ts.forEachChild(node, visit);
  } else {
    return;
  }
}

/** True if this is visible outside this file, false otherwise */
function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0
  );
}

output.forEach((module, key) => console.log(`import { ${key} } from ".${module}"`));
console.log("export {");
output.forEach((module, key) => console.log(`${key},`));
console.log("}");
