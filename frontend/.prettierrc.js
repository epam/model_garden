module.exports = {
    arrowParens: "always",
    bracketSpacing: true,
    endOfLine: "lf",
    htmlWhitespaceSensitivity: "css",
    insertPragma: false,
    jsxBracketSameLine: false,
    jsxSingleQuote: false,
    printWidth: 120,
    proseWrap: "preserve",
    quoteProps: "as-needed",
    requirePragma: false,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: "none",
    useTabs: false,
    vueIndentScriptAndStyle: false,
    overrides: [
      {
        files: "*.json",
        options: {
          printWidth: 200
        }
      }
    ]
  };